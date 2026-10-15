import React from 'react';

interface OpinionStripProps {
  onSelectOpinion: (title: string) => void;
}

export const OpinionStrip: React.FC<OpinionStripProps> = ({ onSelectOpinion }) => {
  const columnists = [
    {
      author: 'David Brooks',
      role: 'Contributing Opinion Writer',
      headline: 'The Quiet Structural Exodus Transforming Modern Governance',
      initials: 'DB',
    },
    {
      author: 'Maureen Dowd',
      role: 'Opinion Columnist',
      headline: 'Who Is Left to Say No in the West Wing?',
      initials: 'MD',
    },
    {
      author: 'Thomas L. Friedman',
      role: 'Foreign Affairs Columnist',
      headline: 'Europe Cannot Outsource Its Telemetry Defense to Billionaires',
      initials: 'TF',
    },
    {
      author: 'Michelle Goldberg',
      role: 'Opinion Columnist',
      headline: 'The Uncomfortable Truth Behind Midterm Ad Blitzes',
      initials: 'MG',
    },
  ];

  return (
    <div className="border-t-2 border-black pt-3.5 my-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-nyt-headline font-bold text-[18px] text-black">
          Opinion Columnists
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#326891] font-nyt-sans hover:underline cursor-pointer">
          All Columnists →
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {columnists.map((col, idx) => (
          <div
            key={idx}
            onClick={() => onSelectOpinion(col.headline)}
            className="p-3 bg-[#fafafa] border border-[#e5e5e5] rounded hover:border-black transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-black text-white font-serif font-bold text-[10px] flex items-center justify-center shrink-0">
                {col.initials}
              </div>
              <div>
                <span className="font-bold text-[11.5px] text-black font-nyt-sans block leading-none">
                  {col.author}
                </span>
                <span className="text-[9.5px] text-gray-500 font-nyt-sans">
                  {col.role}
                </span>
              </div>
            </div>

            <h4 className="font-nyt-headline font-bold text-[14.5px] text-[#121212] leading-snug group-hover:text-gray-600 transition-colors">
              "{col.headline}"
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};
