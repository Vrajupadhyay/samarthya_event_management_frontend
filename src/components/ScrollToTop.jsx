import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ behavior = 'instant' }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    // Using timeout to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior // 'instant' for immediate, 'smooth' for animated
      });
    }, 0);

    // Update page title based on route
    const pageTitles = {
      '/': 'BEAT BLAZE 2025 - Event Registration',
      '/register': 'Register - BEAT BLAZE 2025',
      '/login': 'Login - BEAT BLAZE 2025',
      '/admin': 'Admin Dashboard - BEAT BLAZE 2025',
      '/scanner': 'Entry Scanner - BEAT BLAZE 2025',
    };

    const title = pageTitles[pathname] || 'BEAT BLAZE 2025';
    document.title = title;
  }, [pathname, behavior]);

  return null;
};

export default ScrollToTop;
