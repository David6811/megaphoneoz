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
            
            {/* WordPress-style category routes */}
            <Route path="/category/news/localnews" element={<LocalNews />} />
            <Route path="/category/news/nationalnews" element={<LocalNews />} />
            <Route path="/category/news/worldnews" element={<LocalNews />} />
            <Route path="/category/news/featurednews/" element={<LocalNews />} />
            <Route path="/category/news/environment" element={<LocalNews />} />
            <Route path="category/media/" element={<LocalNews />} />
            
            {/* Lifestyle Routes - All navigate to LocalNews component */}
            <Route path="/category/lifestyle/foodwine/restaurantreviews" element={<LocalNews />} />
            <Route path="/category/lifestyle/foodwine/winematch/" element={<LocalNews />} />
            <Route path="/lifestyle/food-wine/wine-match" element={<LocalNews />} />
            <Route path="/category/lifestyle/sport/" element={<LocalNews />} />
            <Route path="/category/lifestyle/travel/" element={<LocalNews />} />
            
            {/* WordPress-style category routes for Lifestyle */}
            <Route path="/category/lifestyle/food-wine" element={<LocalNews />} />
            <Route path="/category/lifestyle/sport" element={<LocalNews />} />
            <Route path="/category/lifestyle/travel" element={<LocalNews />} />
            
            {/* Arts and Entertainment Routes - All navigate to LocalNews component */}
            <Route path="/category/artsentertainment/theatre/theatrereviews/" element={<LocalNews />} />
            <Route path="/arts/theatre/reviews" element={<LocalNews />} />
            <Route path="/arts/film" element={<LocalNews />} />
            <Route path="/arts/music" element={<LocalNews />} />
            <Route path="/arts/galleries" element={<LocalNews />} />
            <Route path="/arts/galleries/exhibitions" element={<LocalNews />} />
            <Route path="/arts/galleries/eye-on-the-street" element={<LocalNews />} />
            <Route path="/arts/books" element={<LocalNews />} />
            <Route path="/arts/drawn-and-quartered" element={<LocalNews />} />
            
            {/* WordPress-style category routes for Arts & Entertainment */}
            <Route path="/category/arts-entertainment/theatre" element={<LocalNews />} />
            <Route path="/category/artsentertainment/filmreviews/" element={<LocalNews />} />
            <Route path="/category/artsentertainment/musicreviews/" element={<LocalNews />} />
            <Route path="/category/artsentertainment/galleries/exhibitions/" element={<LocalNews />} />
            <Route path="/category/artsentertainment/galleries/eyeonthestreet/" element={<LocalNews />} />
            <Route path="/category/artsentertainment/books/" element={<LocalNews />} />
            <Route path="/drawn-and-quartered/" element={<LocalNews />} />

            
            
            {/* Opinion Route - Direct navigation to LocalNews component */}
            <Route path="/category/opinion/" element={<LocalNews />} />
            
            {/* Additional routes */}
            <Route path="/coming-up" element={<LocalNews />} />
            
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