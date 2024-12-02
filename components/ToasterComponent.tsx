'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterComponent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <Toaster position={isMobile ? 'bottom-center' : 'top-right'} />;
};

export default ToasterComponent;
