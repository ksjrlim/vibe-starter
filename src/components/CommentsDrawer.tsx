import React, { useState } from 'react';
import { X, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { Comment } from '../types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp' | 'recommendations'>) => void;
  onRecommendComment: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  articleTitle,
  comments,
  onAddComment,
  onRecommendComment,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'picks' | 'recommended'>('all');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRecommended, setHasRecommended] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleRecommend = (id: string) => {
    if (hasRecommended[id]) return;
    setHasRecommended((prev) => ({ ...prev, [id]: true }));
    onRecommendComment(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddComment({
        author: author.trim(),
        location: location.trim() || 'Reader',
        content: content.trim(),
      });
      setContent('');
      setIsSubmitting(false);
    }, 200);
  };

  const filteredComments = [...comments].filter((c) => {
    if (activeTab === 'picks') return c.isNYTPick;
    return true;
  }).sort((a, b) => {
    if (activeTab === 'recommended') {
      return b.recommendations - a.recommendations;
    }
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer content */}
      <div className="w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e2e2] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#326891] font-nyt-sans">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reader Discussion</span>
            </div>
            <h3 className="font-nyt-headline font-bold text-[16px] text-black leading-snug line-clamp-1 mt-0.5">
              {articleTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#e2e2e2] bg-[#fbfbfb] px-4 text-[12px] font-nyt-sans shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('picks')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'picks'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Award className="w-3 h-3 text-[#326891]" />
            NYT Picks ({comments.filter((c) => c.isNYTPick).length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'recommended'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Reader Picks
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-[#f0f0f0]">
          {filteredComments.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-[13px] font-nyt-sans">
              No comments match this filter yet. Be the first to share your perspective!
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className="pt-3.5 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-bold text-[13px] text-black font-nyt-sans">
                      {comment.author}
                    </span>
                    <span className="text-[11px] text-gray-500 font-nyt-sans">
                      {comment.location}
                    </span>
                    <span className="text-[10px] text-gray-400 font-nyt-sans">
                      · {comment.timestamp}
                    </span>
                  </div>
                  {comment.isNYTPick && (
                    <span className="text-[10px] font-bold text-[#326891] bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider font-nyt-sans flex items-center gap-0.5">
                      <Award className="w-2.5 h-2.5" />
                      NYT Pick
                    </span>
                  )}
                </div>

                <p className="font-nyt-body text-[14px] text-[#222] leading-relaxed my-2">
                  {comment.content}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleRecommend(comment.id)}
                    className={`flex items-center gap-1.5 text-[11px] font-nyt-sans transition-colors cursor-pointer ${
                      hasRecommended[comment.id]
                        ? 'text-[#326891] font-bold'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasRecommended[comment.id] ? 'fill-current' : ''}`} />
                    <span>Recommend ({comment.recommendations})</span>
                  </button>

                  <span className="text-[10px] text-gray-400 font-nyt-sans">
                    Flag as inappropriate
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-4 border-t border-[#e2e2e2] bg-[#fafafa] shrink-0">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-black font-nyt-sans mb-2">
            Share Your Thoughts
          </h4>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Name (Required)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:border-black font-nyt-sans"
              />
              <input
                type="text"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:border-black font-nyt-sans"
              />
            </div>
            <textarea
              placeholder="What are your thoughts on this story? (Comments are moderated)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-[12px] focus:outline-none focus:border-black font-nyt-sans resize-none"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-gray-500 font-nyt-sans">
                Follows NYT Community Guidelines
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || !author.trim()}
                className="px-4 py-1.5 bg-black text-white text-[11px] font-semibold rounded hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer font-nyt-sans"
              >
                {isSubmitting ? 'Posting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
