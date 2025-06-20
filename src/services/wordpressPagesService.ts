import { apiCache } from '../utils/cache';

interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
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
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    'version-history': Array<{ count: number; href: string }>;
    'wp:featuredmedia': Array<{ embeddable: boolean; href: string }>;
    'wp:attachment': Array<{ href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_email: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    [key: string]: string;
  };
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ embeddable: boolean; post_type: string; href: string }>;
  };
}

interface FormattedPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  link: string;
  date: string;
  author: number;
  status: string;
  commentStatus: string;
}

interface FormattedComment {
  id: number;
  author: string;
  authorUrl: string;
  content: string;
  date: string;
  parentId: number;
  status: string;
  avatarUrl: string;
}

class WordPressPagesService {
  private readonly API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';
  private readonly AUTH_HEADER: string;

  constructor() {
    // Using application password authentication
    const username = 'oliverwen.sydney@gmail.com';
    const appPassword = 'UDCX Qq5E aCls lusr d9BM LZ0Q';
    this.AUTH_HEADER = 'Basic ' + btoa(`${username}:${appPassword}`);
  }

  async fetchAllPages(): Promise<WordPressPage[]> {
    try {
      const response = await fetch(`${this.API_BASE}/pages?per_page=100&status=publish`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress pages:', error);
      throw error;
    }
  }

  async fetchPageBySlug(slug: string): Promise<WordPressPage | null> {
    const cacheKey = `page-slug-${slug}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.API_BASE}/pages?slug=${slug}&status=publish`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page by slug: ${response.status}`);
      }

      const pages = await response.json();
      const result = pages.length > 0 ? pages[0] : null;
      
      if (result) {
        apiCache.set(cacheKey, result, 10); // Cache for 10 minutes
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching WordPress page by slug:', error);
      return null;
    }
  }

  async fetchPageById(id: number): Promise<WordPressPage | null> {
    try {
      const response = await fetch(`${this.API_BASE}/pages/${id}`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page by ID: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching WordPress page by ID:', error);
      return null;
    }
  }

  async fetchCommentsForPage(pageId: number): Promise<WordPressComment[]> {
    const cacheKey = `comments-${pageId}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.API_BASE}/comments?post=${pageId}&status=approve&per_page=100`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const result = await response.json();
      apiCache.set(cacheKey, result, 5); // Cache comments for 5 minutes
      return result;
    } catch (error) {
      console.error('Error fetching WordPress comments:', error);
      return [];
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private stripHtmlTags(html: string): string {
    // Remove HTML tags and decode HTML entities
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  formatPage(page: WordPressPage): FormattedPage {
    return {
      id: page.id,
      title: this.stripHtmlTags(page.title.rendered),
      slug: page.slug,
      content: page.content.rendered, // Keep HTML for proper rendering
      excerpt: this.stripHtmlTags(page.excerpt.rendered),
      link: page.link,
      date: this.formatDate(page.date),
      author: page.author,
      status: page.status,
      commentStatus: page.comment_status
    };
  }

  formatComment(comment: WordPressComment): FormattedComment {
    return {
      id: comment.id,
      author: comment.author_name,
      authorUrl: comment.author_url,
      content: comment.content.rendered, // Keep HTML for proper rendering
      date: this.formatDate(comment.date),
      parentId: comment.parent,
      status: comment.status,
      avatarUrl: comment.author_avatar_urls['96'] || comment.author_avatar_urls['48'] || ''
    };
  }

  async getAllPagesWithDetails(): Promise<FormattedPage[]> {
    try {
      const pages = await this.fetchAllPages();
      return pages.map(page => this.formatPage(page));
    } catch (error) {
      console.error('Error getting all pages with details:', error);
      return [];
    }
  }

  async getPageWithComments(identifier: string | number): Promise<{ page: FormattedPage | null, comments: FormattedComment[] }> {
    try {
      let page: WordPressPage | null = null;
      
      if (typeof identifier === 'string') {
        page = await this.fetchPageBySlug(identifier);
      } else {
        page = await this.fetchPageById(identifier);
      }

      if (!page) {
        return { page: null, comments: [] };
      }

      const comments = await this.fetchCommentsForPage(page.id);
      
      return {
        page: this.formatPage(page),
        comments: comments.map(comment => this.formatComment(comment))
      };
    } catch (error) {
      console.error('Error getting page with comments:', error);
      return { page: null, comments: [] };
    }
  }

  async searchPages(searchTerm: string): Promise<FormattedPage[]> {
    try {
      const response = await fetch(`${this.API_BASE}/pages?search=${encodeURIComponent(searchTerm)}&status=publish`, {
        headers: {
          'Authorization': this.AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search pages: ${response.status}`);
      }

      const pages = await response.json();
      return pages.map((page: WordPressPage) => this.formatPage(page));
    } catch (error) {
      console.error('Error searching WordPress pages:', error);
      return [];
    }
  }
}

export default WordPressPagesService;
export type { FormattedPage, FormattedComment, WordPressPage, WordPressComment };