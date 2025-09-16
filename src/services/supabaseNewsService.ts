import { supabase } from '../config/supabase'
import { apiCache } from '../utils/cache'

// WordPress-compatible interfaces (matching your existing types)
interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  slug: string
  status: string
  type: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[]
    'wp:term'?: Array<Array<{ name: string; [key: string]: any }>>
    author?: WordPressAuthor[]
  }
  _links: {
    self: Array<{ href: string }>
    collection: Array<{ href: string }>
    about: Array<{ href: string }>
    author: Array<{ embeddable: boolean; href: string }>
    replies: Array<{ embeddable: boolean; href: string }>
    'version-history': Array<{ count: number; href: string }>
    'wp:featuredmedia': Array<{ embeddable: boolean; href: string }>
    'wp:attachment': Array<{ href: string }>
    'wp:term': Array<{ taxonomy: string; embeddable: boolean; href: string }>
    curies: Array<{ name: string; href: string; templated: boolean }>
  }
}

interface WordPressMedia {
  id: number
  date: string
  slug: string
  type: string
  title: {
    rendered: string
  }
  author: number
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: {
      [key: string]: {
        file: string
        width: number
        height: number
        mime_type: string
        source_url: string
      }
    }
  }
  source_url: string
}

interface WordPressAuthor {
  id: number
  name: string
  email?: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    24: string
    48: string
    96: string
  }
}

interface WordPressComment {
  id: number
  post: number
  parent: number
  author: number
  author_name: string
  author_url: string
  author_avatar_urls: {
    24: string
    48: string
    96: string
  }
  date: string
  date_gmt: string
  content: {
    rendered: string
  }
  link: string
  status: string
  type: string
  author_user_agent: string
  meta: any[]
  _links: any
}

interface FormattedNewsArticle {
  id: number
  title: string
  date: string
  excerpt: string
  image: string
  category: string
  slug: string
  link: string
  content?: string
  author?: WordPressAuthor
  commentCount?: number
}

interface FormattedComment {
  id: number
  postId: number
  authorName: string
  content: string
  date: string
  avatarUrl: string
  authorUrl?: string
  status?: string
}

/**
 * Supabase News Service - Direct Supabase integration
 * Provides WordPress-compatible interface using Supabase data
 */
class SupabaseNewsService {
  private static requestQueue: Promise<any>[] = []
  private static readonly MAX_CONCURRENT_REQUESTS = 3
  private static instance: SupabaseNewsService | null = null

  // Singleton pattern to avoid multiple instances
  static getInstance(): SupabaseNewsService {
    if (!SupabaseNewsService.instance) {
      console.log('Creating new Supabase news service instance')
      SupabaseNewsService.instance = new SupabaseNewsService()
    }
    return SupabaseNewsService.instance
  }

  private async queueRequest<T>(requestFunction: () => Promise<T>): Promise<T> {
    // Wait if too many concurrent requests
    if (SupabaseNewsService.requestQueue.length >= SupabaseNewsService.MAX_CONCURRENT_REQUESTS) {
      console.log('Waiting for available request slot...')
      await Promise.race(SupabaseNewsService.requestQueue)
    }

    const requestPromise = requestFunction().finally(() => {
      // Remove this request from the queue when done
      const index = SupabaseNewsService.requestQueue.indexOf(requestPromise)
      if (index > -1) {
        SupabaseNewsService.requestQueue.splice(index, 1)
      }
    })

    SupabaseNewsService.requestQueue.push(requestPromise)
    return requestPromise
  }

  /**
   * Transform Supabase post to WordPress format
   */
  private transformToWordPressPost(post: any, author?: any): WordPressPost {
    const wpPost: WordPressPost = {
      id: post.id,
      date: post.created_at,
      date_gmt: post.created_at,
      modified: post.updated_at || post.created_at,
      slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || `post-${post.id}`,
      status: post.status || 'publish',
      type: 'post',
      title: {
        rendered: post.title || ''
      },
      content: {
        rendered: post.content || '',
        protected: false
      },
      excerpt: {
        rendered: post.excerpt || this.generateExcerpt(post.content),
        protected: false
      },
      author: post.author_id || 1,
      featured_media: post.cover_image_url ? 1 : 0,
      comment_status: 'open',
      ping_status: 'closed',
      sticky: false,
      template: '',
      format: 'standard',
      categories: post.category ? [this.getCategoryId(post.category)] : [],
      tags: [],
      _links: {
        self: [{ href: `${window.location.origin}/api/posts/${post.id}` }],
        collection: [{ href: `${window.location.origin}/api/posts` }],
        about: [{ href: `${window.location.origin}/api/posts` }],
        author: [{ embeddable: true, href: `${window.location.origin}/api/users/${post.user_id}` }],
        replies: [{ embeddable: true, href: `${window.location.origin}/api/posts/${post.id}/comments` }],
        'version-history': [{ count: 1, href: `${window.location.origin}/api/posts/${post.id}/revisions` }],
        'wp:featuredmedia': [{ embeddable: true, href: `${window.location.origin}/api/media/1` }],
        'wp:attachment': [{ href: `${window.location.origin}/api/posts/${post.id}/attachments` }],
        'wp:term': [{ taxonomy: 'category', embeddable: true, href: `${window.location.origin}/api/posts/${post.id}/categories` }],
        curies: [{ name: 'wp', href: 'https://api.w.org/{rel}', templated: true }]
      }
    }

    // Add embedded data if author is provided
    if (author) {
      wpPost._embedded = {
        author: [this.transformToWordPressAuthor(author)],
        'wp:featuredmedia': post.cover_image_url ? [this.createMediaFromUrl(post.cover_image_url)] : [],
        'wp:term': [[{ name: post.category || 'News' }]]
      }
    }

    return wpPost
  }

  /**
   * Convert string (UUID) to numeric ID for WordPress compatibility
   */
  private hashStringToNumber(str: string): number {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate initials from display name for avatar fallback
   */
  private generateInitials(name: string): string {
    if (!name) return 'MO';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  }

  /**
   * Generate avatar URL with initials fallback
   */
  private generateAvatarUrl(profile: any, size: number): string {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
    const displayName = profile?.display_name || profile?.full_name || 'MegaphoneOZ';
    const initials = this.generateInitials(displayName);
    
    // Use a service that generates avatar with initials (you can replace with your preferred service)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=c60800&color=fff&bold=true`;
  }

  /**
   * Transform Supabase profile to WordPress author format
   */
  private transformToWordPressAuthor(profile: any): WordPressAuthor {
    if (!profile) {
      // 返回通用作者信息
      return {
        id: 0, // 使用0表示通用编辑团队
        name: 'MegaphoneOZ Editorial Team',
        url: '',
        description: 'The MegaphoneOZ editorial team brings you the latest news and insights.',
        link: `${window.location.origin}/author/editorial`,
        slug: 'editorial',
        avatar_urls: {
          24: this.generateAvatarUrl(null, 24),
          48: this.generateAvatarUrl(null, 48),
          96: this.generateAvatarUrl(null, 96)
        }
      }
    }

    const displayName = profile.display_name || profile.full_name || 'Unknown Author';
    const username = profile.username || `user-${profile.id}`;
    
    // 将UUID转换为数字ID（使用hashCode）
    const numericId = this.hashStringToNumber(profile.id);
    
    return {
      id: numericId,
      name: displayName,
      email: profile.email || undefined,
      url: '',
      description: profile.bio || `${displayName} is a contributor to MegaphoneOZ.`,
      link: `${window.location.origin}/author/${username}`,
      slug: username,
      avatar_urls: {
        24: this.generateAvatarUrl(profile, 24),
        48: this.generateAvatarUrl(profile, 48),
        96: this.generateAvatarUrl(profile, 96)
      }
    }
  }

  /**
   * Transform to FormattedNewsArticle
   */
  private transformToFormattedArticle(post: any, author?: any): FormattedNewsArticle {
    return {
      id: post.id,
      title: this.stripHtmlTags(post.title || ''),
      date: this.formatDate(post.created_at),
      excerpt: this.stripHtmlTags(post.excerpt || this.generateExcerpt(post.content)),
      image: post.cover_image_url || '',
      category: post.category?.toUpperCase() || 'NEWS',
      slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || `post-${post.id}`,
      link: `${window.location.origin}/posts/${post.id}`,
      content: post.content || '',
      author: author ? this.transformToWordPressAuthor(author) : undefined
    }
  }

  /**
   * Get latest posts using Supabase
   */
  async fetchLatestPosts(limit: number = 5): Promise<WordPressPost[]> {
    const cacheKey = `supabase-latest-posts-${limit}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase posts for limit ${limit}`)
      return cached
    }

    return this.queueRequest(async () => {
      console.log(`Making Supabase request for ${limit} posts`)
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'publish')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        const wpPosts = posts?.map(post => this.transformToWordPressPost(post, null)) || []
        console.log(`Successfully fetched ${wpPosts.length} posts from Supabase`)
        
        apiCache.set(cacheKey, wpPosts, 5)
        return wpPosts
      } catch (error) {
        console.error('Supabase API error:', error)
        throw error
      }
    })
  }

  /**
   * Get formatted news articles for slider
   */
  async getLatestNewsForSlider(limit: number = 5): Promise<FormattedNewsArticle[]> {
    try {
      const cacheKey = `supabase-slider-articles-${limit}`
      const cached = apiCache.get(cacheKey)
      if (cached) {
        console.log(`Using cached Supabase slider articles for limit ${limit}`)
        return cached
      }

      console.log(`Fetching ${limit} articles for slider from Supabase`)
      
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Supabase slider error:', error)
        return []
      }

      const articles = posts?.map(post => this.transformToFormattedArticle(post, null)) || []
      
      console.log(`Successfully processed ${articles.length} articles for slider from Supabase`)
      apiCache.set(cacheKey, articles, 5)
      return articles
    } catch (error) {
      console.error('Error in getLatestNewsForSlider:', error)
      return []
    }
  }

  /**
   * Get posts by category ID
   */
  async getLatestNewsByCategoryId(categoryId: number, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `supabase-category-id-${categoryId}-${limit}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase posts for category ID ${categoryId}`)
      return cached
    }

    return this.queueRequest(async () => {
      console.log(`Making Supabase request for category ID ${categoryId}`)
      try {
        // 简化查询策略：优先使用文本匹配（因为数据库存储的是字符串）
        let posts: any[] = [];
        let error: any = null;

        console.log(`Supabase: Querying posts for category ID ${categoryId}`)
        
        // 映射category ID到文本值
        const categoryTextMap: { [key: number]: string[] } = {
          11: ['News > Local', 'Local News', 'Local'], // News > Local  
          321: ['Arts and Entertainment > Theatre > Reviews', 'Theatre Reviews', 'Reviews'], // Theatre > Reviews
          4: ['Opinion'], // Opinion
          211: ['Lifestyle > Food and Wine > Restaurant Reviews', 'Restaurant Reviews'], // Restaurant Reviews
          212: ['Lifestyle > Food and Wine > Wine Match', 'Wine Match'], // Wine Match
        }
        
        const searchTerms = categoryTextMap[categoryId] || []
        console.log(`Supabase: Search terms for category ID ${categoryId}:`, searchTerms);
        
        if (searchTerms.length > 0) {
          try {
            for (const term of searchTerms) {
              console.log(`Supabase: Trying category text match: "${term}"`);
              const { data: textPosts, error: textError } = await supabase
                .from('posts')
                .select('*')
                .eq('status', 'publish')
                .eq('category', term)
                .order('created_at', { ascending: false })
                .limit(limit)

              if (!textError && textPosts && textPosts.length > 0) {
                posts = textPosts;
                console.log(`Supabase: Found ${posts.length} posts using category text "${term}"`);
                break; // 找到结果就停止
              } else {
                console.log(`Supabase: No results for "${term}", error:`, textError?.message);
              }
            }
          } catch (textError) {
            console.log(`Supabase: Text-based category matching failed:`, textError);
          }
        }

        // 如果文本匹配没有结果，尝试category_id字段（如果存在）
        if (posts.length === 0) {
          console.log(`Supabase: No results from text matching, trying category_id = ${categoryId}`)
          try {
            const { data: categoryPosts, error: categoryError } = await supabase
              .from('posts')
              .select('*')
              .eq('status', 'publish')
              .eq('category_id', categoryId)
              .order('created_at', { ascending: false })
              .limit(limit)

            if (!categoryError && categoryPosts && categoryPosts.length > 0) {
              posts = categoryPosts;
              console.log(`Supabase: Found ${posts.length} posts using category_id`);
            } else {
              console.log(`Supabase: No posts found using category_id, error:`, categoryError?.message);
            }
          } catch (categoryIdError) {
            console.log(`Supabase: category_id query failed:`, categoryIdError);
          }
        }

        // 第三步：为找到的文章构建作者信息
        if (posts.length > 0) {
          console.log(`Supabase: Building author info for ${posts.length} posts`);
          for (const post of posts) {
            // 使用posts表中存储的作者信息构建profile对象
            if (post.author_id || post.author_name) {
              const authorName = post.author_name || 'Anonymous Author';
              const authorEmail = post.author_email || '';
              const authorAvatar = post.author_avatar_url;
              
              post.profiles = {
                id: post.author_id || 'unknown',
                display_name: authorName,
                full_name: authorName,
                username: authorEmail ? authorEmail.split('@')[0] : 'anonymous',
                email: authorEmail,
                avatar_url: authorAvatar,
                bio: null
              };
              
              console.log(`Supabase: Built author info for "${post.title}": ${authorName}`);
            } else {
              post.profiles = null;
              console.log(`Supabase: No author info available for "${post.title}"`);
            }
          }
        }
          
        console.log(`Supabase final result for category ID ${categoryId}: ${posts.length} articles found`)

        const articles = posts.map(post => {
          const authorProfile = post.profiles || null;
          return this.transformToFormattedArticle(post, authorProfile);
        })

        console.log(`Successfully processed ${articles.length} articles for category ID ${categoryId} from Supabase`)
        apiCache.set(cacheKey, articles, 5)
        return articles
      } catch (error) {
        console.error(`Error fetching category ${categoryId} from Supabase:`, error)
        return []
      }
    })
  }

  /**
   * Get posts by category slug
   */
  async getLatestNewsByCategory(categorySlug: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `supabase-category-${categorySlug}-${limit}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase posts for category ${categorySlug}`)
      return cached
    }

    return this.queueRequest(async () => {
      try {
        let query = supabase
          .from('posts')
          .select('*')
          .eq('status', 'publish')
          .order('created_at', { ascending: false })
          .limit(limit)

        // Handle different category matching strategies
        if (categorySlug.includes(' > ')) {
          // For hierarchical categories, try exact match first, then fallback to partial matches
          const parts = categorySlug.split(' > ');
          const lastPart = parts[parts.length - 1]; // e.g., "Reviews" from "Arts and Entertainment > Theatre > Reviews"
          const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : null; // e.g., "Theatre"
          
          // Try multiple matching strategies:
          // 1. Exact hierarchical match
          // 2. Match just the final category (e.g., "Reviews")
          // 3. Match second-to-last + last (e.g., "Theatre Reviews")
          // 4. Partial match with any part
          const matchConditions = [
            `category.eq.${categorySlug}`,
            `category.eq.${lastPart}`,
            secondLastPart ? `category.eq.${secondLastPart} ${lastPart}` : null,
            secondLastPart ? `category.eq.${secondLastPart}` : null,
            `category.ilike.%${lastPart}%`
          ].filter(Boolean);
          
          query = query.or(matchConditions.join(','))
        } else {
          // For single-level categories like "Opinion", try exact match first, then partial match
          query = query.or(`category.eq.${categorySlug},category.ilike.%${categorySlug}%`)
        }

        console.log(`Supabase: Querying for category "${categorySlug}"`)
        console.log(`Supabase: Query conditions:`, categorySlug.includes(' > ') ? 
          `Multiple conditions for hierarchical category` : 
          `Simple category match`)

        const { data: posts, error } = await query

        if (error) {
          console.error('Supabase category slug error:', error)
          return []
        }

        console.log(`Supabase: Found ${posts?.length || 0} posts for category "${categorySlug}"`)
        console.log(`Supabase: Post categories found:`, posts?.map(p => p.category))

        const articles = posts?.map(post => this.transformToFormattedArticle(post, null)) || []

        console.log(`Successfully processed ${articles.length} articles for category ${categorySlug} from Supabase`)
        apiCache.set(cacheKey, articles, 5)
        return articles
      } catch (error) {
        console.error(`Error fetching category ${categorySlug} from Supabase:`, error)
        return []
      }
    })
  }

  /**
   * Search posts by keyword
   */
  async searchPosts(searchTerm: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const cacheKey = `supabase-search-${encodeURIComponent(searchTerm)}-${limit}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Returning cached Supabase search results for: "${searchTerm}"`)
      return cached
    }

    return this.queueRequest(async () => {
      try {
        console.log(`Searching Supabase posts for: "${searchTerm}"`)
        
        const { data: posts, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'publish')
          .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Supabase search error:', error)
          return []
        }

        const articles = posts?.map(post => this.transformToFormattedArticle(post, null)) || []

        console.log(`Successfully processed ${articles.length} search results for "${searchTerm}" from Supabase`)
        apiCache.set(cacheKey, articles, 5)
        return articles

      } catch (error) {
        console.error(`Error searching Supabase for "${searchTerm}":`, error)
        return []
      }
    })
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId: number): Promise<FormattedNewsArticle | null> {
    const cacheKey = `supabase-post-${postId}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase post for ID ${postId}`)
      return cached
    }

    return this.queueRequest(async () => {
      try {
        console.log(`Supabase: Fetching post by ID ${postId}`);
        
        // 第一步：获取文章基本信息
        const { data: post, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .eq('status', 'publish')
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            console.warn(`Post ${postId} not found in Supabase`)
            return null
          }
          console.error('Supabase get post error:', error)
          return null
        }

        if (!post) {
          console.warn(`Post ${postId} is null or undefined`)
          return null
        }

        console.log(`Supabase: Found post ${postId}: "${post.title}"`);
        console.log(`Supabase: Post data:`, post); // 调试：查看post对象包含哪些字段

        // 第二步：构建作者信息（使用posts表中的字段）
        let authorProfile = null;
        if (post.author_id || post.author_name) {
          console.log(`Supabase: Building author info from post data`);
          
          // 使用posts表中存储的作者信息
          const authorName = post.author_name || 'Anonymous Author';
          const authorEmail = post.author_email || '';
          const authorAvatar = post.author_avatar_url;
          
          authorProfile = {
            id: post.author_id || 'unknown',
            display_name: authorName,
            full_name: authorName,
            username: authorEmail ? authorEmail.split('@')[0] : 'anonymous',
            email: authorEmail,
            avatar_url: authorAvatar,
            bio: null
          };
          
          console.log(`Supabase: Built author info for post ${postId}: ${authorName}`);
        }

        const article = this.transformToFormattedArticle(post, authorProfile)

        console.log(`Successfully fetched post ${postId} from Supabase`)
        apiCache.set(cacheKey, article, 10)
        return article
      } catch (error) {
        console.error(`Error fetching post ${postId} from Supabase:`, error)
        return null
      }
    })
  }

  /**
   * Get comments for a post
   */
  async fetchCommentsByPostId(postId: number): Promise<WordPressComment[]> {
    const cacheKey = `supabase-comments-post-${postId}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase comments for post ${postId}`)
      return cached
    }

    return this.queueRequest(async () => {
      try {
        console.log(`Supabase: Fetching comments for post ${postId}`);
        
        // 第一步：获取评论基本信息
        const { data: comments, error } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Supabase comments error:', error)
          return []
        }

        // 第二步：为每条评论添加用户信息（如果有的话）
        if (comments && comments.length > 0) {
          for (const comment of comments) {
            comment.profiles = null; // 初始化为null
            
            if (comment.user_id) {
              try {
                console.log(`Supabase: Loading profile for comment author: ${comment.user_id}`);
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('id, username, full_name, avatar_url')
                  .eq('id', comment.user_id)
                  .maybeSingle();
                
                if (profile && !profileError) {
                  comment.profiles = profile;
                  console.log(`Supabase: Loaded comment author profile: ${profile.full_name || profile.username}`);
                } else {
                  console.log(`Supabase: No profile found for comment user_id ${comment.user_id}`);
                }
              } catch (profileError) {
                console.warn(`Supabase: Comment profile loading error for user_id ${comment.user_id}:`, profileError);
              }
            }
          }
        }

        const wpComments: WordPressComment[] = comments?.map(comment => ({
          id: comment.id,
          post: comment.post_id,
          parent: comment.parent_id || 0,
          author: comment.user_id || 0,
          author_name: comment.profiles?.full_name || comment.profiles?.username || 'Anonymous',
          author_url: '',
          author_avatar_urls: {
            24: comment.profiles?.avatar_url || `https://www.gravatar.com/avatar/default?s=24`,
            48: comment.profiles?.avatar_url || `https://www.gravatar.com/avatar/default?s=48`,
            96: comment.profiles?.avatar_url || `https://www.gravatar.com/avatar/default?s=96`
          },
          date: comment.created_at,
          date_gmt: comment.created_at,
          content: {
            rendered: comment.content
          },
          link: `${window.location.origin}/posts/${postId}#comment-${comment.id}`,
          status: 'approved',
          type: 'comment',
          author_user_agent: '',
          meta: [],
          _links: {}
        })) || []

        console.log(`Successfully fetched ${wpComments.length} comments for post ${postId} from Supabase`)
        apiCache.set(cacheKey, wpComments, 5)
        return wpComments
      } catch (error) {
        console.error(`Error fetching comments for post ${postId} from Supabase:`, error)
        return []
      }
    })
  }

  /**
   * Get recent comments
   */
  async fetchRecentComments(limit: number = 10): Promise<FormattedComment[]> {
    const cacheKey = `supabase-recent-comments-${limit}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log(`Using cached Supabase recent comments`)
      return cached
    }

    return this.queueRequest(async () => {
      try {
        console.log(`Supabase: Fetching ${limit} recent comments`);
        
        // 第一步：获取评论基本信息
        const { data: comments, error } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Supabase recent comments error:', error)
          return []
        }

        // 第二步：为每条评论添加用户信息（如果有的话）
        if (comments && comments.length > 0) {
          for (const comment of comments) {
            comment.profiles = null; // 初始化为null
            
            if (comment.user_id) {
              try {
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('id, username, full_name, avatar_url')
                  .eq('id', comment.user_id)
                  .maybeSingle();
                
                if (profile && !profileError) {
                  comment.profiles = profile;
                }
              } catch (profileError) {
                console.warn(`Supabase: Recent comment profile loading error:`, profileError);
              }
            }
          }
        }

        const formattedComments: FormattedComment[] = comments?.map(comment => ({
          id: comment.id,
          postId: comment.post_id,
          authorName: comment.profiles?.full_name || comment.profiles?.username || 'Anonymous',
          content: this.stripHtmlTags(comment.content),
          date: this.formatDate(comment.created_at),
          avatarUrl: comment.profiles?.avatar_url || `https://www.gravatar.com/avatar/default?s=48`
        })) || []

        console.log(`Successfully fetched ${formattedComments.length} recent comments from Supabase`)
        apiCache.set(cacheKey, formattedComments, 5)
        return formattedComments
      } catch (error) {
        console.error('Error fetching recent comments from Supabase:', error)
        return []
      }
    })
  }

  /**
   * Submit a comment
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
        console.log(`Submitting comment to Supabase post ${postId} by ${authorName}`)
        
        // Get current user (if authenticated)
        const { data: { user } } = await supabase.auth.getUser()

        // 第一步：插入评论
        const { data: comment, error } = await supabase
          .from('comments')
          .insert({
            post_id: postId,
            content: content,
            user_id: user?.id || null
          })
          .select('*')
          .single()

        if (error) {
          console.error('Supabase comment submission error:', error)
          throw new Error(`Comment submission failed: ${error.message}`)
        }

        // 第二步：获取作者信息（如果有的话）
        let authorProfile = null;
        if (comment.user_id) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', comment.user_id)
              .maybeSingle();
            
            if (profile && !profileError) {
              authorProfile = profile;
            }
          } catch (profileError) {
            console.warn(`Supabase: Comment submission profile loading error:`, profileError);
          }
        }

        const wpComment: WordPressComment = {
          id: comment.id,
          post: comment.post_id,
          parent: comment.parent_id || 0,
          author: comment.user_id || 0,
          author_name: authorProfile?.full_name || authorName,
          author_url: authorUrl || '',
          author_avatar_urls: {
            24: authorProfile?.avatar_url || `https://www.gravatar.com/avatar/default?s=24`,
            48: authorProfile?.avatar_url || `https://www.gravatar.com/avatar/default?s=48`,
            96: authorProfile?.avatar_url || `https://www.gravatar.com/avatar/default?s=96`
          },
          date: comment.created_at,
          date_gmt: comment.created_at,
          content: {
            rendered: comment.content
          },
          link: `${window.location.origin}/posts/${postId}#comment-${comment.id}`,
          status: 'approved',
          type: 'comment',
          author_user_agent: '',
          meta: [],
          _links: {}
        }

        console.log('Comment submitted successfully to Supabase')
        
        // Clear related cache entries
        const cacheKeys = [
          `supabase-comments-post-${postId}`,
          `supabase-recent-comments-5`,
          `supabase-recent-comments-10`
        ]
        cacheKeys.forEach(key => apiCache.delete(key))
        
        return wpComment

      } catch (error) {
        console.error(`Error submitting comment to Supabase post ${postId}:`, error)
        throw error
      }
    })
  }

  // Helper methods
  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  private stripHtmlTags(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  private generateExcerpt(content: string): string {
    if (!content) return ''
    const textContent = content.replace(/<[^>]*>/g, '')
    return textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '')
  }

  private getCategoryId(categoryName: string): number {
    const categoryMap: { [key: string]: number } = {
      'Breaking News': 1, 'Politics': 2, 'Business': 3, 'Technology': 4,
      'Health': 5, 'Science': 6, 'Sports': 7, 'Entertainment': 8,
      'World News': 9, 'Local News': 10, 'Opinion': 11, 'Lifestyle': 12
    }
    return categoryMap[categoryName] || 1
  }

  private createMediaFromUrl(url: string): WordPressMedia {
    return {
      id: 1,
      date: new Date().toISOString(),
      slug: 'featured-image',
      type: 'attachment',
      title: {
        rendered: 'Featured Image'
      },
      author: 1,
      media_type: 'image',
      mime_type: 'image/jpeg',
      media_details: {
        width: 800,
        height: 600,
        file: url.split('/').pop() || 'image.jpg',
        sizes: {
          thumbnail: {
            file: url,
            width: 150,
            height: 150,
            mime_type: 'image/jpeg',
            source_url: url
          },
          medium: {
            file: url,
            width: 300,
            height: 300,
            mime_type: 'image/jpeg',
            source_url: url
          },
          large: {
            file: url,
            width: 800,
            height: 600,
            mime_type: 'image/jpeg',
            source_url: url
          }
        }
      },
      source_url: url
    }
  }
}

export default SupabaseNewsService
export type { FormattedNewsArticle, WordPressPost, WordPressMedia, WordPressAuthor, WordPressComment, FormattedComment }