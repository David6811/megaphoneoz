import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HeaderWithWordPress from './components/Header/HeaderWithWordPress';
import NewsSite from './components2/NewsSite';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Homepage from './components/Homepage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 新的独立新闻网站 - 作为主页 */}
          <Route path="/" element={<NewsSite />} />
          
          {/* 原有MegaphoneOz网站路由 - 移至/news */}
          <Route 
            path="/news/*" 
            element={
              <div className="App">
                <HeaderWithWordPress />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
                <Footer />
              </div>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;