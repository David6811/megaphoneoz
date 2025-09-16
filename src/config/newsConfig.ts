/**
 * News API Configuration
 * Centralized configuration for switching between WordPress and Supabase APIs
 */

export type NewsServiceType = 'wordpress' | 'supabase' | 'auto'

export interface NewsServiceConfig {
  // Service type selection
  serviceType: NewsServiceType
  
  // WordPress API configuration
  wordpress: {
    baseUrl: string
    username: string
    appPassword: string
    enabled: boolean
  }
  
  // Supabase API configuration
  supabase: {
    baseUrl: string
    enabled: boolean
    healthCheckEndpoint: string
  }
  
  // Fallback and retry settings
  fallback: {
    enableFallback: boolean
    retryAttempts: number
    timeoutMs: number
    healthCheckIntervalMs: number
  }
  
  // Cache settings
  cache: {
    enabled: boolean
    defaultExpirationMinutes: number
  }
  
  // Development settings
  dev: {
    logApiCalls: boolean
    mockDataEnabled: boolean
    preferredService: NewsServiceType
  }
}

// Default configuration
const defaultConfig: NewsServiceConfig = {
  serviceType: (process.env.REACT_APP_NEWS_SERVICE_TYPE as NewsServiceType) || 'auto',
  
  wordpress: {
    baseUrl: process.env.REACT_APP_WORDPRESS_API || 'https://megaphoneoz.com/wp-json/wp/v2',
    username: process.env.REACT_APP_WP_USERNAME || 'oliverwen.sydney@gmail.com',
    appPassword: process.env.REACT_APP_WP_APP_PASSWORD || 'UDCX Qq5E aCls lusr d9BM LZ0Q',
    enabled: process.env.REACT_APP_WORDPRESS_ENABLED !== 'false'
  },
  
  supabase: {
    baseUrl: process.env.REACT_APP_SUPABASE_NEWS_API || 'http://localhost:3000',
    enabled: process.env.REACT_APP_SUPABASE_ENABLED !== 'false',
    healthCheckEndpoint: '/api/v1/health'
  },
  
  fallback: {
    enableFallback: process.env.REACT_APP_ENABLE_FALLBACK !== 'false',
    retryAttempts: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS || '3'),
    timeoutMs: parseInt(process.env.REACT_APP_TIMEOUT_MS || '15000'),
    healthCheckIntervalMs: parseInt(process.env.REACT_APP_HEALTH_CHECK_INTERVAL || '300000') // 5 minutes
  },
  
  cache: {
    enabled: process.env.REACT_APP_CACHE_ENABLED !== 'false',
    defaultExpirationMinutes: parseInt(process.env.REACT_APP_CACHE_EXPIRATION || '5')
  },
  
  dev: {
    logApiCalls: process.env.NODE_ENV === 'development' || process.env.REACT_APP_LOG_API_CALLS === 'true',
    mockDataEnabled: process.env.REACT_APP_MOCK_DATA === 'true',
    preferredService: (process.env.REACT_APP_DEV_PREFERRED_SERVICE as NewsServiceType) || 'supabase'
  }
}

export { defaultConfig as newsConfig }

// Environment-based service selection
export const getActiveServiceType = (): NewsServiceType => {
  const configType = defaultConfig.serviceType
  
  if (configType === 'auto') {
    // In development, prefer the configured dev service
    if (process.env.NODE_ENV === 'development') {
      return defaultConfig.dev.preferredService
    }
    
    // In production, prefer Supabase if available, fallback to WordPress
    return defaultConfig.supabase.enabled ? 'supabase' : 'wordpress'
  }
  
  return configType
}

// Health check utilities
export const createHealthChecker = () => {
  let supabaseHealthy = true
  let wordpressHealthy = true
  let lastHealthCheck = 0
  
  const checkSupabaseHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`${defaultConfig.supabase.baseUrl}${defaultConfig.supabase.healthCheckEndpoint}`, {
        signal: controller.signal,
        mode: 'cors'
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      if (defaultConfig.dev.logApiCalls) {
        console.warn('Supabase health check failed:', error)
      }
      return false
    }
  }
  
  const checkWordPressHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${defaultConfig.wordpress.baseUrl}/posts?per_page=1`, {
        headers: {
          'Authorization': `Basic ${btoa(`${defaultConfig.wordpress.username}:${defaultConfig.wordpress.appPassword}`)}`
        },
        signal: controller.signal,
        mode: 'cors'
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      if (defaultConfig.dev.logApiCalls) {
        console.warn('WordPress health check failed:', error)
      }
      return false
    }
  }
  
  const performHealthCheck = async (): Promise<{ supabase: boolean; wordpress: boolean }> => {
    const now = Date.now()
    
    // Only check if interval has passed
    if (now - lastHealthCheck > defaultConfig.fallback.healthCheckIntervalMs) {
      const [supabaseStatus, wordpressStatus] = await Promise.all([
        defaultConfig.supabase.enabled ? checkSupabaseHealth() : Promise.resolve(false),
        defaultConfig.wordpress.enabled ? checkWordPressHealth() : Promise.resolve(false)
      ])
      
      supabaseHealthy = supabaseStatus
      wordpressHealthy = wordpressStatus
      lastHealthCheck = now
      
      if (defaultConfig.dev.logApiCalls) {
        console.log('Health check results:', { supabase: supabaseHealthy, wordpress: wordpressHealthy })
      }
    }
    
    return { supabase: supabaseHealthy, wordpress: wordpressHealthy }
  }
  
  return {
    checkHealth: performHealthCheck,
    getLastStatus: () => ({ supabase: supabaseHealthy, wordpress: wordpressHealthy })
  }
}

export const healthChecker = createHealthChecker()