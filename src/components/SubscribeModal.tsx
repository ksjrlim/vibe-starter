import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isSubscribed?: boolean;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isSubscribed = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'intro' | 'all-access'>('intro');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-[460px] bg-white rounded-lg shadow-2xl overflow-hidden animate-scaleUp">
        {/* Top Header */}
        <div className="relative p-5 pb-4 border-b border-[#e2e2e2] text-center bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span
            className="font-masthead text-[22px] tracking-tight block text-black"
            style={{ fontFamily: "'UnifrakturMaguntia', 'Chomsky', Georgia, serif" }}
          >
            The New York Times
          </span>

          <p className="text-[11px] uppercase tracking-widest font-bold text-[#326891] font-nyt-sans mt-2">
            Limited-Time Digital Sale
          </p>
          <h2 className="font-nyt-headline font-bold text-[22px] sm:text-[24px] text-black leading-tight mt-1">
            Understand the world with fearless, independent journalism.
          </h2>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {/* Plan Selection */}
          <div className="space-y-3">
            <div
              onClick={() => setSelectedPlan('intro')}
              className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                selectedPlan === 'intro'
                  ? 'border-black bg-gray-50/70 ring-1 ring-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#326891] font-nyt-sans block">
                    Most Popular
                  </span>
                  <div className="text-[16px] font-bold text-black font-nyt-sans">
                    Basic Digital Access
                  </div>
                  <div className="text-[12px] text-gray-600 font-nyt-sans">
                    Unlimited articles on nytimes.com and the NYT app.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black text-black font-nyt-sans">$1</div>
                  <div className="text-[10px] text-gray-500 font-nyt-sans">/ week for 1 yr</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedPlan('all-access')}
              className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                selectedPlan === 'all-access'
                  ? 'border-black bg-gray-50/70 ring-1 ring-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-nyt-sans block">
                    Complete Suite
                  </span>
                  <div className="text-[16px] font-bold text-black font-nyt-sans">
                    All Access Pass
                  </div>
                  <div className="text-[12px] text-gray-600 font-nyt-sans">
                    News + Games + Cooking + Wirecutter + The Athletic.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black text-black font-nyt-sans">$2.50</div>
                  <div className="text-[10px] text-gray-500 font-nyt-sans">/ week for 1 yr</div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits bullets */}
          <div className="pt-2 border-t border-gray-100 space-y-2 text-[12.5px] font-nyt-sans text-gray-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black shrink-0" />
              <span>Full access to breaking investigations and live visual briefings</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black shrink-0" />
              <span>Audio articles, podcasts, and curated newsletters</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-black shrink-0" />
              <span>Cancel or pause your subscription anytime with one click</span>
            </div>
          </div>

          {/* Subscribe CTA Button */}
          <button
            onClick={handleSubscribe}
            disabled={processing}
            className="w-full py-3 bg-black text-white font-bold text-[13px] rounded tracking-wide hover:bg-gray-800 transition-colors cursor-pointer active:scale-[0.99] font-nyt-sans"
          >
            {processing
              ? 'Activating Subscription...'
              : isSubscribed
              ? 'Update Active Subscription'
              : 'Subscribe Now for $1/week'}
          </button>

          <div className="text-center text-[10.5px] text-gray-400 font-nyt-sans flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
            <span>Secure 256-bit checkout • Billed $4 every 4 weeks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
