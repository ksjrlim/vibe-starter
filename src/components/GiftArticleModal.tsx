import React, { useState } from 'react';
import { X, Gift, Copy, Check, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface GiftArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export const GiftArticleModal: React.FC<GiftArticleModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const giftUrl = `${window.location.origin}/?gift=${article.id}&token=nyt_gift_7x9q`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(giftUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-lg shadow-2xl overflow-hidden animate-scaleUp p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#326891] font-nyt-sans">
            <Gift className="w-4 h-4 text-[#326891]" />
            <span>Subscriber Gift Link</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block font-nyt-sans">
            9 gift articles remaining this month
          </div>

          <h3 className="font-nyt-headline font-bold text-[17px] text-black leading-snug">
            {article.title}
          </h3>

          <p className="text-[12px] text-gray-600 font-nyt-sans leading-relaxed">
            Anyone who clicks your gift link can read this article for free without an active subscription.
          </p>

          <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-gray-600 truncate flex-1">
              {giftUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded text-[11px] font-bold font-nyt-sans transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Gift Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-[10.5px] text-gray-400 font-nyt-sans border-t border-gray-100">
          Gift links remain active for 30 days after generation.
        </div>
      </div>
    </div>
  );
};
