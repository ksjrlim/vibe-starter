import React from 'react';
import { ArrowLeft, Bookmark, Share2, MessageSquare, Type } from 'lucide-react';
import { Article } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onOpenComments: (articleId: string) => void;
  onToggleSave: (articleId: string) => void;
  isSaved: boolean;
  onShare: (article: Article) => void;
  onSelectArticle: (articleId: string) => void;
  relatedArticles: Article[];
  fontSize: 'standard' | 'medium' | 'large';
  onChangeFontSize: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onOpenComments,
  onToggleSave,
  isSaved,
  onShare,
  onSelectArticle,
  relatedArticles,
  fontSize,
  onChangeFontSize,
}) => {
  // Font scale mappings
  const headlineClass =
    fontSize === 'large'
      ? 'text-[32px] sm:text-[36px]'
      : fontSize === 'medium'
      ? 'text-[28px] sm:text-[32px]'
      : 'text-[26px] sm:text-[30px]';

  const bodyClass =
    fontSize === 'large'
      ? 'text-[18px] leading-[1.85]'
      : fontSize === 'medium'
      ? 'text-[16px] leading-[1.8]'
      : 'text-[15px] leading-[1.75]';

  return (
    <div className="w-full bg-white min-h-screen pb-16 animate-fadeIn">
      {/* Sticky Article Reader Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#e2e2e2] px-3.5 py-2.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-black hover:text-gray-600 transition-colors cursor-pointer group"
          aria-label="Back to front page"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[12px] font-bold font-nyt-sans">Front Page</span>
        </button>

        {/* Small NYT logo */}
        <span
          onClick={onBack}
          className="font-masthead text-[18px] cursor-pointer tracking-tight"
          style={{ fontFamily: "'UnifrakturMaguntia', 'Chomsky', Georgia, serif" }}
        >
          The New York Times
        </span>

        {/* Reader utilities */}
        <div className="flex items-center gap-1">
          <button
            onClick={onChangeFontSize}
            title={`Font size: ${fontSize}. Click to adjust.`}
            className="p-1.5 text-gray-700 hover:text-black rounded transition-colors cursor-pointer flex items-center"
          >
            <Type className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold ml-0.5">{fontSize[0]}</span>
          </button>

          <button
            onClick={() => onToggleSave(article.id)}
            title={isSaved ? 'Remove from Saved' : 'Save for later'}
            className="p-1.5 text-gray-700 hover:text-black rounded transition-colors cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black text-black' : ''}`} />
          </button>

          <button
            onClick={() => onShare(article)}
            title="Share article"
            className="p-1.5 text-gray-700 hover:text-black rounded transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Body Container */}
      <article className="px-4 pt-4 max-w-[680px] mx-auto">
        {/* Section kicker */}
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#727272] font-nyt-sans mb-2">
          {article.kicker || article.section}
        </div>

        {/* Main Headline */}
        <h1 className={`font-nyt-headline font-bold text-[#121212] headline-leading mb-3 ${headlineClass}`}>
          {article.title}
        </h1>

        {/* Deck / Summary */}
        {article.deck && (
          <p className="font-nyt-headline text-[16px] sm:text-[17px] text-[#444] summary-leading mb-3.5">
            {article.deck}
          </p>
        )}

        {/* Hairline Divider */}
        <div className="h-[1px] bg-[#e2e2e2] w-full my-3"></div>

        {/* Byline & Timestamp */}
        <div className="mb-4">
          <div className="text-[12px] font-bold text-[#121212] font-nyt-sans">
            {article.byline}
          </div>
          <div className="text-[11px] text-[#727272] font-nyt-sans mt-0.5 flex items-center gap-1.5">
            <span>{article.publishedAt}</span>
            {article.updatedAt && (
              <>
                <span>•</span>
                <span>{article.updatedAt}</span>
              </>
            )}
            <span>•</span>
            <span className="font-semibold uppercase tracking-wider">{article.readTime}</span>
          </div>
        </div>

        {/* Audio Narration Bar */}
        <AudioPlayer title={article.title} paragraphs={article.content} />

        {/* Lead Image (hotlinked as per request with fallback) */}
        {article.imageUrl && (
          <figure className="my-5 -mx-4 sm:mx-0 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.imageCaption || article.title}
              className="w-full h-auto object-cover max-h-[460px] bg-[#eef0f2]"
              onError={(e) => {
                // Keep resilient if external link changes
                e.currentTarget.src = 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg';
              }}
            />
            {article.imageCaption && (
              <figcaption className="px-4 sm:px-0 pt-2 text-[11px] text-[#666] font-nyt-sans leading-tight">
                {article.imageCaption}{' '}
                {article.imageCredit && (
                  <span className="text-[#888] font-medium">— {article.imageCredit}</span>
                )}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Content Paragraphs with Dropcap */}
        <div className={`text-[#222] font-nyt-body space-y-4 mb-8 ${bodyClass}`}>
          {article.content.map((paragraph, index) => {
            if (index === 0) {
              return (
                <p
                  key={index}
                  className="first-letter:text-[48px] first-letter:font-bold first-letter:font-nyt-headline first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-black"
                >
                  {paragraph}
                </p>
              );
            }

            // Insert Pull Quote after paragraph 2 if available
            if (index === 2 && article.pullQuote) {
              return (
                <React.Fragment key={index}>
                  <p>{paragraph}</p>
                  <blockquote className="my-6 py-4 px-3 border-y border-[#dfdfdf] text-center">
                    <p className="font-nyt-headline italic text-[18px] sm:text-[20px] text-[#121212] leading-snug">
                      "{article.pullQuote.text}"
                    </p>
                    {article.pullQuote.attribution && (
                      <cite className="block text-[11px] uppercase tracking-wider text-[#727272] font-nyt-sans not-italic mt-2">
                        — {article.pullQuote.attribution}
                      </cite>
                    )}
                  </blockquote>
                </React.Fragment>
              );
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Bullets if dispatches */}
        {article.bullets && article.bullets.length > 0 && (
          <div className="bg-[#fbfbfb] border border-[#e2e2e2] rounded p-4 my-6">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#121212] font-nyt-sans mb-2">
              Key Midterm Notes
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-[13.5px] text-[#333] font-nyt-sans">
              {article.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Hairline Divider */}
        <div className="h-[1px] bg-[#e2e2e2] w-full my-6"></div>

        {/* Comments CTA Bar */}
        <div className="bg-[#fafafa] border border-[#e2e2e2] rounded p-3.5 flex items-center justify-between my-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <div>
              <div className="text-[12px] font-bold text-black font-nyt-sans">
                Reader Discussion ({article.commentsCount ?? 0})
              </div>
              <div className="text-[11px] text-gray-500 font-nyt-sans">
                Read perspectives or share your response
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenComments(article.id)}
            className="px-3 py-1.5 bg-black text-white rounded text-[11px] font-semibold tracking-tight hover:bg-gray-800 transition-colors cursor-pointer active:scale-95 font-nyt-sans"
          >
            View Comments
          </button>
        </div>

        {/* Read Next / Related Stories */}
        {relatedArticles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#e2e2e2]">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#727272] font-nyt-sans mb-3">
              More from The Times
            </h3>
            <div className="space-y-4">
              {relatedArticles.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel.id)}
                  className="group cursor-pointer border-b border-[#f0f0f0] pb-3"
                >
                  <h4 className="font-nyt-headline font-bold text-[16px] text-[#121212] group-hover:text-gray-600 transition-colors">
                    {rel.title}
                  </h4>
                  {rel.deck && (
                    <p className="font-nyt-headline text-[13px] text-[#666] line-clamp-1 mt-0.5">
                      {rel.deck}
                    </p>
                  )}
                  <span className="text-[10px] font-bold uppercase text-[#888] font-nyt-sans mt-1 inline-block">
                    {rel.readTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to top button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[11px] uppercase tracking-wider font-bold text-[#326891] hover:underline font-nyt-sans cursor-pointer"
          >
            ↑ Back to Top
          </button>
        </div>
      </article>
    </div>
  );
};
