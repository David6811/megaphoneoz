import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HeaderWithWordPress from './components/Header/HeaderWithWordPress';
import Homepage from './components/Homepage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <HeaderWithWordPress />
        <Homepage />
      </div>
    </ThemeProvider>
  );
};

export default App;