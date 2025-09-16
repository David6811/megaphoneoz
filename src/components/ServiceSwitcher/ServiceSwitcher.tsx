import React, { useState, useEffect } from 'react'
import NewsServiceManager from '../../services/newsServiceManager'
import { NewsServiceType } from '../../config/newsConfig'
import './ServiceSwitcher.css'

interface ServiceStatus {
  activeService: NewsServiceType
  availableServices: NewsServiceType[]
  health: { supabase: boolean; wordpress: boolean }
}

/**
 * Service Switcher Component
 * 用于切换和监控新闻服务的管理组件
 * Management component for switching and monitoring news services
 */
const ServiceSwitcher: React.FC = () => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({})
  const newsManager = NewsServiceManager.getInstance()

  useEffect(() => {
    loadServiceStatus()
  }, [])

  const loadServiceStatus = async () => {
    try {
      setLoading(true)
      const status = await newsManager.getServiceStatus()
      setServiceStatus(status)
    } catch (error) {
      console.error('Failed to load service status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSwitch = async (serviceType: NewsServiceType) => {
    try {
      newsManager.switchService(serviceType)
      await loadServiceStatus()
      console.log(`Switched to ${serviceType} service`)
    } catch (error) {
      console.error('Failed to switch service:', error)
    }
  }

  const testService = async (testName: string, testFunction: () => Promise<any>) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: { loading: true } }))
      const startTime = Date.now()
      const result = await testFunction()
      const duration = Date.now() - startTime
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          result: Array.isArray(result) ? `${result.length} items` : 'Success',
          duration: `${duration}ms`,
          loading: false
        }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }
      }))
    }
  }

  const runTests = async () => {
    const tests = [
      {
        name: 'Latest News',
        test: () => newsManager.getLatestNewsForSlider(3)
      },
      {
        name: 'Search',
        test: () => newsManager.searchPosts('news', 3)
      },
      {
        name: 'Category (Business)',
        test: () => newsManager.getLatestNewsByCategory('business', 3)
      },
      {
        name: 'Recent Comments',
        test: () => newsManager.fetchRecentComments(3)
      }
    ]

    for (const { name, test } of tests) {
      await testService(name, test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (loading) {
    return (
      <div className="service-switcher loading">
        <div className="spinner"></div>
        <p>Loading service status...</p>
      </div>
    )
  }

  return (
    <div className="service-switcher">
      <div className="service-switcher__header">
        <h3>📡 News Service Manager</h3>
        <button 
          className="refresh-btn"
          onClick={loadServiceStatus}
          title="Refresh Status"
        >
          🔄
        </button>
      </div>

      {serviceStatus && (
        <>
          {/* Current Status */}
          <div className="service-status">
            <div className="status-item">
              <label>Active Service:</label>
              <span className={`service-badge ${serviceStatus.activeService}`}>
                {serviceStatus.activeService.toUpperCase()}
              </span>
            </div>
            
            <div className="health-status">
              <label>Service Health:</label>
              <div className="health-indicators">
                <span className={`health-indicator ${serviceStatus.health.wordpress ? 'healthy' : 'unhealthy'}`}>
                  WordPress: {serviceStatus.health.wordpress ? '✅' : '❌'}
                </span>
                <span className={`health-indicator ${serviceStatus.health.supabase ? 'healthy' : 'unhealthy'}`}>
                  Supabase: {serviceStatus.health.supabase ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>

          {/* Service Switcher */}
          <div className="service-controls">
            <label>Switch Service:</label>
            <div className="service-buttons">
              <button
                className={`service-btn ${serviceStatus.activeService === 'wordpress' ? 'active' : ''}`}
                onClick={() => handleServiceSwitch('wordpress')}
                disabled={!serviceStatus.availableServices.includes('wordpress')}
              >
                WordPress
              </button>
              <button
                className={`service-btn ${serviceStatus.activeService === 'supabase' ? 'active' : ''}`}
                onClick={() => handleServiceSwitch('supabase')}
                disabled={!serviceStatus.availableServices.includes('supabase')}
              >
                Supabase
              </button>
              <button
                className={`service-btn ${serviceStatus.activeService === 'auto' ? 'active' : ''}`}
                onClick={() => handleServiceSwitch('auto')}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Test Section */}
          <div className="test-section">
            <div className="test-header">
              <label>API Tests:</label>
              <button 
                className="test-btn"
                onClick={runTests}
                disabled={Object.values(testResults).some((result: any) => result.loading)}
              >
                Run Tests
              </button>
            </div>
            
            {Object.keys(testResults).length > 0 && (
              <div className="test-results">
                {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                  <div key={testName} className={`test-result ${result.success ? 'success' : 'error'}`}>
                    <span className="test-name">{testName}:</span>
                    {result.loading ? (
                      <span className="test-loading">⏳ Testing...</span>
                    ) : result.success ? (
                      <span className="test-success">
                        ✅ {result.result} ({result.duration})
                      </span>
                    ) : (
                      <span className="test-error">
                        ❌ {result.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuration Info */}
          <div className="config-info">
            <details>
              <summary>Configuration Details</summary>
              <div className="config-details">
                <p><strong>Available Services:</strong> {serviceStatus.availableServices.join(', ')}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>WordPress URL:</strong> {process.env.REACT_APP_WORDPRESS_API}</p>
                <p><strong>Supabase URL:</strong> {process.env.REACT_APP_SUPABASE_NEWS_API}</p>
                <p><strong>Fallback Enabled:</strong> {process.env.REACT_APP_ENABLE_FALLBACK}</p>
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  )
}

export default ServiceSwitcher