import React, { useState, useEffect } from 'react'
import NewsServiceManager from '../services/newsServiceManager'
import ServiceSwitcher from './ServiceSwitcher/ServiceSwitcher'

const SupabaseTest: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [key: string]: number }>({})

  const newsManager = NewsServiceManager.getInstance()

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🚀 Testing Supabase connection and investigating categories...')
      
      // Import supabase directly for debugging
      const { supabase } = await import('../config/supabase')
      
      // 1. First, let's see what's actually in the posts table
      console.log('🔍 Checking raw posts table...')
      const { data: rawPosts, error: rawError } = await supabase
        .from('posts')
        .select('*')
        .limit(50) // Increased limit to see more data
      
      console.log('Raw posts data:', rawPosts)
      console.log('Raw posts error:', rawError)
      
      if (rawPosts) {
        console.log(`\n📊 CATEGORY INVESTIGATION - Found ${rawPosts.length} total posts in database`)
        
        // Extract all unique categories
        const allCategories = new Set<string>()
        const categoryBreakdown: { [key: string]: number } = {}
        
        rawPosts.forEach((post, index) => {
          const category = post.category || 'NO_CATEGORY'
          allCategories.add(category)
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1
          
          console.log(`Post ${index + 1}:`, {
            id: post.id,
            title: post.title?.substring(0, 50) + '...',
            category: post.category,
            status: post.status,
            created_at: post.created_at
          })
        })
        
        console.log('\n🏷️ ALL UNIQUE CATEGORIES FOUND:')
        console.log(Array.from(allCategories).sort())
        
        console.log('\n📈 CATEGORY BREAKDOWN (count per category):')
        Object.entries(categoryBreakdown)
          .sort(([,a], [,b]) => b - a)
          .forEach(([category, count]) => {
            console.log(`  "${category}": ${count} posts`)
          })
        
        // Store categories in state for UI display
        setCategories(Array.from(allCategories).sort())
        setCategoryBreakdown(categoryBreakdown)
        
        // 2. Look specifically for theatre/arts/entertainment related posts
        console.log('\n🎭 THEATRE/ARTS/ENTERTAINMENT SEARCH:')
        const theatreKeywords = ['theatre', 'theater', 'arts', 'entertainment', 'review', 'cultural', 'performance']
        
        const potentialTheatrePosts = rawPosts.filter(post => {
          const title = (post.title || '').toLowerCase()
          const category = (post.category || '').toLowerCase()
          const content = (post.content || '').toLowerCase()
          
          return theatreKeywords.some(keyword => 
            title.includes(keyword) || 
            category.includes(keyword) || 
            content.includes(keyword)
          )
        })
        
        console.log(`Found ${potentialTheatrePosts.length} posts potentially related to theatre/arts/entertainment:`)
        potentialTheatrePosts.forEach((post, index) => {
          console.log(`  ${index + 1}. "${post.title}" - Category: "${post.category}"`)
        })
        
        // 3. Check for hierarchical category patterns
        console.log('\n🌳 HIERARCHICAL CATEGORY ANALYSIS:')
        const hierarchicalCategories = Array.from(allCategories).filter(cat => cat.includes(' > '))
        console.log(`Found ${hierarchicalCategories.length} hierarchical categories:`)
        hierarchicalCategories.forEach(cat => {
          console.log(`  "${cat}" (${categoryBreakdown[cat]} posts)`)
        })
        
        // 4. Look for specific theatre review category
        console.log('\n🎭 SPECIFIC THEATRE REVIEW CATEGORY CHECK:')
        const theatreReviewCategories = Array.from(allCategories).filter(cat => 
          cat.toLowerCase().includes('theatre') && cat.toLowerCase().includes('review')
        )
        console.log('Theatre review categories found:', theatreReviewCategories)
        
        // 5. Check the exact category that should match "Arts and Entertainment > Theatre > Reviews"
        const expectedCategory = 'Arts and Entertainment > Theatre > Reviews'
        const hasExpectedCategory = allCategories.has(expectedCategory)
        console.log(`\n✅ Expected category "${expectedCategory}" exists: ${hasExpectedCategory}`)
        
        if (!hasExpectedCategory) {
          console.log('❌ Expected category not found. Similar categories:')
          Array.from(allCategories).forEach(cat => {
            if (cat.toLowerCase().includes('arts') || 
                cat.toLowerCase().includes('theatre') || 
                cat.toLowerCase().includes('entertainment') ||
                cat.toLowerCase().includes('review')) {
              console.log(`  - "${cat}"`)
            }
          })
        }
      }
      
      // 6. Test the specific category query that's failing
      console.log('\n🔍 Testing specific theatre reviews query...')
      const { data: theatreReviews, error: theatreError } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .eq('category', 'Arts and Entertainment > Theatre > Reviews')
        .limit(10)
      
      console.log('Theatre reviews query result:', theatreReviews)
      console.log('Theatre reviews query error:', theatreError)
      console.log(`Found ${theatreReviews?.length || 0} posts with exact category match`)
      
      // 7. Try alternative theatre category queries
      console.log('\n🔍 Trying alternative theatre category queries...')
      const alternativeQueries = [
        'Theatre Reviews',
        'Reviews',
        'Theatre',
        'Arts and Entertainment'
      ]
      
      for (const categoryTerm of alternativeQueries) {
        const { data: altResults, error: altError } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'publish')
          .eq('category', categoryTerm)
          .limit(5)
        
        console.log(`Query for "${categoryTerm}": ${altResults?.length || 0} results`)
        if (altResults && altResults.length > 0) {
          console.log(`  Sample post: "${altResults[0].title}"`)
        }
      }
      
      // 8. Finally, test the service manager
      console.log('\n🔄 Testing service manager...')
      newsManager.switchService('supabase')
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
      
      <button 
        onClick={() => {
          // Clear cache and force refresh
          const { apiCache } = require('../utils/cache');
          apiCache.clear();
          window.location.reload();
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0 10px 10px'
        }}
      >
        🗑️ Clear Cache & Reload
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
          <h3>🏷️ Database Categories Analysis</h3>
          {categories.length > 0 && (
            <div style={{
              padding: '15px',
              margin: '10px 0',
              border: '2px solid #2196f3',
              borderRadius: '8px',
              backgroundColor: '#e3f2fd'
            }}>
              <h4>📊 All Categories Found ({categories.length} unique):</h4>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {Object.entries(categoryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} style={{ 
                      padding: '2px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <strong>"{category}"</strong> - {count} post{count !== 1 ? 's' : ''}
                    </div>
                  ))}
              </div>
              
              <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                <strong>🎭 Theatre-related categories:</strong>
                {categories.filter(cat => 
                  cat.toLowerCase().includes('theatre') || 
                  cat.toLowerCase().includes('arts') || 
                  cat.toLowerCase().includes('entertainment') ||
                  cat.toLowerCase().includes('review')
                ).length > 0 ? (
                  <ul>
                    {categories.filter(cat => 
                      cat.toLowerCase().includes('theatre') || 
                      cat.toLowerCase().includes('arts') || 
                      cat.toLowerCase().includes('entertainment') ||
                      cat.toLowerCase().includes('review')
                    ).map(cat => (
                      <li key={cat}>"{cat}" ({categoryBreakdown[cat]} posts)</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: '#d32f2f' }}> None found!</span>
                )}
              </div>
            </div>
          )}
          
          <h3>✅ Sample Articles Found ({articles.length} articles):</h3>
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