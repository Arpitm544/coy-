import Image from 'next/image';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Profile } from '@/lib/db';

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export default function MatchModal({ matchedProfile, onClose, onViewMatches }: MatchModalProps) {
  return (
    <Dialog open={!!matchedProfile} onClose={onClose} className="overlay bg-black/40">
      <DialogPanel className="w-full max-w-[320px] bg-shell rounded-card shadow-2xl p-6 flex flex-col items-center text-center">
        {matchedProfile && (
          <>
            <span className="font-bold text-[22px] text-ink mb-3">coy</span>
            <div className="relative w-[120px] h-[150px] rounded-[16px] overflow-hidden bg-photo border-2 border-white shadow-sm mb-3">
              <Image src={matchedProfile.photo} alt={matchedProfile.name} fill className="object-cover" sizes="120px" />
            </div>
            <h2 className="text-[26px] font-bold text-ink">It&apos;s a match!</h2>
            <p className="text-[13px] text-muted mt-1">
              You and {matchedProfile.name} liked each other.
            </p>
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full h-[46px] rounded-[14px] bg-plum text-white text-[14px] font-semibold mt-4 cursor-pointer"
            >
              View matches
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[12px] font-medium text-ink mt-3 hover:underline cursor-pointer"
            >
              Keep discovering
            </button>
          </>
        )}
      </DialogPanel>
    </Dialog>
  );
}
