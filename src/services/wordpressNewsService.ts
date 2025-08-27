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
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: Array<Array<{ name: string; [key: string]: any }>>;
    author?: WordPressAuthor[];
  };
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

interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: string;
  type: string;
  author_user_agent: string;
  meta: any[];
  _links: any;
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
  content?: string;
  author?: WordPressAuthor;
  commentCount?: number;
}

interface FormattedComment {
  id: number;
  postId: number;
  authorName: string;
  content: string;
  date: string;
  avatarUrl: string;
  authorUrl?: string; // Website URL of the comment author
  status?: string; // Comment status (approve, hold, etc.)
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
        const timeoutId = setTimeout(() => {
          console.log('WordPress news request timeout after 15 seconds');
          controller.abort();
        }, 15000); // Increased to 15 seconds

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
            console.error('WordPress API request was aborted (timeout or cancelled)');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error('WordPress API network/resource error:', error.message);
          } else {
            console.error('WordPress API error:', error.message);
          }
        } else {
          console.error('Unknown WordPress API error:', error);
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

  async fetchCommentsByPostId(postId: number): Promise<WordPressComment[]> {
    const cacheKey = `comments-post-${postId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached comments for post ${postId}`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Fetching comments for post ${postId}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`Comments request timeout for post ${postId}`);
          controller.abort();
        }, 10000);

        const response = await fetch(`${this.API_BASE}/comments?post=${postId}&status=approve,hold&per_page=100`, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Failed to fetch comments for post ${postId}: ${response.status}`);
          return [];
        }

        const comments = await response.json();
        console.log(`Successfully fetched ${comments.length} comments for post ${postId}`);
        apiCache.set(cacheKey, comments, 5); // Cache for 5 minutes
        return comments;
      } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        return [];
      }
    });
  }

  async fetchRecentComments(limit: number = 10): Promise<FormattedComment[]> {
    const cacheKey = `recent-comments-${limit}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached recent comments`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Fetching ${limit} recent comments`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('Recent comments request timeout');
          controller.abort();
        }, 10000);

        const response = await fetch(`${this.API_BASE}/comments?status=approve,hold&per_page=${limit}&orderby=date&order=desc`, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Failed to fetch recent comments: ${response.status}`);
          return [];
        }

        const comments: WordPressComment[] = await response.json();
        console.log(`Successfully fetched ${comments.length} recent comments`);
        
        const formattedComments: FormattedComment[] = comments.map(comment => ({
          id: comment.id,
          postId: comment.post,
          authorName: comment.author_name,
          content: this.stripHtmlTags(comment.content.rendered),
          date: this.formatDate(comment.date),
          avatarUrl: comment.author_avatar_urls['48'] || comment.author_avatar_urls['96'] || comment.author_avatar_urls['24']
        }));

        apiCache.set(cacheKey, formattedComments, 5); // Cache for 5 minutes
        return formattedComments;
      } catch (error) {
        console.error('Error fetching recent comments:', error);
        return [];
      }
    });
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

        // Get author from embedded data
        let authorInfo: WordPressAuthor | undefined;
        if (embedded && embedded.author && embedded.author[0]) {
          const author = embedded.author[0];
          authorInfo = {
            id: author.id,
            name: author.name,
            url: author.url,
            description: author.description,
            link: author.link,
            slug: author.slug,
            avatar_urls: author.avatar_urls || {
              24: 'https://secure.gravatar.com/avatar/?s=24&d=mm&r=g',
              48: 'https://secure.gravatar.com/avatar/?s=48&d=mm&r=g',
              96: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g'
            }
          };
        }

        // Get comment count for this post
        let commentCount = 0;
        try {
          const comments = await this.fetchCommentsByPostId(post.id);
          commentCount = comments.length;
        } catch (error) {
          console.warn(`Failed to get comment count for post ${post.id}:`, error);
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
            link: `https://megaphoneoz.com/${post.slug}`,
            content: post.content.rendered,
            author: authorInfo,
            commentCount: commentCount
          };

          formattedArticles.push(formattedArticle);
          console.log(`Added article with image: ${featuredImage}, comments: ${commentCount}`);
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

  async getLatestNewsByCategoryId(categoryId: number, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `category-id-${categoryId}-${limit}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached posts for category ID ${categoryId}`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Making WordPress API request for category ID ${categoryId}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`WordPress category request timeout after 15 seconds for category ID ${categoryId}`);
          controller.abort();
        }, 15000);

        const url = `${this.API_BASE}/posts?categories=${categoryId}&per_page=${limit}&status=publish&_embed`;
        console.log(`Full API URL: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts by category ID: ${response.status}`);
        }

        const posts = await response.json();
        console.log(`Successfully fetched ${posts.length} posts for category ID ${categoryId}`);
        console.log('Raw posts data:', posts);
        const formattedArticles: FormattedNewsArticle[] = [];

        for (const post of posts) {
          let featuredImage = '';
          let categoryName = 'NEWS';
          
          // Check for embedded media first
          const embedded = (post as any)._embedded;
          if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
            featuredImage = this.getOptimalImageUrl(embedded['wp:featuredmedia'][0]);
          } else if (post.featured_media) {
            const media = await this.fetchFeaturedMedia(post.featured_media);
            featuredImage = this.getOptimalImageUrl(media);
          }

          // Get category name from embedded data
          if (embedded && embedded['wp:term'] && embedded['wp:term'][0]) {
            const categories = embedded['wp:term'][0];
            if (categories && categories.length > 0) {
              categoryName = categories[0].name.toUpperCase();
            }
          }

          // Get author from embedded data
          let authorInfo: WordPressAuthor | undefined;
          if (embedded && embedded.author && embedded.author[0]) {
            const author = embedded.author[0];
            authorInfo = {
              id: author.id,
              name: author.name,
              url: author.url,
              description: author.description,
              link: author.link,
              slug: author.slug,
              avatar_urls: author.avatar_urls || {
                24: 'https://secure.gravatar.com/avatar/?s=24&d=mm&r=g',
                48: 'https://secure.gravatar.com/avatar/?s=48&d=mm&r=g',
                96: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g'
              }
            };
          }

          // Get comment count for this post
          let commentCount = 0;
          try {
            const comments = await this.fetchCommentsByPostId(post.id);
            commentCount = comments.length;
          } catch (error) {
            console.warn(`Failed to get comment count for post ${post.id}:`, error);
          }

          // Include all articles (with or without images for debugging)
          // Only filter out if image exists but is from wrong domain
          if (!featuredImage || featuredImage.includes('megaphoneoz.com')) {
            const formattedArticle: FormattedNewsArticle = {
              id: post.id,
              title: this.stripHtmlTags(post.title.rendered),
              date: this.formatDate(post.date),
              excerpt: this.stripHtmlTags(post.excerpt.rendered),
              image: featuredImage,
              category: categoryName,
              slug: post.slug,
              link: `https://megaphoneoz.com/${post.slug}`,
              content: post.content.rendered,
              author: authorInfo,
              commentCount: commentCount
            };

            console.log(`Added article: "${formattedArticle.title}" with image: ${featuredImage || 'no image'}, comments: ${commentCount}`);
            formattedArticles.push(formattedArticle);
          }
        }

        console.log(`Successfully processed ${formattedArticles.length} articles for category ID ${categoryId}`);
        apiCache.set(cacheKey, formattedArticles, 5); // Cache for 5 minutes
        return formattedArticles;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error(`WordPress category request was aborted for category ID ${categoryId}`);
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error(`WordPress API network/resource error for category ID ${categoryId}:`, error.message);
          } else {
            console.error(`WordPress API error for category ID ${categoryId}:`, error.message);
          }
        } else {
          console.error(`Unknown error getting news for category ID ${categoryId}:`, error);
        }
        return [];
      }
    });
  }

  async getPostById(postId: number): Promise<FormattedNewsArticle | null> {
    const cacheKey = `post-${postId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached post for ID ${postId}`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Making WordPress API request for post ID ${postId}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`WordPress post request timeout after 15 seconds for post ID ${postId}`);
          controller.abort();
        }, 15000);

        const url = `${this.API_BASE}/posts/${postId}?_embed`;
        console.log(`Full API URL: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`Post ${postId} not found`);
            return null;
          }
          throw new Error(`Failed to fetch post by ID: ${response.status}`);
        }

        const post = await response.json();
        console.log(`Successfully fetched post ${postId}:`, post.title.rendered);
        
        // Process the single post
        let featuredImage = '';
        let categoryName = 'NEWS';
        let authorInfo: WordPressAuthor | undefined;
        
        // Check for embedded data
        const embedded = (post as any)._embedded;
        
        // Get featured image
        if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
          featuredImage = this.getOptimalImageUrl(embedded['wp:featuredmedia'][0]);
        } else if (post.featured_media) {
          const media = await this.fetchFeaturedMedia(post.featured_media);
          featuredImage = this.getOptimalImageUrl(media);
        }

        // Get category name
        if (embedded && embedded['wp:term'] && embedded['wp:term'][0]) {
          const categories = embedded['wp:term'][0];
          if (categories && categories.length > 0) {
            categoryName = categories[0].name.toUpperCase();
          }
        }

        // Get author from embedded data
        if (embedded && embedded.author && embedded.author[0]) {
          const author = embedded.author[0];
          authorInfo = {
            id: author.id,
            name: author.name,
            url: author.url,
            description: author.description,
            link: author.link,
            slug: author.slug,
            avatar_urls: author.avatar_urls || {
              24: 'https://secure.gravatar.com/avatar/?s=24&d=mm&r=g',
              48: 'https://secure.gravatar.com/avatar/?s=48&d=mm&r=g',
              96: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g'
            }
          };
          console.log('Found author data:', authorInfo);
        }

        const formattedArticle: FormattedNewsArticle = {
          id: post.id,
          title: this.stripHtmlTags(post.title.rendered),
          date: this.formatDate(post.date),
          excerpt: this.stripHtmlTags(post.excerpt.rendered),
          image: featuredImage,
          category: categoryName,
          slug: post.slug,
          link: `https://megaphoneoz.com/${post.slug}`,
          content: post.content.rendered, // Full HTML content
          author: authorInfo
        };

        console.log(`Successfully processed post ${postId}:`, formattedArticle);
        apiCache.set(cacheKey, formattedArticle, 10); // Cache for 10 minutes
        return formattedArticle;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error(`WordPress post request was aborted for post ID ${postId}`);
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error(`WordPress API network/resource error for post ID ${postId}:`, error.message);
          } else {
            console.error(`WordPress API error for post ID ${postId}:`, error.message);
          }
        } else {
          console.error(`Unknown error getting post ${postId}:`, error);
        }
        return null;
      }
    });
  }

  async getLatestNewsByCategory(categorySlug: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `category-${categorySlug}-${limit}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Using cached posts for category ${categorySlug}`);
      return cached;
    }

    return this.queueRequest(async () => {
      console.log(`Making WordPress API request for category ${categorySlug}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`WordPress category request timeout after 15 seconds for ${categorySlug}`);
          controller.abort();
        }, 15000);

        const response = await fetch(`${this.API_BASE}/posts?categories_slug=${categorySlug}&per_page=${limit}&status=publish&_embed`, {
          headers: {
            'Authorization': this.AUTH_HEADER,
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts by category: ${response.status}`);
        }

        const posts = await response.json();
        console.log(`Successfully fetched ${posts.length} posts for category ${categorySlug}`);
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

          // Include all articles (with or without images for debugging)
          // Only filter out if image exists but is from wrong domain
          if (!featuredImage || featuredImage.includes('megaphoneoz.com')) {
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

        console.log(`Successfully processed ${formattedArticles.length} articles for category ${categorySlug}`);
        apiCache.set(cacheKey, formattedArticles, 5); // Cache for 5 minutes
        return formattedArticles;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error(`WordPress category request was aborted for ${categorySlug}`);
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error(`WordPress API network/resource error for ${categorySlug}:`, error.message);
          } else {
            console.error(`WordPress API error for ${categorySlug}:`, error.message);
          }
        } else {
          console.error(`Unknown error getting news for category ${categorySlug}:`, error);
        }
        return [];
      }
    });
  }

  /**
   * Search posts by keyword
   * Uses WordPress REST API search endpoint
   * @param searchTerm The search term
   * @param limit Maximum number of results
   * @returns Promise<FormattedNewsArticle[]>
   */
  async searchPosts(searchTerm: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `search-${encodeURIComponent(searchTerm)}-${limit}`;

    // Try cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached search results for: "${searchTerm}"`);
      return cached;
    }

    return this.queueRequest(async () => {
      try {
        console.log(`Searching WordPress posts for: "${searchTerm}"`);
        
        // WordPress REST API search endpoint
        const searchUrl = `${this.API_BASE}/posts?search=${encodeURIComponent(searchTerm)}&per_page=${limit}&_embed`;
        
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...this.AUTH_HEADER ? { 'Authorization': this.AUTH_HEADER } : {},
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`WordPress search API error: ${response.status} ${response.statusText}`);
        }

        const posts: WordPressPost[] = await response.json();
        console.log(`WordPress search API returned ${posts.length} posts for "${searchTerm}"`);

        if (!posts || posts.length === 0) {
          console.warn(`No search results found for: "${searchTerm}"`);
          return [];
        }

        const formattedArticles: FormattedNewsArticle[] = [];

        for (const post of posts) {
          // Get featured image
          let featuredImage = '';
          if (post.featured_media > 0 && post._embedded?.['wp:featuredmedia']) {
            const media = post._embedded['wp:featuredmedia'][0];
            if (media?.source_url) {
              featuredImage = media.source_url;
            }
          }

          // Get category name
          let categoryName = 'News';
          if (post.categories && post.categories.length > 0 && post._embedded?.['wp:term']) {
            const categories = post._embedded['wp:term']?.[0];
            if (categories && categories.length > 0) {
              categoryName = categories[0].name || 'News';
            }
          }

          const formattedArticle: FormattedNewsArticle = {
            id: post.id,
            title: this.stripHtmlTags(post.title.rendered),
            date: this.formatDate(post.date),
            excerpt: this.stripHtmlTags(post.excerpt.rendered),
            image: featuredImage,
            category: categoryName.toUpperCase(),
            slug: post.slug,
            link: `https://megaphoneoz.com/${post.slug}`
          };

          formattedArticles.push(formattedArticle);
        }

        console.log(`Successfully processed ${formattedArticles.length} search results for "${searchTerm}"`);
        apiCache.set(cacheKey, formattedArticles, 5); // Cache for 5 minutes
        return formattedArticles;

      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error(`WordPress search request was aborted for "${searchTerm}"`);
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error(`WordPress search API network/resource error for "${searchTerm}":`, error.message);
          } else {
            console.error(`WordPress search API error for "${searchTerm}":`, error.message);
          }
        } else {
          console.error(`Unknown error searching WordPress for "${searchTerm}":`, error);
        }
        return [];
      }
    });
  }

  /**
   * Submit a new comment to a WordPress post
   * @param postId The ID of the post to comment on
   * @param authorName The name of the comment author
   * @param authorEmail The email of the comment author
   * @param content The comment content
   * @param authorUrl Optional website URL of the author
   * @returns Promise<WordPressComment | null>
   */
  async submitComment(
    postId: number,
    authorName: string,
    authorEmail: string,
    content: string,
    authorUrl?: string
  ): Promise<WordPressComment | null> {
    return this.queueRequest(async () => {
      try {
        console.log(`Submitting comment to post ${postId} by ${authorName}`);
        
        const commentData = {
          post: postId,
          author_name: authorName,
          author_email: authorEmail,
          author_url: authorUrl || '',
          content: content,
          status: 'approved' // Set to 'approved' for immediate display, 'hold' for moderation queue
        };

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${this.API_BASE}/comments`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.AUTH_HEADER
          },
          body: JSON.stringify(commentData),
          signal: controller.signal
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`WordPress comment submission failed: ${response.status} ${response.statusText}`, errorText);
          
          if (response.status === 403) {
            throw new Error('Comment submission not allowed. Please check permissions.');
          } else if (response.status === 400) {
            throw new Error('Invalid comment data. Please check all required fields.');
          } else {
            throw new Error(`Comment submission failed: ${response.status} ${response.statusText}`);
          }
        }

        const comment: WordPressComment = await response.json();
        console.log('Comment submitted successfully:', comment);
        
        // Clear related cache entries to refresh comments
        const cacheKeys = [
          `comments-post-${postId}`,
          `recent-comments-5`,
          `recent-comments-10`
        ];
        cacheKeys.forEach(key => apiCache.delete(key));
        
        return comment;

      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error(`Comment submission was aborted for post ${postId}`);
          } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            console.error(`WordPress comment API network error for post ${postId}:`, error.message);
          } else {
            console.error(`WordPress comment API error for post ${postId}:`, error.message);
          }
        } else {
          console.error(`Unknown error submitting comment to post ${postId}:`, error);
        }
        throw error; // Re-throw to allow component to handle the error
      }
    });
  }
}

export default WordPressNewsService;
export type { FormattedNewsArticle, WordPressPost, WordPressMedia, WordPressAuthor, WordPressComment, FormattedComment };
