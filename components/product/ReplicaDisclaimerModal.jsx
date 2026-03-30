import { useState } from 'react';

export default function ReplicaDisclaimerModal({ isOpen, onClose, onAccept, productName }) {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-400 text-xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">Important Product Disclosure</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This product is a 1:1 replica and is not an authentic branded item.
              It is designed for aesthetic and style purposes only.
              By continuing, you acknowledge and accept this information.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-yellow-500 bg-white/10 border-white/30 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300 leading-relaxed">
              I understand that this is a replica product and not an authentic branded item.
            </span>
          </label>

          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              disabled={!agreed}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                agreed
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Purchase
            </button>
            <button
              onClick={onClose}
              className="border border-white/30 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}