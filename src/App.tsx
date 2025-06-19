import React from 'react';
import './App.css';
import Header from './components/Header';
import Homepage from './components/Homepage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Homepage />
    </div>
  );
};

export default App;