import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArticleView } from './components/ArticleView';
import { CommentsDrawer } from './components/CommentsDrawer';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SubscribeModal } from './components/SubscribeModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { GiftArticleModal } from './components/GiftArticleModal';
import { MarketWeatherBar } from './components/MarketWeatherBar';
import { TheDailyPlayer } from './components/TheDailyPlayer';
import { MiniCrossword } from './components/MiniCrossword';
import { RecipeCard } from './components/RecipeCard';
import { OpinionStrip } from './components/OpinionStrip';
import { Toast } from './components/ShareToast';
import { ARTICLES, INITIAL_COMMENTS } from './data/articles';
import { Article, Comment, UserPreferences } from './types';
import {
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Radio,
  Flame,
  Gamepad2,
  Bookmark,
  Newspaper,
  Compass,
  Headphones,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Navigation & Screen States
  const [currentScreen, setCurrentScreen] = useState<'home' | 'article'>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('high-ranking-women');
  const [activeSection, setActiveSection] = useState<string>('Today’s Front Page');
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [bottomTab, setBottomTab] = useState<'today' | 'audio' | 'games' | 'cooking' | 'saved'>('today');

  // Drawers & Modals
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsArticleId, setCommentsArticleId] = useState<string>('high-ranking-women');
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [giftArticle, setGiftArticle] = useState<Article>(ARTICLES[0]);

  // Breaking news banner dismiss state
  const [showBreakingNews, setShowBreakingNews] = useState(true);

  // App Data & Comments State
  const [commentsData, setCommentsData] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'standard',
    theme: 'newspaper',
    savedArticleIds: ['high-ranking-women', 'ukraine-satellite-curbed'],
    isSubscribed: false,
  });

  // Desktop view mode (centered mobile frame matching screenshot or wider desktop)
  const [viewMode, setViewMode] = useState<'mobile' | 'wide'>('mobile');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'bookmark' | 'share' | 'success'>('success');

  const showToast = (message: string, type: 'bookmark' | 'share' | 'success' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Article selection
  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentScreen('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open comments for a specific article
  const handleOpenComments = (articleId: string) => {
    setCommentsArticleId(articleId);
    setIsCommentsOpen(true);
  };

  // Save / Bookmark toggle
  const handleToggleSave = (articleId: string) => {
    const isAlreadySaved = preferences.savedArticleIds.includes(articleId);
    const newSaved = isAlreadySaved
      ? preferences.savedArticleIds.filter((id) => id !== articleId)
      : [...preferences.savedArticleIds, articleId];

    setPreferences((prev) => ({ ...prev, savedArticleIds: newSaved }));
    showToast(
      isAlreadySaved ? 'Removed from Saved Articles' : 'Saved to your Reading List',
      'bookmark'
    );
  };

  // Share article
  const handleShare = (article: Article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard', 'share');
    } else {
      showToast('Link ready to share', 'share');
    }
  };

  // Gift article modal trigger
  const handleGiftArticle = (article: Article) => {
    setGiftArticle(article);
    setIsGiftOpen(true);
  };

  // Add reader comment
  const handleAddComment = (newComment: Omit<Comment, 'id' | 'timestamp' | 'recommendations'>) => {
    const commentObj: Comment = {
      ...newComment,
      id: 'c_' + Date.now(),
      timestamp: 'Just now',
      recommendations: 1,
    };

    setCommentsData((prev) => ({
      ...prev,
      [commentsArticleId]: [commentObj, ...(prev[commentsArticleId] || [])],
    }));

    showToast('Your comment has been submitted', 'success');
  };

  // Recommend comment
  const handleRecommendComment = (commentId: string) => {
    setCommentsData((prev) => {
      const currentList = prev[commentsArticleId] || [];
      const updatedList = currentList.map((c) =>
        c.id === commentId ? { ...c, recommendations: c.recommendations + 1 } : c
      );
      return { ...prev, [commentsArticleId]: updatedList };
    });
  };

  // Cycle font size
  const cycleFontSize = () => {
    const sizes: ('standard' | 'medium' | 'large')[] = ['standard', 'medium', 'large'];
    const nextIndex = (sizes.indexOf(preferences.fontSize) + 1) % sizes.length;
    setPreferences((prev) => ({ ...prev, fontSize: sizes[nextIndex] }));
    showToast(`Font size set to ${sizes[nextIndex]}`);
  };

  const selectedArticle =
    ARTICLES.find((a) => a.id === selectedArticleId) || ARTICLES[0];
  const commentsArticle =
    ARTICLES.find((a) => a.id === commentsArticleId) || ARTICLES[0];
  const savedArticlesList = ARTICLES.filter((a) =>
    preferences.savedArticleIds.includes(a.id)
  );
  const relatedArticles = ARTICLES.filter((a) => a.id !== selectedArticleId);

  // Background style based on theme
  const getThemeClasses = () => {
    if (preferences.theme === 'sepia') {
      return 'bg-[#fbf7ee] text-[#1c1917]';
    }
    if (preferences.theme === 'dark') {
      return 'bg-[#121212] text-[#e0e0e0]';
    }
    return 'bg-white text-[#121212]';
  };

  // Filtered articles based on activeSection
  const filteredArticles = ARTICLES.filter((a) => {
    if (activeSection === 'Today’s Front Page') return true;
    if (activeSection === 'Politics') return a.section === 'Politics';
    if (activeSection === 'World') return a.section === 'World';
    if (activeSection === 'Business') return a.section === 'Business';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col items-center">
      {/* Top Pro Control Strip */}
      <div className="w-full bg-[#121212] text-[#a0a0a0] px-4 py-1.5 text-[11px] font-nyt-sans flex items-center justify-between z-40 border-b border-[#2a2a2a] sticky top-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide uppercase text-[10px]">
            The New York Times
          </span>
          <span className="hidden sm:inline text-emerald-400 font-semibold">• Pro Edition</span>
          <span className="hidden md:inline text-gray-500">
            {preferences.isSubscribed ? '(Unlimited Access Active)' : '(Subscriber Pass Available)'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Gift button */}
          <button
            onClick={() => handleGiftArticle(selectedArticle)}
            className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold bg-[#1e2e25] px-2 py-0.5 rounded border border-[#2a4535]"
          >
            <span>Gift Article</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center bg-[#242424] rounded p-0.5 border border-[#3a3a3a]">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                viewMode === 'mobile' ? 'bg-white text-black font-bold' : 'text-gray-300 hover:text-white'
              }`}
              title="Centered Mobile Frame (as in prompt)"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden xs:inline">Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('wide')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                viewMode === 'wide' ? 'bg-white text-black font-bold' : 'text-gray-300 hover:text-white'
              }`}
              title="Desktop Broadsheet Multi-Column View"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden xs:inline">Broadsheet</span>
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() =>
              setPreferences((prev) => ({
                ...prev,
                theme: prev.theme === 'dark' ? 'newspaper' : 'dark',
              }))
            }
            className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#242424]"
            title="Toggle Dark Mode"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-3 h-3 text-amber-400" />
            ) : (
              <Moon className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div
        className={`w-full ${
          viewMode === 'mobile' ? 'max-w-[480px] my-3 sm:my-6 rounded-none sm:rounded-2xl shadow-xl' : 'max-w-[1200px] my-4 rounded-xl shadow-lg'
        } ${getThemeClasses()} min-h-screen border-x border-[#e9e9e9] flex flex-col transition-all duration-200 overflow-hidden relative`}
      >
        {/* Device Status Bar in Mobile View */}
        {viewMode === 'mobile' && (
          <div className="w-full bg-white px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-nyt-sans font-semibold text-black select-none border-b border-gray-100">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 border border-black rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-black rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Main NYT Header */}
        <Header
          onOpenMenu={() => setIsNavOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSubscribe={() => setIsSubscribeOpen(true)}
          onReturnHome={() => {
            setCurrentScreen('home');
            setBottomTab('today');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isSubscribed={preferences.isSubscribed}
        />

        {/* Financial Market & Weather Ticker */}
        <MarketWeatherBar />

        {/* Breaking News Banner */}
        {showBreakingNews && currentScreen === 'home' && (
          <div className="bg-[#fff1f1] border-b border-[#fcdada] px-3.5 py-1.5 flex items-center justify-between text-[11.5px] font-nyt-sans text-red-950">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              <span className="font-black text-[#a81414] uppercase text-[10px] tracking-wider shrink-0">
                Live Analysis
              </span>
              <span
                onClick={() => handleSelectArticle('high-ranking-women')}
                className="truncate hover:underline cursor-pointer font-medium"
              >
                White House confirms cabinet restructuring reviews — Follow real-time coverage
              </span>
            </div>
            <button
              onClick={() => setShowBreakingNews(false)}
              className="text-gray-400 hover:text-black ml-2 text-[12px] font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* SECTION BAR TABS */}
        {currentScreen === 'home' && (
          <div className="border-b border-[#e2e2e2] bg-white px-3.5 py-1 flex items-center gap-3 overflow-x-auto whitespace-nowrap text-[12px] font-nyt-sans text-gray-700 scrollbar-none">
            {['Today’s Front Page', 'Politics', 'World', 'Business', 'Opinion', 'Cooking', 'Games'].map(
              (sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setActiveSection(sec);
                    if (sec === 'Games') setBottomTab('games');
                    if (sec === 'Cooking') setBottomTab('cooking');
                    if (sec === 'Today’s Front Page') setBottomTab('today');
                  }}
                  className={`py-1 font-semibold transition-colors cursor-pointer border-b-2 ${
                    activeSection === sec
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  {sec}
                </button>
              )
            )}
          </div>
        )}

        {/* SCREEN 1: ARTICLE READER VIEW */}
        {currentScreen === 'article' && (
          <ArticleView
            article={selectedArticle}
            onBack={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenComments={handleOpenComments}
            onToggleSave={handleToggleSave}
            isSaved={preferences.savedArticleIds.includes(selectedArticle.id)}
            onShare={handleShare}
            onGiftArticle={handleGiftArticle}
            onSelectArticle={handleSelectArticle}
            relatedArticles={relatedArticles}
            fontSize={preferences.fontSize}
            onChangeFontSize={cycleFontSize}
          />
        )}

        {/* SCREEN 2: FRONT PAGE MAIN CONTENT */}
        {currentScreen === 'home' && (
          <div className="flex-grow">
            {/* If user clicked Games tab */}
            {bottomTab === 'games' ? (
              <div className="p-4 max-w-[680px] mx-auto animate-fadeIn">
                <MiniCrossword />
              </div>
            ) : bottomTab === 'cooking' ? (
              <div className="p-4 max-w-[680px] mx-auto animate-fadeIn">
                <RecipeCard />
              </div>
            ) : bottomTab === 'audio' ? (
              <div className="p-4 max-w-[680px] mx-auto animate-fadeIn space-y-4">
                <TheDailyPlayer />
                <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-black font-nyt-sans mb-1">
                    Featured Audio Reporting
                  </h4>
                  <p className="text-[13px] text-gray-600 font-nyt-sans">
                    Listen to deep-dive investigations narrated by the original Times correspondents.
                  </p>
                </div>
              </div>
            ) : (
              /* Standard Front Page Feed */
              <main className="px-3.5 pt-3 pb-8" data-purpose="nyt-main-content">
                {/* WIDE BROADSHEET 2-COLUMN LAYOUT IF IN DESKTOP MODE */}
                <div className={viewMode === 'wide' ? 'grid grid-cols-12 gap-6' : 'space-y-4'}>
                  {/* Left Column (Primary News Stories) */}
                  <div className={viewMode === 'wide' ? 'col-span-7 space-y-4' : 'space-y-4'}>
                    {/* Free to Read Callout Section */}
                    <section
                      className="border border-[#121212] pt-4 pb-0 mb-4 px-3.5 bg-white transition-colors"
                      data-purpose="top-stories-callout"
                    >
                      <div className="text-center mb-3">
                        <p className="text-[13px] text-[#121212] tracking-normal font-nyt-sans">
                          These top stories are <span className="font-bold">free to read.</span>
                        </p>
                        {/* Signature Top Blue Line */}
                        <div
                          className="w-12 h-[1.5px] bg-[#326891] mx-auto mt-1.5"
                          style={{ width: '48px', height: '1.5px', backgroundColor: '#326891' }}
                        />
                      </div>

                      {/* Lead Story Article */}
                      <article className="mt-4 mb-2" data-purpose="lead-story">
                        <h2
                          onClick={() => handleSelectArticle('high-ranking-women')}
                          className="font-nyt-headline text-[28px] sm:text-[30px] font-bold text-[#121212] headline-leading mb-2 hover:text-[#555] transition-colors cursor-pointer"
                        >
                          High-Ranking Women Are Leaving the Trump Administration
                        </h2>

                        <p
                          onClick={() => handleSelectArticle('high-ranking-women')}
                          className="font-nyt-headline text-[15px] sm:text-[16px] text-[#444] summary-leading mb-2.5 cursor-pointer"
                        >
                          In the president’s second term, those heading for the exits are female officials.
                        </p>

                        <div className="flex items-center space-x-2 text-[10.5px] font-bold text-[#727272] tracking-wider font-nyt-sans uppercase mb-3">
                          <span>5 MIN READ</span>
                        </div>

                        {/* High-Resolution Lead Photograph */}
                        <div
                          onClick={() => handleSelectArticle('high-ranking-women')}
                          className="w-full -mx-3.5 w-[calc(100%+28px)] overflow-hidden cursor-pointer group relative"
                        >
                          <img
                            alt="High-ranking administration official portrait"
                            className="w-full h-auto object-cover object-top max-h-[460px] group-hover:scale-[1.01] transition-transform duration-300 bg-[#edf0f2]"
                            src="/src/assets/images/whitehouse_officials_departure_1792032453518.jpg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg';
                            }}
                          />
                          <div className="px-3.5 py-1.5 bg-black/60 text-white text-[10.5px] font-nyt-sans absolute bottom-0 left-0 right-0 flex justify-between items-center opacity-90">
                            <span>Kenny Holston / The New York Times</span>
                            <span className="underline">View Full Story →</span>
                          </div>
                        </div>
                      </article>
                    </section>

                    {/* Secondary Top Stories */}
                    <section className="space-y-4 pt-1" data-purpose="secondary-stories">
                      {/* Story Item: Kimberly Guilfoyle */}
                      <article className="border-b border-[#e2e2e2] pb-3.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3
                            onClick={() => handleSelectArticle('guilfoyle-rise-fall')}
                            className="font-nyt-headline text-[18px] font-bold leading-tight text-[#121212] hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            The Steep Rise and Sudden Fall of Kimberly Guilfoyle
                          </h3>
                          <button
                            onClick={() => handleOpenComments('guilfoyle-rise-fall')}
                            aria-label="520 comments on Kimberly Guilfoyle story"
                            className="flex items-center text-[11px] text-[#5a5a5a] font-nyt-sans font-medium shrink-0 ml-1 hover:text-black cursor-pointer group"
                          >
                            <svg className="w-3 h-3 mr-0.5 inline fill-current group-hover:text-black" viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
                            </svg>
                            <span>520</span>
                          </button>
                        </div>
                      </article>

                      {/* Story Item: Press Secretary */}
                      <article className="border-b border-[#e2e2e2] pb-4">
                        <h3
                          onClick={() => handleSelectArticle('press-secretary-credentials')}
                          className="font-nyt-headline text-[19px] font-bold leading-tight text-[#121212] mb-1.5 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                          Trump’s New Press Secretary: Not-Quite Attorney at Law
                        </h3>
                        <p
                          onClick={() => handleSelectArticle('press-secretary-credentials')}
                          className="font-nyt-headline text-[14px] text-[#444] leading-snug mb-2 cursor-pointer"
                        >
                          Katie Zacharia told The New York Times that the confusion over her legal credentials is the result of one big misunderstanding.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold text-[#727272] uppercase tracking-wider font-nyt-sans">
                            4 MIN READ
                          </div>
                          <button
                            onClick={() => handleOpenComments('press-secretary-credentials')}
                            className="text-[11px] text-[#5a5a5a] hover:text-black font-nyt-sans flex items-center cursor-pointer"
                          >
                            <svg className="w-3 h-3 mr-0.5 inline fill-current" viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
                            </svg>
                            <span>318</span>
                          </button>
                        </div>
                      </article>

                      {/* Sub-Section: More To Read For Free */}
                      <div className="pt-2">
                        <div className="text-[11px] font-nyt-sans text-[#555] mb-2 font-medium">
                          More to read <strong className="text-black font-bold">for free.</strong>
                        </div>

                        {/* Topic Pill Header: Russia-Ukraine War */}
                        <div className="mb-3">
                          <h4 className="text-[12px] font-black uppercase tracking-wider text-black mb-1.5 font-nyt-sans">
                            Russia-Ukraine War
                          </h4>
                          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-[#326891] font-nyt-sans">
                            <button
                              onClick={() => {
                                setActiveSubtopic(activeSubtopic === 'Wins for Putin' ? null : 'Wins for Putin');
                                handleSelectArticle('ukraine-satellite-curbed');
                              }}
                              className="hover:underline flex items-center cursor-pointer"
                            >
                              <span className="w-1 h-1 bg-black rounded-full inline-block mr-1.5"></span>
                              Wins for Putin
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              onClick={() => {
                                setActiveSubtopic(activeSubtopic === 'Escalating Assaults' ? null : 'Escalating Assaults');
                                handleSelectArticle('ukraine-satellite-curbed');
                              }}
                              className="hover:underline flex items-center cursor-pointer"
                            >
                              <span className="w-1 h-1 bg-black rounded-full inline-block mr-1.5"></span>
                              Escalating Assaults
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              onClick={() => {
                                setActiveSubtopic(activeSubtopic === 'Russian Oil Deal' ? null : 'Russian Oil Deal');
                                handleSelectArticle('diesel-deal-putin');
                              }}
                              className="hover:underline flex items-center cursor-pointer"
                            >
                              <span className="w-1 h-1 bg-black rounded-full inline-block mr-1.5"></span>
                              Russian Oil Deal
                            </button>
                          </div>
                        </div>

                        {/* Featured War Story with Photo */}
                        <article className="border-b border-[#e2e2e2] pb-3.5 mt-2.5">
                          <h3
                            onClick={() => handleSelectArticle('ukraine-satellite-curbed')}
                            className="font-nyt-headline text-[18px] font-bold leading-tight text-[#121212] mb-1.5 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            Ukraine’s Exposure Grows as Satellite Use Is Restricted and Russia Escalates
                          </h3>
                          <p
                            onClick={() => handleSelectArticle('ukraine-satellite-curbed')}
                            className="font-nyt-headline text-[13.5px] text-[#444] leading-snug mb-2 cursor-pointer"
                          >
                            A huge attack cut power to 600,000 people in Kyiv, and a Pentagon-funded satellite internet program appeared to be curbed without warning.
                          </p>
                          <button
                            onClick={() => handleOpenComments('ukraine-satellite-curbed')}
                            className="flex items-center text-[11px] text-[#5a5a5a] font-nyt-sans hover:text-black cursor-pointer group"
                          >
                            <svg className="w-3 h-3 mr-0.5 inline fill-current group-hover:text-black" viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
                            </svg>
                            <span>1.1k</span>
                          </button>
                        </article>

                        {/* Short Story: Diesel Deal */}
                        <article className="border-b border-[#e2e2e2] py-3">
                          <h3
                            onClick={() => handleSelectArticle('diesel-deal-putin')}
                            className="font-nyt-headline text-[16.5px] font-bold leading-tight text-[#121212] mb-1 hover:text-gray-600 transition-colors cursor-pointer"
                          >
                            Why Trump’s Diesel Deal With Putin Won’t Knock Down High Prices
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-[#727272] uppercase tracking-wider font-nyt-sans">
                              4 MIN READ
                            </div>
                            <button
                              onClick={() => handleOpenComments('diesel-deal-putin')}
                              className="text-[11px] text-[#5a5a5a] hover:text-black font-nyt-sans flex items-center cursor-pointer"
                            >
                              <svg className="w-3 h-3 mr-0.5 inline fill-current" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
                              </svg>
                              <span>420</span>
                            </button>
                          </div>
                        </article>
                      </div>

                      {/* Section: The Evening Briefing */}
                      <article
                        onClick={() => handleSelectArticle('the-evening-briefing')}
                        className="bg-[#fbfbfb] p-3.5 border-l-2 border-black mt-3 cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                      >
                        <div className="text-[10.5px] font-black uppercase tracking-wider text-black mb-0.5 font-nyt-sans">
                          The Evening
                        </div>
                        <h3 className="font-nyt-headline text-[17px] font-bold leading-tight text-black mb-1 hover:text-gray-700">
                          Catch Up on Today’s Biggest Stories
                        </h3>
                        <p className="font-nyt-headline text-[13px] text-[#555] leading-snug mb-1.5">
                          Energy prices lift inflation, Ukraine grows more vulnerable and the Texas Senate race tightens.
                        </p>
                        <div className="text-[10px] font-bold text-[#727272] uppercase tracking-wider font-nyt-sans">
                          5 MIN READ
                        </div>
                      </article>

                      {/* Section: Election Dispatches */}
                      <div className="pt-3 border-t border-[#e2e2e2]">
                        <div className="text-[11px] font-black uppercase tracking-wider text-[#a81414] mb-1 font-nyt-sans">
                          Election Dispatches
                        </div>
                        <article className="mb-3">
                          <h3
                            onClick={() => handleSelectArticle('election-dispatches-texas')}
                            className="font-nyt-headline text-[18px] font-bold leading-tight text-[#121212] hover:text-gray-600 cursor-pointer mb-2"
                          >
                            Texas Senate Race Tightens, Polls Show, Even as Talarico Keeps His Edge
                          </h3>
                          <ul className="text-[13px] font-nyt-sans text-[#333] space-y-2 pl-3 border-l border-gray-200">
                            <li
                              onClick={() => handleSelectArticle('election-dispatches-texas')}
                              className="leading-snug cursor-pointer hover:text-black transition-colors"
                            >
                              Jon Ossoff says he’s not running for president, but history says he can change his mind.
                            </li>
                            <li
                              onClick={() => handleSelectArticle('election-dispatches-texas')}
                              className="leading-snug cursor-pointer hover:text-black transition-colors"
                            >
                              The breathtaking cost of the midterms: $10 billion and counting on ads.
                            </li>
                          </ul>
                        </article>
                      </div>
                    </section>
                  </div>

                  {/* Right Column (The Daily Podcast, Mini Crossword, Recipe, Opinion) */}
                  <div className={viewMode === 'wide' ? 'col-span-5 space-y-4 pt-1' : 'space-y-4'}>
                    {/* The Daily Audio Player */}
                    <TheDailyPlayer />

                    {/* Playable NYT Mini Crossword */}
                    <MiniCrossword />

                    {/* NYT Cooking Recipe Card */}
                    <RecipeCard />

                    {/* Opinion Columnists */}
                    <OpinionStrip
                      onSelectOpinion={(title) => {
                        showToast(`Selected column: ${title}`);
                      }}
                    />
                  </div>
                </div>
              </main>
            )}
          </div>
        )}

        {/* Mobile App Bottom Tab Bar (Authentic iOS/Android NYT Tab Bar) */}
        {viewMode === 'mobile' && (
          <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e2e2] px-2 py-1.5 flex items-center justify-around text-[10px] font-nyt-sans text-gray-500">
            <button
              onClick={() => {
                setBottomTab('today');
                setCurrentScreen('home');
              }}
              className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
                bottomTab === 'today' && currentScreen === 'home'
                  ? 'text-black font-bold'
                  : 'hover:text-black'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Today</span>
            </button>

            <button
              onClick={() => {
                setBottomTab('audio');
                setCurrentScreen('home');
              }}
              className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
                bottomTab === 'audio' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Audio</span>
            </button>

            <button
              onClick={() => {
                setBottomTab('games');
                setCurrentScreen('home');
              }}
              className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
                bottomTab === 'games' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Games</span>
            </button>

            <button
              onClick={() => {
                setBottomTab('cooking');
                setCurrentScreen('home');
              }}
              className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
                bottomTab === 'cooking' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Cooking</span>
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex flex-col items-center gap-0.5 p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          </nav>
        )}

        {/* Mobile Footer */}
        <footer
          className="border-t-2 border-black bg-white px-4 py-6 text-center text-gray-500 font-nyt-sans mt-auto"
          data-purpose="nyt-mobile-footer"
        >
          <div
            onClick={() => {
              setCurrentScreen('home');
              setBottomTab('today');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-black text-black mb-3 cursor-pointer select-none font-masthead"
            style={{ fontFamily: "'UnifrakturMaguntia', 'Chomsky', Georgia, serif" }}
          >
            The New York Times
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-700 font-medium mb-4">
            {['Home', 'U.S.', 'World', 'Business', 'Opinion', 'Tech', 'Games', 'Cooking'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Home') {
                      setCurrentScreen('home');
                      setBottomTab('today');
                    } else if (item === 'Games') {
                      setBottomTab('games');
                    } else if (item === 'Cooking') {
                      setBottomTab('cooking');
                    } else {
                      setActiveSection(item);
                      setIsNavOpen(true);
                    }
                  }}
                  className="hover:underline cursor-pointer"
                >
                  {item}
                </button>
              )
            )}
          </nav>

          <div className="text-[10px] text-gray-400 space-y-1">
            <p>© 2026 The New York Times Company</p>
            <div className="flex justify-center space-x-2">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Help</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Slide-out Drawers & Modals */}
      <NavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        articles={ARTICLES}
        onSelectArticle={handleSelectArticle}
        onSelectSection={(section) => {
          setActiveSection(section);
          showToast(`Viewing ${section}`);
        }}
        activeSection={activeSection}
      />

      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        articleTitle={commentsArticle.title}
        comments={commentsData[commentsArticleId] || []}
        onAddComment={handleAddComment}
        onRecommendComment={handleRecommendComment}
      />

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSuccess={() => {
          setPreferences((prev) => ({ ...prev, isSubscribed: true }));
          showToast('Welcome to The New York Times Digital Access!', 'success');
        }}
        isSubscribed={preferences.isSubscribed}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        preferences={preferences}
        onUpdatePreferences={(updated) => setPreferences((prev) => ({ ...prev, ...updated }))}
        savedArticles={savedArticlesList}
        onSelectArticle={handleSelectArticle}
        onRemoveSaved={handleToggleSave}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
      />

      <GiftArticleModal
        isOpen={isGiftOpen}
        onClose={() => setIsGiftOpen(false)}
        article={giftArticle}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} type={toastType} />
    </div>
  );
}
