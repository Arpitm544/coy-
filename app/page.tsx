'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Profile, SwipeAction } from '@/lib/db';

export default function CoyApp() {
  const [tab, setTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Array<Profile & { matchedAt: number }>>([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // 1. Fetch data from APIs
  const loadData = async () => {
    const [feedRes, matchRes] = await Promise.all([
      fetch('/api/feed').then((r) => r.json()),
      fetch('/api/matches').then((r) => r.json()),
    ]);
    if (feedRes.success) setProfiles(feedRes.profiles);
    if (matchRes.success) setMatches(matchRes.matches);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Like or Pass
  const handleSwipe = async (action: SwipeAction) => {
    if (profiles.length === 0) return;
    const current = profiles[0];

    // Remove top card immediately
    setProfiles((prev) => prev.slice(1));

    const res = await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: current.id, action }),
    });
    const data = await res.json();

    // Mutual match -> show popup & add to matches
    if (data.success && data.match && data.matchedProfile) {
      setMatchedProfile(data.matchedProfile);
      setMatches((prev) => [
        { ...data.matchedProfile, matchedAt: Date.now() },
        ...prev.filter((m) => m.id !== data.matchedProfile.id),
      ]);
    }
  };

  const currentProfile = profiles[0];

  return (
    <main className="min-h-screen bg-[#f3eeea] flex items-center justify-center sm:p-4">
      {/* Mobile container */}
      <div className="w-full sm:max-w-[390px] h-screen sm:h-[844px] bg-[#fbf8f5] sm:rounded-[36px] sm:shadow-lg sm:border sm:border-[#e9e2df] flex flex-col justify-between overflow-hidden relative select-none">
        
        {/* ==================== 1. HOME TAB ==================== */}
        {tab === 'home' && (
          <div className="flex-1 flex flex-col px-6 pt-10">
            <span className="font-bold text-[29px] text-[#5d395b]">coy</span>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-3xl text-[#8e8990] mb-2">⌂</span>
              <p className="text-[16px] font-semibold text-[#27252b]">Home</p>
              <p className="text-[13px] text-[#8e8990] mt-1 max-w-[220px]">
                Kept blank per assignment instructions.
              </p>
            </div>
          </div>
        )}

        {/* ==================== 2. DISCOVER TAB ==================== */}
        {tab === 'discover' && (
          <div className="flex-1 flex flex-col justify-between px-6 pt-10 pb-4 overflow-hidden">
            <div>
              <span className="font-bold text-[29px] text-[#5d395b]">coy</span>
              <div className="flex items-center justify-between mt-3">
                <h1 className="text-[28px] font-bold text-[#27252b]">Discover</h1>
                {currentProfile && (
                  <span className="bg-white border border-[#e9e2df] px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#5d395b]">
                    {33 - profiles.length} of 32
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#8e8990]">
                Good connections start with a little curiosity.
              </p>
            </div>

            {/* Profile Card or Empty state */}
            {currentProfile ? (
              <div className="my-auto py-2">
                <ProfileCard profile={currentProfile} />
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center text-center py-6">
                <div className="w-20 h-20 rounded-full bg-[#f4ece7] flex items-center justify-center text-[#5d395b] text-3xl mb-3">
                  ♡
                </div>
                <h2 className="text-[20px] font-bold text-[#27252b]">You&apos;re all caught up</h2>
                <p className="text-[13px] text-[#8e8990] mt-1 max-w-[240px]">
                  You&apos;ve seen everyone for now.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/reset', { method: 'POST' });
                    loadData();
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-[#5d395b] text-white text-xs font-medium cursor-pointer"
                >
                  ↺ Reset Profiles
                </button>
              </div>
            )}

            {/* Buttons: Pass & Like */}
            {currentProfile && (
              <div className="flex items-center justify-center gap-10 py-1">
                <button
                  type="button"
                  onClick={() => handleSwipe('pass')}
                  className="w-[70px] h-[70px] rounded-full bg-white border border-[#e9e2df] shadow-sm flex items-center justify-center text-[#5d395b] text-[34px] active:scale-95 transition cursor-pointer"
                  aria-label="Pass"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => handleSwipe('like')}
                  className="w-[70px] h-[70px] rounded-full bg-[#5d395b] text-white shadow-md flex items-center justify-center text-[28px] active:scale-95 transition cursor-pointer"
                  aria-label="Like"
                >
                  ♥
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. MATCHES TAB ==================== */}
        {tab === 'matches' && (
          <div className="flex-1 flex flex-col px-6 pt-10 pb-4 overflow-y-auto">
            <span className="font-bold text-[29px] text-[#5d395b]">coy</span>
            <h1 className="text-[28px] font-bold text-[#27252b] mt-3">Matches</h1>
            <p className="text-[13px] text-[#8e8990]">The feeling is mutual.</p>

            <div className="flex-1 mt-5 space-y-3">
              {matches.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <p className="text-[15px] font-semibold text-[#27252b]">No mutual matches yet</p>
                  <p className="text-[12px] text-[#8e8990] mt-1">
                    Like profiles on Discover to match.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('discover')}
                    className="mt-4 px-4 py-2 rounded-full bg-[#5d395b] text-white text-xs font-medium cursor-pointer"
                  >
                    Go to Discover
                  </button>
                </div>
              ) : (
                matches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedProfile(m)}
                    className="bg-white border border-[#e9e2df] rounded-[16px] p-3 flex items-center gap-3 shadow-xs cursor-pointer hover:border-[#5d395b]/40 active:scale-[0.99] transition"
                  >
                    <div className="relative w-[60px] h-[60px] rounded-[12px] overflow-hidden bg-[#e8e5e3] flex-shrink-0">
                      <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="60px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#27252b] truncate">
                        {m.name}, {m.age}
                      </h3>
                      <p className="text-[12px] text-[#8e8990] truncate">
                        {m.location.split('·')[0].trim()} · {m.interests[0] || 'Member'}
                      </p>
                    </div>
                    <span className="text-[#8e8990] text-lg pr-1">›</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== BOTTOM TAB BAR ==================== */}
        <nav className="w-full bg-white border-t border-[#e9e2df] h-[72px] flex items-center justify-around px-4 select-none flex-shrink-0">
          <button
            type="button"
            onClick={() => setTab('home')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
              tab === 'home' ? 'text-[#5d395b]' : 'text-[#8e8990]'
            }`}
          >
            <span className="text-[20px] leading-none">⌂</span>
            <span className="text-[11px] mt-1 font-medium">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('discover')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
              tab === 'discover' ? 'text-[#5d395b]' : 'text-[#8e8990]'
            }`}
          >
            <span className="text-[18px] leading-none">{tab === 'discover' ? '♥' : '♡'}</span>
            <span className="text-[11px] mt-1 font-medium">Discover</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('matches');
              loadData();
            }}
            className={`relative flex flex-col items-center justify-center py-1 cursor-pointer ${
              tab === 'matches' ? 'text-[#5d395b]' : 'text-[#8e8990]'
            }`}
          >
            <div className="relative">
              <span className="text-[16px] leading-none">✦</span>
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#5d395b] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 font-medium">Matches</span>
          </button>
        </nav>

        {/* ==================== 4. MUTUAL MATCH CELEBRATION ==================== */}
        {matchedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="w-full max-w-[320px] bg-[#fbf8f5] rounded-[24px] shadow-2xl p-6 flex flex-col items-center text-center">
              <span className="font-bold text-[22px] text-[#27252b] mb-3">coy</span>
              <div className="relative w-[120px] h-[150px] rounded-[16px] overflow-hidden bg-[#e8e5e3] border-2 border-white shadow-sm mb-3">
                <Image src={matchedProfile.photo} alt={matchedProfile.name} fill className="object-cover" sizes="120px" />
              </div>
              <h2 className="text-[26px] font-bold text-[#27252b]">It&apos;s a match!</h2>
              <p className="text-[13px] text-[#777277] mt-1">
                You and {matchedProfile.name} liked each other.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMatchedProfile(null);
                  setTab('matches');
                }}
                className="w-full h-[46px] rounded-[14px] bg-[#5d395b] text-white text-[14px] font-semibold mt-4 cursor-pointer"
              >
                View matches
              </button>
              <button
                type="button"
                onClick={() => setMatchedProfile(null)}
                className="text-[12px] font-medium text-[#27252b] mt-3 hover:underline cursor-pointer"
              >
                Keep discovering
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. PROFILE DETAIL MODAL (WHEN MATCH CLICKED) ==================== */}
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-[340px] bg-white border border-[#e9e2df] rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative">
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
              <ProfileCard profile={selectedProfile} />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// Simple Reusable Profile Card (Used by both Discover & Matches Detail!)
function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="w-full bg-white border border-[#e9e2df] rounded-[24px] overflow-hidden shadow-sm flex flex-col select-none">
      <div className="relative w-full h-[260px] bg-[#e8e5e3]">
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          className="object-cover"
          sizes="342px"
          priority
        />
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-[22px] font-bold text-[#27252b]">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-[12px] text-[#8e8990] mt-0.5">{profile.location}</p>
          <p className="text-[13px] text-[#27252b] mt-2 line-clamp-2">{profile.bio}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.map((t) => (
            <span
              key={t}
              className="bg-[#fbf8f5] border border-[#e9e2df] text-[#5d395b] text-[11px] font-medium px-2.5 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
