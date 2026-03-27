import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AffiliateTracker() {
  const router = useRouter();

  useEffect(() => {
    const checkAffiliateReferral = async () => {
      // Check for affiliate referral in URL
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');

      if (refCode) {
        // Store referral code in localStorage for later use
        localStorage.setItem('affiliate_referral_code', refCode);
        
        // Track the click
        try {
          const response = await fetch('/api/affiliate/track-click', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              affiliateId: null, // We'll get this when we have affiliate data
              productId: null
            }),
          });

          if (response.ok) {
            console.log('Affiliate click tracked');
          }
        } catch (error) {
          console.error('Error tracking affiliate click:', error);
        }
      }
    };

    checkAffiliateReferral();
  }, []);

  return null; // This component doesn't render anything
}