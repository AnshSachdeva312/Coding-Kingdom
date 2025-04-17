import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Results from './pages/Results';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/signin';

  const style = {
    appContainer: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f9',
      minHeight: '100vh',
    },
  };

  return (
    <div style={style.appContainer}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
