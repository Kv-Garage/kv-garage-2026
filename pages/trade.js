import { useEffect } from "react";

export default function TradeRedirect() {
  useEffect(() => {
    // Redirect to the trading page
    window.location.href = "/trading";
  }, []);

  return null; // Don't render anything while redirecting
}