import { useState, useEffect } from 'react';

export default function UrgencyBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has dismissed the bar
    const dismissed = localStorage.getItem('urgencyBarDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    // Add padding to body to prevent content overlap with UrgencyBar
    if (isVisible) {
      document.body.style.paddingTop = '72px'; // Height of UrgencyBar + some buffer
    } else {
      document.body.style.paddingTop = '0';
    }

    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [isVisible]);

  const dismissBar = () => {
    setIsVisible(false);
    localStorage.setItem('urgencyBarDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#D4AF37]/95 to-yellow-500/95 text-black py-3 px-4 shadow-lg" style={{ top: '0' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-sm font-bold">
            🚀 LIVE
          </span>
          <p className="text-sm font-medium">
            New inventory drops every Monday • 7,800+ customers trust us • Fast shipping worldwide
          </p>
        </div>
        <button
          onClick={dismissBar}
          className="text-black hover:text-gray-700 transition-colors duration-200"
          aria-label="Close announcement"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}