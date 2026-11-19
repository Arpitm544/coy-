type Tab = 'home' | 'discover' | 'matches';

interface TabBarProps {
  tab: Tab;
  matchCount: number;
  onChange: (tab: Tab) => void;
}

export default function TabBar({ tab, matchCount, onChange }: TabBarProps) {
  return (
    <nav className="w-full bg-white border-t border-line h-[72px] flex items-center justify-around px-4 select-none flex-shrink-0">
      <button
        type="button"
        onClick={() => onChange('home')}
        className={`tab-btn ${tab === 'home' ? 'text-plum' : 'text-muted'}`}
      >
        <span className="text-[20px] leading-none">⌂</span>
        <span className="text-[11px] mt-1 font-medium">Home</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('discover')}
        className={`tab-btn ${tab === 'discover' ? 'text-plum' : 'text-muted'}`}
      >
        <span className="text-[18px] leading-none">{tab === 'discover' ? '♥' : '♡'}</span>
        <span className="text-[11px] mt-1 font-medium">Discover</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('matches')}
        className={`relative tab-btn ${tab === 'matches' ? 'text-plum' : 'text-muted'}`}
      >
        <div className="relative">
          <span className="text-[16px] leading-none">✦</span>
          {matchCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-plum text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {matchCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-1 font-medium">Matches</span>
      </button>
    </nav>
  );
}
