import React from 'react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  onOpenSubscribe: () => void;
  onReturnHome: () => void;
  isSubscribed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenProfile,
  onOpenSubscribe,
  onReturnHome,
  isSubscribed = false,
}) => {
  return (
    <header className="w-full bg-white sticky top-0 z-30 transition-shadow duration-200" data-purpose="nyt-main-header">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2.5">
        {/* Hamburger Menu Button */}
        <button
          aria-label="Open Navigation Menu"
          onClick={onOpenMenu}
          className="p-1 -ml-1 text-black focus:outline-none hover:opacity-75 cursor-pointer active:scale-95 transition-transform"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <line x1="3" x2="21" y1="6" y2="6"></line>
            <line x1="3" x2="21" y1="12" y2="12"></line>
            <line x1="3" x2="21" y1="18" y2="18"></line>
          </svg>
        </button>

        {/* Centered Masthead Logo */}
        <div className="flex-1 text-center px-1">
          <button
            onClick={onReturnHome}
            className="inline-block cursor-pointer focus:outline-none"
            aria-label="The New York Times Home"
          >
            <h1
              className="text-[25px] sm:text-[27px] tracking-tight font-black leading-none text-black select-none font-masthead"
              style={{
                fontFamily: "'UnifrakturMaguntia', 'Chomsky', 'Playfair Display', Georgia, serif",
                letterSpacing: '-0.01em',
              }}
            >
              The New York Times
            </h1>
          </button>
        </div>

        {/* Account Profile Icon */}
        <button
          aria-label="User Account"
          onClick={onOpenProfile}
          className="p-1 -mr-1 text-black focus:outline-none hover:opacity-75 cursor-pointer active:scale-95 transition-transform relative"
          type="button"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
          {isSubscribed && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#326891] rounded-full ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* Hairline divider */}
      <div className="h-[1px] bg-[#e2e2e2] w-full"></div>

      {/* Date & Subscription Action Banner */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white text-[12px]">
        <div className="font-bold text-gray-900 tracking-tight text-[11px] font-nyt-sans">
          Wednesday, October 14, 2026
        </div>
        {isSubscribed ? (
          <span className="inline-block px-2.5 py-0.5 border border-gray-300 rounded text-[10.5px] font-semibold text-gray-600 tracking-tight bg-gray-50 font-nyt-sans">
            Subscriber Edition
          </span>
        ) : (
          <button
            onClick={onOpenSubscribe}
            className="inline-block px-3 py-1 border border-black rounded text-[11px] font-semibold text-black tracking-tight hover:bg-black hover:text-white transition-colors duration-150 cursor-pointer active:scale-95 font-nyt-sans"
          >
            Subscribe for $1/week
          </button>
        )}
      </div>

      {/* Hairline divider bottom */}
      <div className="h-[1px] bg-[#e2e2e2] w-full"></div>
    </header>
  );
};
