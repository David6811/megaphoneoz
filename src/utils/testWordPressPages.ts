import WordPressPagesService from '../services/wordpressPagesService';

export async function listAllWordPressPages() {
  console.log('🔍 Fetching all WordPress pages...');
  
  const pagesService = new WordPressPagesService();
  
  try {
    const pages = await pagesService.getAllPagesWithDetails();
    
    console.log(`\n📄 Found ${pages.length} WordPress pages:\n`);
    
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
      console.log(`   📎 Slug: ${page.slug}`);
      console.log(`   🔗 Link: ${page.link}`);
      console.log(`   📅 Date: ${page.date}`);
      console.log(`   💬 Comments: ${page.commentStatus}`);
      console.log(`   📝 Status: ${page.status}`);
      if (page.excerpt) {
        console.log(`   📖 Excerpt: ${page.excerpt.substring(0, 100)}...`);
      }
      console.log('   ────────────────────────────────────────');
    });
    
    return pages;
  } catch (error) {
    console.error('❌ Error fetching pages:', error);
    return [];
  }
}

export async function loadAboutUsPage() {
  console.log('\n🔍 Loading About Us page...');
  
  const pagesService = new WordPressPagesService();
  
  try {
    // Try different possible slugs for About Us
    const possibleSlugs = ['about-us', 'about', 'about-megaphoneoz'];
    
    let result = null;
    
    for (const slug of possibleSlugs) {
      console.log(`   Trying slug: ${slug}`);
      result = await pagesService.getPageWithComments(slug);
      
      if (result.page) {
        console.log(`✅ Found About Us page with slug: ${slug}`);
        break;
      }
    }
    
    if (!result || !result.page) {
      console.log('❌ About Us page not found with common slugs. Searching...');
      
      // Search for pages containing "about"
      const searchResults = await pagesService.searchPages('about');
      console.log(`\n🔍 Search results for "about" (${searchResults.length} found):`);
      
      searchResults.forEach((page, index) => {
        console.log(`${index + 1}. ${page.title} (${page.slug})`);
      });
      
      if (searchResults.length > 0) {
        // Try to load the first search result
        result = await pagesService.getPageWithComments(searchResults[0].slug);
      }
    }
    
    if (result && result.page) {
      console.log('\n📄 About Us Page Details:');
      console.log(`   📝 Title: ${result.page.title}`);
      console.log(`   📎 Slug: ${result.page.slug}`);
      console.log(`   🔗 Link: ${result.page.link}`);
      console.log(`   📅 Date: ${result.page.date}`);
      console.log(`   💬 Comment Status: ${result.page.commentStatus}`);
      console.log(`   📖 Content Length: ${result.page.content.length} characters`);
      
      if (result.page.content.length > 0) {
        // Show first 500 characters of content (stripped of HTML)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = result.page.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        console.log(`   📄 Content Preview: ${textContent.substring(0, 500)}...`);
      }
      
      console.log(`\n💬 Comments (${result.comments.length} found):`);
      
      if (result.comments.length === 0) {
        console.log('   No comments found for this page.');
      } else {
        result.comments.forEach((comment, index) => {
          console.log(`\n   ${index + 1}. Comment by ${comment.author}:`);
          console.log(`      📅 Date: ${comment.date}`);
          console.log(`      🔗 Author URL: ${comment.authorUrl || 'None'}`);
          console.log(`      👤 Avatar: ${comment.avatarUrl || 'None'}`);
          console.log(`      💬 Status: ${comment.status}`);
          
          // Show comment content (stripped of HTML)
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = comment.content;
          const textContent = tempDiv.textContent || tempDiv.innerText || '';
          console.log(`      📝 Content: ${textContent.substring(0, 200)}...`);
          
          if (comment.parentId > 0) {
            console.log(`      ↳ Reply to comment ID: ${comment.parentId}`);
          }
        });
      }
      
      return result;
    } else {
      console.log('❌ Could not find About Us page');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error loading About Us page:', error);
    return null;
  }
}

// Function to run both operations
export async function runWordPressPageTests() {
  console.log('🚀 Starting WordPress Pages API Test\n');
  
  // List all pages
  const pages = await listAllWordPressPages();
  
  // Load About Us page
  const aboutUsResult = await loadAboutUsPage();
  
  console.log('\n✅ WordPress Pages API Test Complete');
  
  return {
    allPages: pages,
    aboutUsPage: aboutUsResult
  };
}

export default { listAllWordPressPages, loadAboutUsPage, runWordPressPageTests };