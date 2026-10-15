import React from 'react';
import { X, Bookmark, Sun, Moon, Type, Trash2, CheckCircle2 } from 'lucide-react';
import { Article, UserPreferences } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  savedArticles: Article[];
  onSelectArticle: (articleId: string) => void;
  onRemoveSaved: (articleId: string) => void;
  onOpenSubscribe: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  savedArticles,
  onSelectArticle,
  onRemoveSaved,
  onOpenSubscribe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      {/* Click backdrop */}
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e2e2] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans">
              Reader Account
            </div>
            <h3 className="font-nyt-headline font-bold text-[18px] text-black">
              Profile & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Subscription Banner */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-black font-nyt-sans">
                Membership Status
              </span>
              {preferences.isSubscribed ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 font-nyt-sans">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="text-[11px] text-gray-500 font-nyt-sans">Free Visitor</span>
              )}
            </div>
            <p className="text-[12px] text-gray-600 font-nyt-sans mb-3">
              {preferences.isSubscribed
                ? 'Thank you for supporting independent journalism. Unlimited digital access active.'
                : 'Subscribe to access unlimited articles, audio editions, and news archives.'}
            </p>
            {!preferences.isSubscribed && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSubscribe();
                }}
                className="w-full py-1.5 bg-black text-white text-[11px] font-bold rounded hover:bg-gray-800 transition-colors cursor-pointer font-nyt-sans"
              >
                Subscribe for $1/week
              </button>
            )}
          </div>

          {/* Reading Preferences */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans mb-2.5">
              Reading Typography
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdatePreferences({ fontSize: size })}
                  className={`py-2 px-1 text-center border rounded cursor-pointer transition-colors ${
                    preferences.fontSize === size
                      ? 'border-black bg-gray-100 font-bold text-black'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="text-[11px] uppercase block font-nyt-sans">{size}</span>
                  <span
                    className={`block mt-0.5 font-nyt-headline ${
                      size === 'standard' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'
                    }`}
                  >
                    Aa
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reading Theme */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans mb-2.5">
              Reading Theme
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'newspaper', label: 'Newsprint', bg: 'bg-[#fafafa]', border: 'border-gray-300' },
                { id: 'sepia', label: 'Warm Sepia', bg: 'bg-[#f7f2e7]', border: 'border-amber-200' },
                { id: 'dark', label: 'Dark Mode', bg: 'bg-[#1a1a1a]', border: 'border-neutral-700', text: 'text-white' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onUpdatePreferences({ theme: theme.id as any })}
                  className={`p-2 border rounded text-center cursor-pointer transition-all ${theme.bg} ${
                    preferences.theme === theme.id ? 'ring-2 ring-black' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className={`text-[11px] font-nyt-sans block font-medium ${theme.text || 'text-black'}`}>
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Articles List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved for Later ({savedArticles.length})</span>
              </h4>
            </div>

            {savedArticles.length === 0 ? (
              <div className="p-4 border border-dashed border-gray-200 rounded text-center text-[12px] text-gray-500 font-nyt-sans">
                Bookmark articles to read them offline or save for later.
              </div>
            ) : (
              <div className="space-y-2">
                {savedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-2.5 border border-gray-200 rounded flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div
                      onClick={() => {
                        onSelectArticle(article.id);
                        onClose();
                      }}
                      className="cursor-pointer flex-1 pr-2"
                    >
                      <h5 className="font-nyt-headline font-bold text-[13px] text-black leading-snug line-clamp-1">
                        {article.title}
                      </h5>
                      <span className="text-[10px] text-gray-500 font-nyt-sans">
                        {article.readTime}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveSaved(article.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
