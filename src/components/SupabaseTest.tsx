import React, { useState, useEffect } from 'react'
import NewsServiceManager from '../services/newsServiceManager'
import ServiceSwitcher from './ServiceSwitcher/ServiceSwitcher'

const SupabaseTest: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const newsManager = NewsServiceManager.getInstance()

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🚀 Testing Supabase connection...')
      
      // Import supabase directly for debugging
      const { supabase } = await import('../config/supabase')
      
      // First, let's see what's actually in the posts table
      console.log('🔍 Checking raw posts table...')
      const { data: rawPosts, error: rawError } = await supabase
        .from('posts')
        .select('*')
        .limit(10)
      
      console.log('Raw posts data:', rawPosts)
      console.log('Raw posts error:', rawError)
      
      if (rawPosts) {
        console.log(`Found ${rawPosts.length} total posts in database`)
        rawPosts.forEach((post, index) => {
          console.log(`Post ${index + 1}:`, {
            id: post.id,
            title: post.title,
            status: post.status,
            created_at: post.created_at,
            user_id: post.user_id
          })
        })
      }
      
      // Now test with status filter
      console.log('🔍 Checking published posts...')
      const { data: publishedPosts, error: publishedError } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .limit(10)
      
      console.log('Published posts:', publishedPosts)
      console.log('Published error:', publishedError)
      
      // Force switch to Supabase service
      newsManager.switchService('supabase')
      
      // Test fetching articles
      const testArticles = await newsManager.getLatestNewsForSlider(5)
      
      console.log('✅ Service manager result:', testArticles)
      setArticles(testArticles)
      
    } catch (err) {
      console.error('❌ Supabase test failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Supabase Connection Test</h2>
      
      <ServiceSwitcher />
      
      <button 
        onClick={testSupabaseConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3ecf8e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        🔄 Test Supabase Connection
      </button>

      {loading && <div>⏳ Loading...</div>}
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px',
          color: '#d32f2f',
          margin: '10px 0'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h3>✅ Success! Found {articles.length} articles from Supabase:</h3>
          {articles.map((article, index) => (
            <div key={article.id || index} style={{
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4>{article.title || 'No Title'}</h4>
              <p><strong>Category:</strong> {article.category || 'No Category'}</p>
              <p><strong>Date:</strong> {article.date || 'No Date'}</p>
              <p><strong>Excerpt:</strong> {article.excerpt || 'No Excerpt'}</p>
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Environment:</strong></p>
        <p>Service Type: {process.env.REACT_APP_NEWS_SERVICE_TYPE}</p>
        <p>Supabase URL: {process.env.REACT_APP_SUPABASE_URL}</p>
        <p>Supabase Enabled: {process.env.REACT_APP_SUPABASE_ENABLED}</p>
      </div>
    </div>
  )
}

export default SupabaseTest