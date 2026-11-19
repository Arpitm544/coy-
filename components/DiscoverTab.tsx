import { motion, type PanInfo } from 'framer-motion';
import { Profile, SwipeAction } from '@/lib/db';
import ProfileCard from './ProfileCard';

const SWIPE_THRESHOLD = 70;

interface DiscoverTabProps {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  isSwiping: boolean;
  dragX: number;
  setDragX: (x: number) => void;
  onSwipe: (action: SwipeAction) => void;
  onReset: () => void;
}

export default function DiscoverTab({
  profiles,
  loading,
  error,
  isSwiping,
  dragX,
  setDragX,
  onSwipe,
  onReset,
}: DiscoverTabProps) {
  const currentProfile = profiles[0];

  const onDrag = (_e: unknown, info: PanInfo) => setDragX(info.offset.x);
  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe('like');
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('pass');
    setDragX(0);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 pt-10 pb-4 overflow-hidden">
      <div>
        <span className="logo">coy</span>
        <div className="flex items-center justify-between mt-3">
          <h1 className="title">Discover</h1>
          {currentProfile && (
            <span className="surface px-3 py-0.5 rounded-full text-[11px] font-semibold text-plum">
              {33 - profiles.length} of 32
            </span>
          )}
        </div>
        <p className="text-[13px] text-muted">
          Good connections start with a little curiosity.
        </p>
        {error && (
          <p className="text-[12px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mt-2">
            {error}
          </p>
        )}
      </div>

      {loading ? (
        <div className="my-auto flex flex-col items-center text-center py-6">
          <p className="text-[13px] text-muted">Loading profiles…</p>
        </div>
      ) : currentProfile ? (
        <div className="my-auto py-2">
          <motion.div
            drag={isSwiping ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            dragSnapToOrigin
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            animate={{ rotate: dragX * 0.05 }}
            transition={{ rotate: { duration: 0 } }}
            className="cursor-grab active:cursor-grabbing relative"
          >
            <ProfileCard profile={currentProfile} dragX={dragX} />
          </motion.div>
        </div>
      ) : (
        <div className="my-auto flex flex-col items-center text-center py-6">
          <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-plum text-3xl mb-3">
            ♡
          </div>
          <h2 className="text-[20px] font-bold text-ink">You&apos;re all caught up</h2>
          <p className="text-[13px] text-muted mt-1 max-w-[240px]">
            You&apos;ve seen everyone for now.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-4 px-5 py-2 rounded-full bg-plum text-white text-xs font-medium cursor-pointer"
          >
            ↺ Reset Profiles
          </button>
        </div>
      )}

      {currentProfile && (
        <div className="flex items-center justify-center gap-10 py-1">
          <button
            type="button"
            disabled={isSwiping}
            onClick={() => onSwipe('pass')}
            className="w-[70px] h-[70px] rounded-full surface shadow-sm flex items-center justify-center text-plum text-[34px] active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Pass"
          >
            ×
          </button>
          <button
            type="button"
            disabled={isSwiping}
            onClick={() => onSwipe('like')}
            className="w-[70px] h-[70px] rounded-full bg-plum text-white shadow-md flex items-center justify-center text-[28px] active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Like"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}
