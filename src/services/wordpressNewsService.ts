interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    'version-history': Array<{ count: number; href: string }>;
    'wp:featuredmedia': Array<{ embeddable: boolean; href: string }>;
    'wp:attachment': Array<{ href: string }>;
    'wp:term': Array<{ taxonomy: string; embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  title: {
    rendered: string;
  };
  author: number;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

interface FormattedNewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  slug: string;
  link: string;
}

class WordPressNewsService {
  private readonly API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';
  private readonly AUTH_HEADER: string;

  constructor() {
    // Using application password authentication
    const username = 'oliverwen.sydney@gmail.com';
    const appPassword = 'UDCX Qq5E aCls lusr d9BM LZ0Q';
    this.AUTH_HEADER = 'Basic ' + btoa(`${username}:${appPassword}`);
  }

  async fetchLatestPosts(limit: number = 5): Promise<WordPressPost[]> {
    try {
      const response = await fetch(`${this.API_BASE}/posts?per_page=${limit}&status=publish&_embed`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      throw error;
    }
  }

  async fetchFeaturedMedia(mediaId: number): Promise<WordPressMedia | null> {
    try {
      const response = await fetch(`${this.API_BASE}/media/${mediaId}`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch media ${mediaId}: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress media:', error);
      return null;
    }
  }

  async fetchCategory(categoryId: number): Promise<WordPressCategory | null> {
    try {
      const response = await fetch(`${this.API_BASE}/categories/${categoryId}`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch category ${categoryId}: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress category:', error);
      return null;
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private stripHtmlTags(html: string): string {
    // Remove HTML tags and decode HTML entities
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  private getOptimalImageUrl(media: WordPressMedia | null): string {
    if (!media) {
      return 'https://picsum.photos/800/400?random=1'; // Fallback placeholder
    }

    // Try to get a medium-large size image, fallback to source URL
    const sizes = media.media_details?.sizes;
    if (sizes) {
      // Prefer medium_large, large, or medium sizes for slider
      const preferredSizes = ['medium_large', 'large', 'medium', 'thumbnail'];
      for (const size of preferredSizes) {
        if (sizes[size]) {
          return sizes[size].source_url;
        }
      }
    }

    return media.source_url;
  }

  async getLatestNewsForSlider(limit: number = 5): Promise<FormattedNewsArticle[]> {
    try {
      const posts = await this.fetchLatestPosts(limit);
      const formattedArticles: FormattedNewsArticle[] = [];

      for (const post of posts) {
        // Fetch featured media if available
        let featuredImage = 'https://picsum.photos/800/400?random=' + post.id;
        if (post.featured_media) {
          const media = await this.fetchFeaturedMedia(post.featured_media);
          featuredImage = this.getOptimalImageUrl(media);
        }

        // Get category name if available
        let categoryName = 'NEWS';
        if (post.categories && post.categories.length > 0) {
          const category = await this.fetchCategory(post.categories[0]);
          if (category) {
            categoryName = category.name.toUpperCase();
          }
        }

        const formattedArticle: FormattedNewsArticle = {
          id: post.id,
          title: this.stripHtmlTags(post.title.rendered),
          date: this.formatDate(post.date),
          excerpt: this.stripHtmlTags(post.excerpt.rendered),
          image: featuredImage,
          category: categoryName,
          slug: post.slug,
          link: `https://megaphoneoz.com/${post.slug}`
        };

        formattedArticles.push(formattedArticle);
      }

      return formattedArticles;
    } catch (error) {
      console.error('Error getting latest news for slider:', error);
      // Return empty array on error - component will handle fallback
      return [];
    }
  }

  async getLatestNewsByCategory(categorySlug: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    try {
      const response = await fetch(`${this.API_BASE}/posts?categories_slug=${categorySlug}&per_page=${limit}&status=publish&_embed`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts by category: ${response.status}`);
      }

      const posts = await response.json();
      const formattedArticles: FormattedNewsArticle[] = [];

      for (const post of posts) {
        let featuredImage = 'https://picsum.photos/400/250?random=' + post.id;
        if (post.featured_media) {
          const media = await this.fetchFeaturedMedia(post.featured_media);
          featuredImage = this.getOptimalImageUrl(media);
        }

        const formattedArticle: FormattedNewsArticle = {
          id: post.id,
          title: this.stripHtmlTags(post.title.rendered),
          date: this.formatDate(post.date),
          excerpt: this.stripHtmlTags(post.excerpt.rendered),
          image: featuredImage,
          category: categorySlug.toUpperCase(),
          slug: post.slug,
          link: `https://megaphoneoz.com/${post.slug}`
        };

        formattedArticles.push(formattedArticle);
      }

      return formattedArticles;
    } catch (error) {
      console.error('Error getting news by category:', error);
      return [];
    }
  }
}

export default WordPressNewsService;
export type { FormattedNewsArticle, WordPressPost, WordPressMedia };