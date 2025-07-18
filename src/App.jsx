import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './firebase';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle authentication redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isLoginPage = location.pathname === '/login';
      if (user && isLoginPage) navigate('/');
      if (!user && !isLoginPage) navigate('/login');
    });

    return () => unsubscribe();
  }, [navigate, location]);

  // ✅ Set dynamic title and favicon
  useEffect(() => {
    // Dynamic title logic
    const path = location.pathname;

    if (path === '/') {
      document.title = 'Movie App';
    } else if (path.startsWith('/login')) {
      document.title = 'Login - Movie App';
    } else if (path.startsWith('/player')) {
      document.title = 'Player - Movie App';
    } else {
      document.title = 'Movie App';
    }

    // Favicon logic
    const favicon = document.querySelector("link[rel='icon']");
    const faviconHref = "/movie_icon_v2.ico";

    if (favicon) {
      favicon.href = faviconHref;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = faviconHref;
      document.head.appendChild(newFavicon);
    }
  }, [location]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </>
  );
};

export default App;
