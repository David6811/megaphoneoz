import { newsConfig, getActiveServiceType, healthChecker, NewsServiceType } from '../config/newsConfig'
import WordPressNewsService from './wordpressNewsService'
import SupabaseNewsService from './supabaseNewsService'
import type { FormattedNewsArticle, WordPressPost, WordPressComment, FormattedComment } from './wordpressNewsService'

/**
 * News Service Manager
 * 智能管理WordPress和Supabase API之间的切换
 * Intelligently manages switching between WordPress and Supabase APIs
 */
class NewsServiceManager {
  private static instance: NewsServiceManager | null = null
  private currentServiceType: NewsServiceType = 'auto'
  private wordpressService: WordPressNewsService | null = null
  private supabaseService: SupabaseNewsService | null = null
  private failoverAttempts = new Map<string, number>()

  private constructor() {
    this.currentServiceType = getActiveServiceType()
    this.initializeServices()
  }

  static getInstance(): NewsServiceManager {
    if (!NewsServiceManager.instance) {
      NewsServiceManager.instance = new NewsServiceManager()
    }
    return NewsServiceManager.instance
  }

  private initializeServices(): void {
    if (newsConfig.wordpress.enabled) {
      this.wordpressService = WordPressNewsService.getInstance()
    }
    
    if (newsConfig.supabase.enabled) {
      this.supabaseService = SupabaseNewsService.getInstance()
    }

    if (newsConfig.dev.logApiCalls) {
      console.log('News Service Manager initialized:', {
        activeService: this.currentServiceType,
        wordpressEnabled: !!this.wordpressService,
        supabaseEnabled: !!this.supabaseService
      })
    }
  }

  /**
   * 获取当前活跃的服务
   * Get currently active service
   */
  private async getActiveService(): Promise<{ service: WordPressNewsService | SupabaseNewsService; type: NewsServiceType }> {
    // If specific service is configured, use it
    if (this.currentServiceType === 'wordpress' && this.wordpressService) {
      return { service: this.wordpressService, type: 'wordpress' }
    }
    
    if (this.currentServiceType === 'supabase' && this.supabaseService) {
      return { service: this.supabaseService, type: 'supabase' }
    }

    // Auto mode: check health and choose best available service
    if (this.currentServiceType === 'auto' || !this.getServiceByType(this.currentServiceType)) {
      const healthStatus = await healthChecker.checkHealth()
      
      // Prefer Supabase if healthy
      if (healthStatus.supabase && this.supabaseService) {
        if (newsConfig.dev.logApiCalls) {
          console.log('Using Supabase service (healthy)')
        }
        return { service: this.supabaseService, type: 'supabase' }
      }
      
      // Fallback to WordPress if healthy
      if (healthStatus.wordpress && this.wordpressService) {
        if (newsConfig.dev.logApiCalls) {
          console.log('Using WordPress service (Supabase unhealthy, WordPress healthy)')
        }
        return { service: this.wordpressService, type: 'wordpress' }
      }
      
      // If no service is healthy, use the preferred dev service or fallback
      const fallbackService = this.supabaseService || this.wordpressService
      if (fallbackService) {
        const fallbackType = this.supabaseService ? 'supabase' : 'wordpress'
        if (newsConfig.dev.logApiCalls) {
          console.warn(`Using fallback service: ${fallbackType} (no services healthy)`)
        }
        return { service: fallbackService, type: fallbackType }
      }
    }

    // Last resort
    const availableService = this.supabaseService || this.wordpressService
    if (availableService) {
      const serviceType = this.supabaseService ? 'supabase' : 'wordpress'
      return { service: availableService, type: serviceType }
    }

    throw new Error('No news service available')
  }

  private getServiceByType(type: NewsServiceType): WordPressNewsService | SupabaseNewsService | null {
    switch (type) {
      case 'wordpress':
        return this.wordpressService
      case 'supabase':
        return this.supabaseService
      default:
        return null
    }
  }

  /**
   * 执行带有失败转移的API调用
   * Execute API call with failover support
   */
  private async executeWithFailover<T>(
    operation: string,
    primaryCall: () => Promise<T>,
    fallbackCall?: () => Promise<T>
  ): Promise<T> {
    const failoverKey = operation
    const currentAttempts = this.failoverAttempts.get(failoverKey) || 0

    try {
      // Reset attempts counter on successful call
      const result = await primaryCall()
      this.failoverAttempts.delete(failoverKey)
      return result
    } catch (error) {
      if (newsConfig.dev.logApiCalls) {
        console.warn(`Primary service failed for ${operation}:`, error)
      }

      // Check if we should try fallback
      if (
        newsConfig.fallback.enableFallback && 
        fallbackCall && 
        currentAttempts < newsConfig.fallback.retryAttempts
      ) {
        this.failoverAttempts.set(failoverKey, currentAttempts + 1)
        
        try {
          if (newsConfig.dev.logApiCalls) {
            console.log(`Attempting fallback for ${operation} (attempt ${currentAttempts + 1})`)
          }
          return await fallbackCall()
        } catch (fallbackError) {
          if (newsConfig.dev.logApiCalls) {
            console.error(`Fallback also failed for ${operation}:`, fallbackError)
          }
          throw fallbackError
        }
      }

      throw error
    }
  }

  /**
   * 手动切换服务类型
   * Manually switch service type
   */
  switchService(serviceType: NewsServiceType): void {
    this.currentServiceType = serviceType
    if (newsConfig.dev.logApiCalls) {
      console.log(`Switched to service: ${serviceType}`)
    }
  }

  /**
   * 获取当前服务状态
   * Get current service status
   */
  async getServiceStatus(): Promise<{
    activeService: NewsServiceType
    availableServices: NewsServiceType[]
    health: { supabase: boolean; wordpress: boolean }
  }> {
    const health = await healthChecker.checkHealth()
    const availableServices: NewsServiceType[] = []
    
    if (this.wordpressService) availableServices.push('wordpress')
    if (this.supabaseService) availableServices.push('supabase')

    return {
      activeService: this.currentServiceType,
      availableServices,
      health
    }
  }

  // =========================
  // Public API Methods
  // =========================

  /**
   * 获取最新文章用于滑动组件
   * Get latest articles for slider component
   */
  async getLatestNewsForSlider(limit: number = 5): Promise<FormattedNewsArticle[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'getLatestNewsForSlider',
      () => primaryService.getLatestNewsForSlider(limit),
      fallbackService ? () => fallbackService.getLatestNewsForSlider(limit) : undefined
    )
  }

  /**
   * 根据分类ID获取最新新闻
   * Get latest news by category ID
   */
  async getLatestNewsByCategoryId(categoryId: number, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'getLatestNewsByCategoryId',
      () => primaryService.getLatestNewsByCategoryId(categoryId, limit),
      fallbackService ? () => fallbackService.getLatestNewsByCategoryId(categoryId, limit) : undefined
    )
  }

  /**
   * 根据分类名称获取最新新闻
   * Get latest news by category name
   */
  async getLatestNewsByCategory(categorySlug: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'getLatestNewsByCategory',
      () => primaryService.getLatestNewsByCategory(categorySlug, limit),
      fallbackService ? () => fallbackService.getLatestNewsByCategory(categorySlug, limit) : undefined
    )
  }

  /**
   * 搜索文章
   * Search articles
   */
  async searchPosts(searchTerm: string, limit: number = 10): Promise<FormattedNewsArticle[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'searchPosts',
      () => primaryService.searchPosts(searchTerm, limit),
      fallbackService ? () => fallbackService.searchPosts(searchTerm, limit) : undefined
    )
  }

  /**
   * 根据ID获取文章
   * Get post by ID
   */
  async getPostById(postId: number): Promise<FormattedNewsArticle | null> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'getPostById',
      () => primaryService.getPostById(postId),
      fallbackService ? () => fallbackService.getPostById(postId) : undefined
    )
  }

  /**
   * 获取最新文章
   * Fetch latest posts
   */
  async fetchLatestPosts(limit: number = 5): Promise<WordPressPost[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'fetchLatestPosts',
      () => primaryService.fetchLatestPosts(limit),
      fallbackService ? () => fallbackService.fetchLatestPosts(limit) : undefined
    )
  }

  /**
   * 获取文章评论
   * Get post comments
   */
  async fetchCommentsByPostId(postId: number): Promise<WordPressComment[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'fetchCommentsByPostId',
      () => primaryService.fetchCommentsByPostId(postId),
      fallbackService ? () => fallbackService.fetchCommentsByPostId(postId) : undefined
    )
  }

  /**
   * 获取最新评论
   * Get recent comments
   */
  async fetchRecentComments(limit: number = 10): Promise<FormattedComment[]> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'fetchRecentComments',
      () => primaryService.fetchRecentComments(limit),
      fallbackService ? () => fallbackService.fetchRecentComments(limit) : undefined
    )
  }

  /**
   * 提交评论
   * Submit comment
   */
  async submitComment(
    postId: number,
    authorName: string,
    authorEmail: string,
    content: string,
    authorUrl?: string
  ): Promise<WordPressComment | null> {
    const { service: primaryService, type: primaryType } = await this.getActiveService()
    const fallbackService = primaryType === 'wordpress' ? this.supabaseService : this.wordpressService

    return this.executeWithFailover(
      'submitComment',
      () => primaryService.submitComment(postId, authorName, authorEmail, content, authorUrl),
      fallbackService ? () => fallbackService.submitComment(postId, authorName, authorEmail, content, authorUrl) : undefined
    )
  }
}

export default NewsServiceManager
export type { FormattedNewsArticle, WordPressPost, WordPressComment, FormattedComment }