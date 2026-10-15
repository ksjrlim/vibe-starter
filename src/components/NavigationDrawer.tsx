import React, { useState } from 'react';
import { X, Search, ChevronRight, Newspaper, Globe, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (articleId: string) => void;
  onSelectSection: (section: string) => void;
  activeSection: string;
}

const SECTIONS = [
  'Today’s Front Page',
  'Politics',
  'World',
  'U.S. News',
  'Business',
  'Tech',
  'Science',
  'Opinion',
  'Arts',
  'Books',
  'Food & Cooking',
  'Crossword & Games',
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  onSelectSection,
  activeSection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEdition, setCurrentEdition] = useState('U.S.');

  if (!isOpen) return null;

  const searchResults = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.deck?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.byline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.section.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Drawer menu on the left */}
      <div className="w-full max-w-[360px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideRight">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e2e2] flex items-center justify-between bg-white shrink-0">
          <div
            className="font-masthead text-[20px] font-black text-black cursor-pointer"
            style={{ fontFamily: "'UnifrakturMaguntia', 'Chomsky', Georgia, serif" }}
          >
            The New York Times
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#e2e2e2] bg-[#fbfbfb] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search The New York Times"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded text-[13px] font-nyt-sans focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f0f0]">
          {/* Search results view */}
          {searchQuery.trim() ? (
            <div className="p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans mb-2">
                Matching Articles ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <p className="text-[13px] text-gray-500 font-nyt-sans py-4 text-center">
                  No articles found for "{searchQuery}".
                </p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => {
                        onSelectArticle(article.id);
                        onClose();
                      }}
                      className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    >
                      <span className="text-[10px] font-bold uppercase text-[#326891] font-nyt-sans block">
                        {article.section}
                      </span>
                      <h4 className="font-nyt-headline font-bold text-[14px] text-black leading-snug">
                        {article.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-nyt-sans">
                        {article.readTime}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Edition selector */}
              <div className="px-4 py-3 bg-[#fafafa]">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 font-nyt-sans mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Edition
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {['U.S.', 'International', 'Canada', 'Español'].map((ed) => (
                    <button
                      key={ed}
                      onClick={() => setCurrentEdition(ed)}
                      className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer font-nyt-sans ${
                        currentEdition === ed
                          ? 'bg-black text-white font-semibold'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                      }`}
                    >
                      {ed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections list */}
              <div className="py-2">
                <div className="px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-500 font-nyt-sans">
                  Sections
                </div>
                {SECTIONS.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      onSelectSection(sec);
                      onClose();
                    }}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between text-[13.5px] font-nyt-sans transition-colors cursor-pointer ${
                      activeSection === sec
                        ? 'font-bold text-black bg-gray-100'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span>{sec}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Featured products */}
              <div className="p-4 bg-[#fcfcfc] space-y-2">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-500 font-nyt-sans">
                  More From The Times
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] font-nyt-sans">
                  <div className="p-2 border border-gray-200 rounded hover:bg-white transition-colors cursor-pointer">
                    <span className="font-bold text-black block">The Athletic</span>
                    <span className="text-[10px] text-gray-500">Live Sports</span>
                  </div>
                  <div className="p-2 border border-gray-200 rounded hover:bg-white transition-colors cursor-pointer">
                    <span className="font-bold text-black block">NYT Cooking</span>
                    <span className="text-[10px] text-gray-500">20,000+ Recipes</span>
                  </div>
                  <div className="p-2 border border-gray-200 rounded hover:bg-white transition-colors cursor-pointer">
                    <span className="font-bold text-black block">Wirecutter</span>
                    <span className="text-[10px] text-gray-500">Product Reviews</span>
                  </div>
                  <div className="p-2 border border-gray-200 rounded hover:bg-white transition-colors cursor-pointer">
                    <span className="font-bold text-black block">Games</span>
                    <span className="text-[10px] text-gray-500">Spelling Bee & Wordle</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
