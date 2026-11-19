import fs from 'fs';
import path from 'path';

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  hasLikedUser?: boolean; // Server-only: stripped in GET /api/feed!
}

export type SwipeAction = 'like' | 'pass';

export interface Swipe {
  profileId: string;
  action: SwipeAction;
  timestamp: number;
}

export interface Match {
  profileId: string;
  matchedAt: number;
}

export interface DbState {
  profiles: Profile[];
  swipes: Swipe[];
  matches: Match[];
}

// 32 Seed profiles: alternating so reviewers can test BOTH mutual likes AND one-sided likes!
export const SEED_PROFILES: Profile[] = [
  {
    id: 'p-1',
    name: 'Aanya',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Sunday bookstores, filter coffee, and finding the best live music in town.',
    location: 'Bengaluru · Christ University',
    interests: ['Live music', 'Coffee', 'Travel'],
    hasLikedUser: true, // ✅ Liked you! (Liking her creates a MUTUAL MATCH)
  },
  {
    id: 'p-2',
    name: 'Riya',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Architect in the making. Sketching at cafés and hunting for vintage finds.',
    location: 'Mumbai · NIFT',
    interests: ['Art & design', 'Architecture', 'Thrifting'],
    hasLikedUser: false, // ❌ Did not like you! (Liking her does NOT match)
  },
  {
    id: 'p-3',
    name: 'Kabir',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Finishing masters, playing indie gigs on Fridays, and baking sourdough.',
    location: 'Delhi · St. Stephen’s',
    interests: ['Indie rock', 'Cooking', 'Baking'],
    hasLikedUser: true, // ✅ Liked you! (MUTUAL MATCH)
  },
  {
    id: 'p-4',
    name: 'Meera',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Food writer with a weakness for street food, weekend treks, and sunset photography.',
    location: 'Pune · Symbiosis',
    interests: ['Food & travel', 'Photography', 'Hiking'],
    hasLikedUser: false, // ❌ Did not like you! (NO MATCH)
  },
  {
    id: 'p-5',
    name: 'Arjun',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Tech enthusiast by day, open micer by night. Ask me my worst joke.',
    location: 'Bengaluru · PES University',
    interests: ['Standup', 'Sci-fi', 'Badminton'],
    hasLikedUser: true, // ✅ Liked you! (MUTUAL MATCH)
  },
  {
    id: 'p-6',
    name: 'Tara',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Psychology student passionate about pottery, film cameras, and long road trips.',
    location: 'Delhi · LSR',
    interests: ['Film photo', 'Pottery', 'Road trips'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-7',
    name: 'Rohan',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Graphic designer who judges restaurants by their menu fonts.',
    location: 'Mumbai · IIT Bombay IDC',
    interests: ['Typography', 'Vinyl', 'Cycling'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-8',
    name: 'Diya',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    bio: 'Looking for someone who will wake up early to catch sunrise runs with me.',
    location: 'Hyderabad · BITS Pilani',
    interests: ['Running', 'Fitness', 'Meditation'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-9',
    name: 'Dev',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'UI designer who believes cold brews fix everything. Dog person 100%.',
    location: 'Bengaluru · IIIT',
    interests: ['Design systems', 'Dogs', 'Coffee'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-10',
    name: 'Ananya',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Literature major, museum hopper, and amateur baker obsessed with lemon tarts.',
    location: 'Kolkata · Jadavpur University',
    interests: ['Literature', 'Art history', 'Baking'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-11',
    name: 'Siddharth',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Data scientist who can never turn down a chess challenge or a board game evening.',
    location: 'Bengaluru · IISc',
    interests: ['Chess', 'Board games', 'Podcasts'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-12',
    name: 'Zoya',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Filmmaker and documentarian. Always looking for unseen stories.',
    location: 'Mumbai · FTII',
    interests: ['Cinema', 'Storytelling', 'Jazz'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-13',
    name: 'Neil',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    bio: 'Guitarist in a funk band. Teaching myself how to rollerblade without broken bones.',
    location: 'Goa · Goa University',
    interests: ['Funk music', 'Skating', 'Volleyball'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-14',
    name: 'Ishita',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Bioinformatics researcher. I love trivia nights, bouldering, and spicy ramen.',
    location: 'Chennai · IIT Madras',
    interests: ['Bouldering', 'Trivia', 'Cooking'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-15',
    name: 'Vivaan',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=800&q=80',
    bio: 'Outdoor educator. Ask me about camping spots within 3 hours of town.',
    location: 'Dehradun · FRI',
    interests: ['Camping', 'Stargazing', 'Trekking'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-16',
    name: 'Pooja',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    bio: 'Botanist and plant parent to 40+ succulents. Visiting plant nurseries on weekends.',
    location: 'Chandigarh · Panjab University',
    interests: ['Plants', 'Gardening', 'Botanicals'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-17',
    name: 'Samir',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
    bio: 'Financial analyst by day, tennis player on weekends.',
    location: 'Mumbai · NMIMS',
    interests: ['Tennis', 'Investing', 'Formula 1'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-18',
    name: 'Kavya',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion stylist with love for sustainable streetwear and vintage markets.',
    location: 'Delhi · Pearl Academy',
    interests: ['Fashion', 'Vintage', 'Art'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-19',
    name: 'Aman',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer building side projects. I rate cities by their public transit.',
    location: 'Bengaluru · RVCE',
    interests: ['Open source', 'Urban transit', 'Cycling'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-20',
    name: 'Tanvi',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&q=80',
    bio: 'Classical dancer exploring contemporary fusion.',
    location: 'Ahmedabad · NID',
    interests: ['Dance', 'Theater', 'Festivals'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-21',
    name: 'Aditya',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80',
    bio: 'Product manager who loves swimming laps and discussing movie twists.',
    location: 'Gurugram · Ashoka University',
    interests: ['Swimming', 'Cinema', 'Board games'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-22',
    name: 'Sneha',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80',
    bio: 'Journalist covering civic stories. Passionate about street photography.',
    location: 'Kolkata · Presidency University',
    interests: ['Journalism', 'Street photo', 'Tea'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-23',
    name: 'Varun',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Specialty coffee barista and home roaster.',
    location: 'Bengaluru · St. Joseph’s',
    interests: ['Specialty coffee', 'Roasting', 'Indie pop'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-24',
    name: 'Natasha',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Marine biology student. Always happier near water and coral reefs.',
    location: 'Kochi · CUSAT',
    interests: ['Scuba diving', 'Ocean conservation', 'Surfing'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-25',
    name: 'Harsh',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Law grad who prefers debates over coffee. Fan of vinyl and old books.',
    location: 'Delhi · NLUD',
    interests: ['Law & policy', 'Vinyl', 'Debate'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-26',
    name: 'Mira',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Illustrator and zine maker. Let us go museum sketching.',
    location: 'Jaipur · Arch College',
    interests: ['Illustration', 'Zines', 'Printmaking'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-27',
    name: 'Karan',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Mechanical engineer into vintage motorcycle restoration and gravel cycling.',
    location: 'Pune · COEP',
    interests: ['Motorcycles', 'Gravel bikes', 'Mechanics'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-28',
    name: 'Shreya',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Classical pianist trying to learn bossa nova. Tea over coffee.',
    location: 'Bengaluru · Bangalore University',
    interests: ['Piano', 'Bossa nova', 'Matcha'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-29',
    name: 'Yash',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Astrophysics enthusiast. Let us drive away from city lights to see meteor showers.',
    location: 'Nainital · ARIES',
    interests: ['Astronomy', 'Stargazing', 'Trekking'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-30',
    name: 'Priyanka',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Game designer & 3D artist. I will beat you in Mario Kart.',
    location: 'Hyderabad · ICAT Design',
    interests: ['Game design', '3D art', 'Mario Kart'],
    hasLikedUser: false, // ❌ Did not like you!
  },
  {
    id: 'p-31',
    name: 'Farhan',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Culinary arts student experimenting with sourdough focaccia and tacos.',
    location: 'Mumbai · IHM',
    interests: ['Baking', 'Gastronomy', 'Street food'],
    hasLikedUser: true, // ✅ Liked you!
  },
  {
    id: 'p-32',
    name: 'Ishaan',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Environmental economist. Trying to master Spanish and kayak.',
    location: 'Delhi · DSE',
    interests: ['Economics', 'Languages', 'Kayaking'],
    hasLikedUser: false, // ❌ Did not like you!
  }
];

const DB_FILE = path.join(process.cwd(), 'db.json');

export function getDb(): DbState {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DbState = {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as DbState;
  } catch {
    const fallback: DbState = { profiles: SEED_PROFILES, swipes: [], matches: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

export function saveDb(state: DbState): void {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Returns feed without revealing pre-likes (STRICT COY PRIVACY GUARANTEE)
export function getFeedProfiles(): Omit<Profile, 'hasLikedUser'>[] {
  const db = getDb();
  const swiped = new Set(db.swipes.map((s) => s.profileId));
  return db.profiles
    .filter((p) => !swiped.has(p.id))
    .map(({ hasLikedUser: _hidden, ...safe }) => safe);
}

/**
 * Records swipe and detects mutual match ONLY WHEN BOTH USERS LIKE EACH OTHER!
 * Core Coy Requirement:
 * A match happens ONLY when both users have liked each other.
 * If the other user did NOT like the logged-in user, NO match is created.
 */
export function recordSwipe(profileId: string, action: SwipeAction) {
  const db = getDb();
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) return { success: false, match: false, error: 'Not found' };
  if (db.swipes.some((s) => s.profileId === profileId)) {
    return { success: false, match: false, error: 'Already swiped' };
  }

  // 1. Record the swipe action (like or pass)
  db.swipes.push({ profileId, action, timestamp: Date.now() });

  // 2. A match happens ONLY if action is 'like' AND profile previously liked the user!
  let isMatch = false;
  if (action === 'like' && profile.hasLikedUser === true) {
    isMatch = true;
    if (!db.matches.some((m) => m.profileId === profileId)) {
      db.matches.push({ profileId, matchedAt: Date.now() });
    }
  }

  saveDb(db);

  // Return mutual match result
  if (isMatch) {
    const { hasLikedUser: _h, ...safe } = profile;
    return { success: true, match: true, matchedProfile: safe as Profile };
  }

  return { success: true, match: false };
}

// Returns only MUTUAL matches
export function getMatches() {
  const db = getDb();
  const matchMap = new Map(db.matches.map((m) => [m.profileId, m.matchedAt]));
  return db.profiles
    .filter((p) => matchMap.has(p.id))
    .map(({ hasLikedUser: _h, ...safe }) => ({
      ...safe,
      matchedAt: matchMap.get(safe.id) || Date.now(),
    }))
    .sort((a, b) => b.matchedAt - a.matchedAt);
}

// Restore the initial feed and clear swipe history.
export function resetDb() {
  saveDb({ profiles: SEED_PROFILES, swipes: [], matches: [] });
}
