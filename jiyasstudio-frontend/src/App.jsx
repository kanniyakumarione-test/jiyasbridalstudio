import React, { useEffect, useState } from 'react';
import { initLenis } from './lib/lenis-init';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundOrbs from './components/BackgroundOrbs';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceCategory from './pages/ServiceCategory';
import PackageDetail from './pages/PackageDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import BookVisit from './pages/BookVisit';
import Wigs from './pages/Wigs';
import StudentVoucher from './pages/StudentVoucher';
import AdminPanel from './pages/AdminPanel';
import Loader from './components/Loader';
import PromoBanner from './components/PromoBanner';

import './App.css';

const App = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem('jiya-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });


  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 900);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis smooth scroll once on mount
  useEffect(() => {
    initLenis();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.body.classList.remove('theme-light', 'theme-dark');
    
    const themeClass = theme === 'light' ? 'theme-light' : 'theme-dark';
    document.documentElement.classList.add(themeClass);
    document.body.classList.add(themeClass);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('jiya-theme', theme);
  }, [theme]);

  // Define if we are in admin area to hide global nav/footer
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`app-container ${isLoaded ? 'loaded' : ''} relative min-h-screen`}>
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      <AnimatePresence mode="wait">
        {!isLoaded && <Loader key="global-cinematic-loader" />}
      </AnimatePresence>
      
      <PromoBanner />
      
      <BackgroundOrbs />
      
      {!isAdminPath && (
        <Navbar theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceCategory />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/wigs" element={<Wigs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-visit" element={<BookVisit />} />
          <Route path="/student-voucher" element={<StudentVoucher />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AnimatePresence>

      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
