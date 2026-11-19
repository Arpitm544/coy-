import { Dialog, DialogPanel } from '@headlessui/react';
import { Profile } from '@/lib/db';
import ProfileCard from './ProfileCard';

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
}

export default function ProfileModal({ profile, onClose }: ProfileModalProps) {
  return (
    <Dialog open={!!profile} onClose={onClose} className="overlay bg-black/50">
      <DialogPanel className="w-full max-w-[340px] surface rounded-card overflow-hidden shadow-2xl flex flex-col relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>
        {profile && <ProfileCard profile={profile} />}
      </DialogPanel>
    </Dialog>
  );
}
