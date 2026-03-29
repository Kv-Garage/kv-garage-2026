import { useState, useEffect } from 'react';

export function useDevice() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updateDevice() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height,
      });
    }

    // Initial check
    updateDevice();

    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return device;
}

export function useIsMobile() {
  const { isMobile } = useDevice();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useDevice();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useDevice();
  return isDesktop;
}