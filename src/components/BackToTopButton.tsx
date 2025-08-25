import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const SCROLL_THRESHOLD = 300;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > SCROLL_THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-600 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
      aria-label="Get to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};
