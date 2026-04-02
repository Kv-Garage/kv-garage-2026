import { useState } from 'react';

export default function AirPodMaxDisclaimerModal({ isOpen, onClose, onAccept, productName }) {
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
          <div className="w-12 h-12 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#D4AF37] text-xl">🎧</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">AirPod Max Disclosure</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This AirPod Max is 1:1 high quality inventory. It is not an authentic Apple product 
              but offers premium build quality and functionality at a fraction of the retail price.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mt-3">
              By continuing, you acknowledge that you are purchasing a high-quality alternative product, 
              not an official Apple item.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#D4AF37] bg-white/10 border-white/30 rounded focus:ring-[#D4AF37] focus:ring-2"
            />
            <span className="text-sm text-gray-300 leading-relaxed">
              Yes, I understand I am buying 1:1 high quality inventory. This is NOT an authentic Apple AirPod Max.
            </span>
          </label>

          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              disabled={!agreed}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                agreed
                  ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
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