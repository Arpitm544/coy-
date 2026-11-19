# Coy SDE Intern Assignment

A standalone, mobile-first **Discover** tab and mutual-matching experience built for **[Coy](https://app.getcoy.com)**. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.

---

## Quick Start (Run Locally)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## Part A: Product Feedback & Feature Suggestions

*A full standalone copy is also available in [`PART_A_SUBMISSION.md`](./PART_A_SUBMISSION.md).*

While testing Coy on mobile (phone OTP login, contact-picker crush entry, email verification, invites, and extra slots), the core zero-knowledge promise is great. However, two real user friction points stand out:

### 1. Reclaiming Inactive Crush Slots (after 2–3 weeks)
* **The Problem:** Users get a small, fixed number of slots to keep intent high. But if the 2 or 3 people you pick never download Coy, ignore the SMS, or are already seeing someone, your account is frozen. You can't add anyone new without paying or badgering three friends to sign up. After checking a couple of times and seeing nothing happen, users will delete the app.
* **The Suggestion:** Let users swap out or release an unreciprocated slot after 14 to 21 days of inactivity.
* **Why it's needed:** Removes the fear of wasting slots, encourages users to actually use their slots right away, and prevents free users from hitting an unplayable dead end.

### 2. Adding Campus or Circle Context to the Anonymous SMS
* **The Problem:** When you add a crush, Coy sends: *"Someone you know has added you as a crush on the Coy App. Find out if it's mutual at app.getcoy.com"*. People get a lot of spam texts, so an anonymous link from an unknown number looks like a scam.
* **The Suggestion:** Include broad, verified context from email verification: *"Someone from [Your College] added you as a secret crush on Coy. Find out if it's mutual at app.getcoy.com"*.
* **Why it's needed:** Proves the text is authentic, spikes curiosity, and massively boosts conversion and viral campus adoption while keeping the sender completely anonymous.

---

## Part B: Discover Tab Implementation

### Key Features
1. **Swipe Experience (Mobile Drag + Desktop Buttons):**
   * Drag card right or click `♥` to **Like**.
   * Drag card left or click `×` to **Pass**.
   * Real-time visual stamps (`LIKE` in green, `PASS` in red).
   * Swiped cards never appear again.
2. **Strict Mutual Matching:**
   * A match happens **only** when both users like each other. One-sided likes simply slide away without leaking who liked whom.
   * On a mutual match, an animated **"It's a match!"** celebration screen appears.
3. **Matches Tab & Profile Detail:**
   * Lists all mutual matches with thumbnails, names, and college/interests.
   * Clicking any match opens their **full profile card** (same details as Discover) with a *"Send a note"* action.
4. **Empty State & Demo Reset:**
   * When all 32 profiles are swiped, shows *"You're all caught up"* with a **"↺ Reset Profiles"** button to easily replay the demo.

### Backend APIs
* `GET /api/feed`: Returns unswiped profiles. Strips `hasLikedUser` server-side to guarantee zero data leakage.
* `POST /api/swipe`: Records like/pass with timestamps. Evaluates mutual match.
* `GET /api/matches`: Returns mutual matches.
* `POST /api/reset`: Resets demo state to 32 fresh profiles.

### Data Persistence
Backed by `db.json` with atomic file writes. All swipes and matches persist across page refreshes and server restarts.
