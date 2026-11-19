'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Profile, SwipeAction } from '@/lib/db';
import HomeTab from '@/components/HomeTab';
import DiscoverTab from '@/components/DiscoverTab';
import MatchesTab from '@/components/MatchesTab';
import TabBar from '@/components/TabBar';
import MatchModal from '@/components/MatchModal';
import ProfileModal from '@/components/ProfileModal';

type Match = Profile & { matchedAt: number };

export default function CoyApp() {
  const [tab, setTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Match | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const [dragX, setDragX] = useState<number>(0);

  const loadData = async () => {
    try {
      const [feedRes, matchRes] = await Promise.all([
        axios.get('/api/feed').then((r) => r.data),
        axios.get('/api/matches').then((r) => r.data),
      ]);
      setError(null);
      if (feedRes.success) setProfiles(feedRes.profiles);
      if (matchRes.success) setMatches(matchRes.matches);
    } catch {
      setError('Could not load profiles. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const handleSwipe = async (action: SwipeAction) => {
    if (profiles.length === 0 || isSwiping) return;
    const current = profiles[0];
    setIsSwiping(true);
    setError(null);

    setProfiles((prev) => prev.slice(1));
    setDragX(0);

    try {
      const { data } = await axios.post('/api/swipe', { profileId: current.id, action });

      if (data.match && data.matchedProfile) {
        setMatchedProfile(data.matchedProfile);
        setMatches((prev) => [
          { ...data.matchedProfile, matchedAt: Date.now() },
          ...prev.filter((m) => m.id !== data.matchedProfile.id),
        ]);
      }
    } catch {
      setError('Lost connection while swiping. Your card may not have been saved.');
    } finally {
      setIsSwiping(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await axios.post('/api/reset');
      await loadData();
    } catch {
      setError('Could not reset profiles. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center sm:p-4">
      <div className="w-full sm:max-w-[390px] h-screen sm:h-[844px] bg-shell sm:rounded-phone sm:shadow-lg sm:border sm:border-line flex flex-col justify-between overflow-hidden relative select-none">
        {tab === 'home' && <HomeTab />}

        {tab === 'discover' && (
          <DiscoverTab
            profiles={profiles}
            loading={loading}
            error={error}
            isSwiping={isSwiping}
            dragX={dragX}
            setDragX={setDragX}
            onSwipe={handleSwipe}
            onReset={handleReset}
          />
        )}

        {tab === 'matches' && (
          <MatchesTab
            matches={matches}
            onSelect={setSelectedProfile}
            onGoToDiscover={() => setTab('discover')}
          />
        )}

        <TabBar
          tab={tab}
          matchCount={matches.length}
          onChange={(nextTab) => {
            setTab(nextTab);
            if (nextTab === 'matches') loadData();
          }}
        />

        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onViewMatches={() => {
            setMatchedProfile(null);
            setTab('matches');
          }}
        />

        <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      </div>
    </main>
  );
}
