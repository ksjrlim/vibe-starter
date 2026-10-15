import React from 'react';
import { Check, Bookmark, Share2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'bookmark' | 'share' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121212] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-[12px] font-nyt-sans animate-fadeUp">
      {type === 'bookmark' && <Bookmark className="w-3.5 h-3.5 fill-white" />}
      {type === 'share' && <Share2 className="w-3.5 h-3.5" />}
      {type === 'success' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
      <span>{message}</span>
    </div>
  );
};
