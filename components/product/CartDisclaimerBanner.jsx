import { useState } from 'react';

export default function CartDisclaimerBanner({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  if (accepted) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-sm">⚠️</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
          <p className="text-yellow-700 text-sm mb-3">
            This cart contains replica products. By proceeding with checkout, you acknowledge and accept that these are 1:1 replicas and not authentic branded items.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disclaimer-accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 text-yellow-600 bg-white border-yellow-300 rounded focus:ring-yellow-500"
            />
            <label htmlFor="disclaimer-accept" className="text-sm text-yellow-700">
              I understand these are replica products
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}