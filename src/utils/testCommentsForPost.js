// Test script to fetch comments for a specific post ID using WordPress API

const API_BASE = 'https://megaphoneoz.com/wp-json/wp/v2';
const username = 'oliverwen.sydney@gmail.com';
const appPassword = 'UDCX Qq5E aCls lusr d9BM LZ0Q';
const AUTH_HEADER = 'Basic ' + btoa(`${username}:${appPassword}`);

async function fetchCommentsForPostId(postId) {
  try {
    console.log(`🔍 Fetching comments for post ID: ${postId}`);
    
    const response = await fetch(`${API_BASE}/comments?post=${postId}&status=approve&per_page=100`, {
      headers: {
        'Authorization': AUTH_HEADER,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
    }

    const comments = await response.json();
    
    console.log(`\n📝 Found ${comments.length} comments for post ID ${postId}:\n`);
    
    if (comments.length === 0) {
      console.log('   No comments found for this post.');
      return comments;
    }

    comments.forEach((comment, index) => {
      console.log(`${index + 1}. Comment ID: ${comment.id}`);
      console.log(`   📝 Author: ${comment.author_name}`);
      console.log(`   📅 Date: ${comment.date}`);
      console.log(`   📧 Email: ${comment.author_email}`);
      console.log(`   🌐 URL: ${comment.author_url || 'None'}`);
      console.log(`   💬 Status: ${comment.status}`);
      console.log(`   👨‍👩‍👧‍👦 Parent: ${comment.parent || 'None (top-level comment)'}`);
      
      // Show content preview (first 100 characters)
      const contentPreview = comment.content.rendered
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .substring(0, 100);
      console.log(`   📄 Content: ${contentPreview}${contentPreview.length >= 100 ? '...' : ''}`);
      console.log(`   ────────────────────────────────────────`);
    });
    
    return comments;
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return [];
  }
}

async function testCommentsFetch() {
  console.log('🚀 WordPress Comments API Test\n');
  
  // Test for post ID 103
  const comments = await fetchCommentsForPostId(103);
  
  // Also show the raw API endpoint being used
  console.log(`\n🔗 API Endpoint used: ${API_BASE}/comments?post=103&status=approve&per_page=100`);
  
  console.log('\n✅ Test Complete');
  
  return comments;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchCommentsForPostId, testCommentsFetch };
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testCommentsFetch();
}