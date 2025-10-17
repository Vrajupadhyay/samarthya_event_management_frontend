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
      '/': 'DJ Night 2025 - Event Registration',
      '/register': 'Register - DJ Night 2025',
      '/login': 'Login - DJ Night 2025',
      '/admin': 'Admin Dashboard - DJ Night 2025',
      '/scanner': 'Entry Scanner - DJ Night 2025',
    };

    const title = pageTitles[pathname] || 'DJ Night 2025';
    document.title = title;
  }, [pathname, behavior]);

  return null;
};

export default ScrollToTop;
