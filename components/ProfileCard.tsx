import Image from 'next/image';
import { Profile } from '@/lib/db';

export default function ProfileCard({ profile, dragX = 0 }: { profile: Profile; dragX?: number }) {
  return (
    <div className="w-full surface rounded-card overflow-hidden shadow-sm flex flex-col select-none">
      <div className="relative w-full h-[260px] bg-photo">
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          className="object-cover pointer-events-none"
          sizes="342px"
          priority
        />
        {dragX > 30 && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow">
            LIKE
          </div>
        )}
        {dragX < -30 && (
          <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow">
            PASS
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-ink">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-[12px] text-muted mt-0.5">{profile.location}</p>
          <p className="text-[13px] text-ink mt-2 line-clamp-2">{profile.bio}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.map((t) => (
            <span
              key={t}
              className="bg-shell border border-line text-plum text-[11px] font-medium px-2.5 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
