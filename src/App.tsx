import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HeaderWithWordPress from './components/Header/HeaderWithWordPress';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import LocalNews from './components/LocalNews';
import ArticleDetail from './components/ArticleDetail';
import SearchResults from './components/SearchResults';
import SupabaseTest from './components/SupabaseTest';
import CategoryPage from './components/CategoryPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <HeaderWithWordPress />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/megaphoneoz" element={<Homepage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            
            {/* News Category Routes */}
            <Route path="/news/:subcategory" element={<CategoryPage />} />
            
            {/* Lifestyle Category Routes */}
            <Route path="/lifestyle/:subcategory" element={<CategoryPage />} />
            <Route path="/lifestyle/:subcategory/:subsubcategory" element={<CategoryPage />} />
            
            {/* Arts and Entertainment Category Routes */}
            <Route path="/arts/:subcategory" element={<CategoryPage />} />
            <Route path="/arts/:subcategory/:subsubcategory" element={<CategoryPage />} />
            
            {/* Opinion Route */}
            <Route path="/opinion" element={<CategoryPage title="Opinion" description="Editorial content and opinion pieces" />} />
            
            {/* Legacy/Special Routes */}
            <Route path="/localnews" element={<CategoryPage title="Local News" description="Local news and community updates" />} />
            <Route path="/category/media" element={<CategoryPage title="Media" description="Media news and updates" />} />
            <Route path="/drawn-and-quartered" element={<CategoryPage title="Drawn and Quartered" description="Comics and illustrated content" />} />
            
            {/* Legacy WordPress-style routes for backward compatibility */}
            <Route path="/category/news/:subcategory" element={<CategoryPage />} />
            <Route path="/category/lifestyle/:subcategory" element={<CategoryPage />} />
            <Route path="/category/lifestyle/:subcategory/:subsubcategory" element={<CategoryPage />} />
            <Route path="/category/artsentertainment/:subcategory" element={<CategoryPage />} />
            <Route path="/category/artsentertainment/:subcategory/:subsubcategory" element={<CategoryPage />} />
            <Route path="/category/opinion" element={<CategoryPage title="Opinion" description="Editorial content and opinion pieces" />} />
            
            {/* Additional routes */}
            <Route path="/coming-up" element={<LocalNews />} />
            
            {/* Search Route */}
            <Route path="/search" element={<SearchResults />} />
            
            {/* Supabase Test Route */}
            <Route path="/test-supabase" element={<SupabaseTest />} />
            
            {/* Article Detail Route */}
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;