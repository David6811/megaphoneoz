import { apiCache } from '../utils/cache';

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
  private static requestQueue: Promise<any>[] = [];
  private static readonly MAX_CONCURRENT_REQUESTS = 3;
  private static instance: WordPressNewsService | null = null;

  constructor() {
    // Using application password authentication
    const username = 'oliverwen.sydney@gmail.com';
    const appPassword = 'UDCX Qq5E aCls lusr d9BM LZ0Q';
    this.AUTH_HEADER = 'Basic ' + btoa(`${username}:${appPassword}`);
  }

  // Singleton pattern to avoid multiple instances
  static getInstance(): WordPressNewsService {
    if (!WordPressNewsService.instance) {
      console.log('Creating new WordPress service instance');
      WordPressNewsService.instance = new WordPressNewsService();
    }
    return WordPressNewsService.instance;
  }

  private async queueRequest<T>(requestFunction: () => Promise<T>): Promise<T> {
    // Wait if too many concurrent requests
    if (WordPressNewsService.requestQueue.length >= WordPressNewsService.MAX_CONCURRENT_REQUESTS) {
      console.log('Waiting for available request slot...');
      await Promise.race(WordPressNewsService.requestQueue);
    }

    const requestPromise = requestFunction().finally(() => {
      // Remove this request from the queue when done
      const index = WordPressNewsService.requestQueue.indexOf(requestPromise);
      if (index > -1) {
        WordPressNewsService.requestQueue.splice(index, 1);
      }
    });

    WordPressNewsService.requestQueue.push(requestPromise);
    return requestPromise;
  }

  async fetchLatestPosts(limit: number = 5): Promise<WordPressPost[]> {
    const cacheKey = `latest-posts-${limit}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached posts for limit ${limit}`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Making WordPress API request for ${limit} posts`);
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds

        const response = await fetch(`${this.API_BASE}/posts?per_page=${limit}&status=publish&_embed`, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors' // Explicitly set CORS mode
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`WordPress API returned ${response.status}: ${response.statusText}`);
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Successfully fetched ${result.length} posts from WordPress API`);
        apiCache.set(cacheKey, result, 5); // Increased cache time to 5 minutes
        return result;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error('WordPress API request timed out - using fallback data');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error('WordPress API network/resource error - using fallback data');
          } else {
            console.error('WordPress API error:', error.message, '- using fallback data');
          }
        } else {
          console.error('Unknown WordPress API error - using fallback data');
        }
        throw error;
      }
    });
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
      console.warn('No media object provided for image optimization');
      return ''; // Return empty string instead of placeholder
    }

    // Log media details for debugging
    console.log('Processing media:', {
      id: media.id,
      source_url: media.source_url,
      available_sizes: media.media_details?.sizes ? Object.keys(media.media_details.sizes) : 'No sizes available'
    });

    // Try to get the best size for the slider (larger images preferred)
    const sizes = media.media_details?.sizes;
    if (sizes) {
      // For featured slider, prefer larger sizes
      const preferredSizes = ['featuredfull', 'large', 'medium_large', 'featured', 'medium', 'full'];
      for (const size of preferredSizes) {
        if (sizes[size] && sizes[size].source_url) {
          console.log(`Using ${size} image:`, sizes[size].source_url);
          return sizes[size].source_url;
        }
      }
    }

    // Fallback to original source URL
    if (media.source_url) {
      console.log('Using original source URL:', media.source_url);
      return media.source_url;
    }

    console.warn('No valid image URL found for media ID:', media.id);
    return '';
  }

  async getLatestNewsForSlider(limit: number = 5): Promise<FormattedNewsArticle[]> {
    try {
      const posts = await this.fetchLatestPosts(limit);
      const formattedArticles: FormattedNewsArticle[] = [];

      console.log(`Processing ${posts.length} WordPress posts for slider`);

      for (const post of posts) {
        console.log(`Processing post: "${post.title.rendered}" (ID: ${post.id})`);
        
        // Try to get image from _embedded data first (more efficient)
        let featuredImage = '';
        let categoryName = 'NEWS';
        
        // Check if post has embedded data (from _embed parameter)
        const embedded = (post as any)._embedded;
        
        if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
          // Use embedded media data
          const embeddedMedia = embedded['wp:featuredmedia'][0];
          console.log('Found embedded media for post', post.id);
          featuredImage = this.getOptimalImageUrl(embeddedMedia);
        } else if (post.featured_media) {
          // Fallback to separate API call
          console.log('Fetching media separately for post', post.id);
          const media = await this.fetchFeaturedMedia(post.featured_media);
          featuredImage = this.getOptimalImageUrl(media);
        } else {
          console.log('No featured media found for post', post.id);
        }

        // Get category from embedded data or fetch separately
        if (embedded && embedded['wp:term'] && embedded['wp:term'][0]) {
          // Use embedded category data
          const categories = embedded['wp:term'][0];
          if (categories && categories.length > 0) {
            categoryName = categories[0].name.toUpperCase();
          }
        } else if (post.categories && post.categories.length > 0) {
          // Fallback to separate API call
          const category = await this.fetchCategory(post.categories[0]);
          if (category) {
            categoryName = category.name.toUpperCase();
          }
        }

        // Only include articles with valid images (WordPress images only)
        if (featuredImage && featuredImage.includes('megaphoneoz.com')) {
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
          console.log(`Added article with image: ${featuredImage}`);
        } else {
          console.log(`Skipping article "${post.title.rendered}" - no valid WordPress image`);
        }
      }

      console.log(`Successfully processed ${formattedArticles.length} articles with WordPress images`);
      return formattedArticles;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          console.error('WordPress API network error in getLatestNewsForSlider:', error.message);
        } else {
          console.error('WordPress API error in getLatestNewsForSlider:', error.message);
        }
      } else {
        console.error('Unknown error in getLatestNewsForSlider:', error);
      }
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
        let featuredImage = '';
        
        // Check for embedded media first
        const embedded = (post as any)._embedded;
        if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
          featuredImage = this.getOptimalImageUrl(embedded['wp:featuredmedia'][0]);
        } else if (post.featured_media) {
          const media = await this.fetchFeaturedMedia(post.featured_media);
          featuredImage = this.getOptimalImageUrl(media);
        }

        // Only include articles with valid WordPress images
        if (featuredImage && featuredImage.includes('megaphoneoz.com')) {
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