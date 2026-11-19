import Image from 'next/image';
import { Profile } from '@/lib/db';

type Match = Profile & { matchedAt: number };

interface MatchesTabProps {
  matches: Match[];
  onSelect: (match: Match) => void;
  onGoToDiscover: () => void;
}

export default function MatchesTab({ matches, onSelect, onGoToDiscover }: MatchesTabProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-4 overflow-y-auto">
      <span className="logo">coy</span>
      <h1 className="title mt-3">Matches</h1>
      <p className="text-[13px] text-muted">The feeling is mutual.</p>

      <div className="flex-1 mt-5 space-y-3">
        {matches.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <p className="text-[15px] font-semibold text-ink">No mutual matches yet</p>
            <p className="text-[12px] text-muted mt-1">Swipe right on Discover to match.</p>
            <button
              type="button"
              onClick={onGoToDiscover}
              className="mt-4 px-4 py-2 rounded-full bg-plum text-white text-xs font-medium cursor-pointer"
            >
              Go to Discover
            </button>
          </div>
        ) : (
          matches.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelect(m)}
              className="surface rounded-[16px] p-3 flex items-center gap-3 shadow-xs cursor-pointer hover:border-plum/40 active:scale-[0.99] transition"
            >
              <div className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden bg-photo flex-shrink-0">
                <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="60px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-ink truncate">
                  {m.name}, {m.age}
                </h3>
                <p className="text-[12px] text-muted truncate">
                  {m.location.split('·')[0].trim()} · {m.interests[0] || 'Member'}
                </p>
              </div>
              <span className="text-muted text-lg pr-1">›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
