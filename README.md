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

## Part A: Live App Teardown & Feature Suggestions

### Exploring the App Flow
Before writing down any suggestions, I went through the entire user journey on mobile:
* **Phone OTP Login:** Quick single-field entry with country code support (`libphonenumber-js`) and 6-digit SMS verification.
* **Adding a Crush:** Clean bottom sheet allowing entry by phone number, email, or both, with a native device contact picker (`navigator.contacts`). It shows a preview of the anonymous SMS sent to the crush.
* **Email Verification:** College/domain verification to anchor user identity into trusted student circles.
* **Invite Links & Viral Loops:** The referral milestone: *"Invite 3 friends. When they join and add a crush, you get a free slot."*
* **Extra Slots Screen (`/buy`):** The core scarcity and monetization mechanic. Scarcity forces users to make thoughtful, high-intent choices.

While the zero-knowledge matching logic (*"nobody ever knows unless it's mutual"*) is very smart, testing the product revealed two key friction points where users are likely to drop off. Here are two features to solve them:

---

### Feature 1: Slot Recycling (Reclaiming Inactive Slots after 14–21 Days)

#### The Problem:
Coy gives users a limited number of slots (e.g., 3 free slots). This is good for intent, but creates an unintended dead end:
* If you pick 3 people who don't use Coy, ignore the SMS, or are already dating someone, your account becomes completely frozen.
* You cannot add anyone new without paying or badgering 3 friends to sign up and add crushes of their own.
* After checking the app a few times and seeing no updates, most users will simply abandon the app because there's nothing left for them to do.

#### How It Works:
* Allow users to swap out or release an unreciprocated crush slot after a cooldown period of **14 to 21 days** of inactivity.
* If a slot has had no activity after 2–3 weeks, a discreet button appears: *"Free up this slot"*.
* **Privacy Edge Case:** The old crush is **never** notified that they were replaced. If they happen to join Coy months later and add the user, Coy can still resurface it as an *"Archived spark"* to unlock the match.

#### Why It's Required:
* **Lowers Psychological Barrier:** Users hesitate to use their last slot because it feels like a permanent commitment. Knowing they can recycle it after 2 weeks encourages immediate slot usage.
* **Protects Retention:** Keeps non-paying users active over semesters instead of hitting an unplayable wall.
* **Drives Long-Term Monetization:** Users who actively manage their slots are significantly more engaged and more likely to buy permanent extra slots during high-spark periods (college fests, freshers' week, Valentine's season).

---

### Feature 2: Verified Campus & Circle Context in the Anonymous SMS

#### The Problem:
When you add a crush by phone, Coy sends an automated text message:
> *"Someone you know has added you as a crush on the Coy App. Find out if it's mutual at app.getcoy.com"*

In reality, people receive countless spam and phishing texts every week. An anonymous message containing a link from an unknown number triggers immediate skepticism. Many users swipe it away or mark it as spam before ever visiting the website.

#### How It Works:
Leverage the college email verification Coy already performs to attach verified, broad community context to the heads-up:
* **Before:** *"Someone you know has added you as a crush on the Coy App. Find out if it's mutual at app.getcoy.com"*
* **After:** *"Someone from **[Your College Name]** added you as a secret crush on Coy. Find out if it's mutual at app.getcoy.com"*
* **In-App Dashboard:** The recipient's dashboard can show a zero-knowledge hint: *"You have 1 secret crush from your college."*

#### Why It's Required:
* **Dramatically Improves SMS-to-Signup Conversion:** Mentioning the recipient's verified college or batch immediately proves the text is authentic, not a random phishing attempt.
* **Supercharges Word-of-Mouth Virality:** Nothing spreads faster across campus or a hostel than knowing someone from your own college has a crush on you. It turns a generic alert into an instant conversation topic.
* **100% Zero-Knowledge Privacy:** A college or graduation batch has thousands of students, so the sender's individual identity remains completely confidential.

---

## Part B: Discover Tab Implementation

The Discover tab is built as a mobile-first swipe deck alongside the placeholder Home tab and a dedicated Matches view:

### Key Features
1. **Swipe Experience (Mobile Drag + Desktop Buttons):**
   * Drag card right or click `♥` to **Like**.
   * Drag card left or click `×` to **Pass**.
   * Real-time visual stamps (`LIKE` in green, `PASS` in red) as you drag.
   * Swiped cards are permanently filtered out and never appear again.
2. **Strict Mutual Matching:**
   * A match happens **only** when both users like each other. One-sided likes simply slide away with zero awkwardness and no data leakage.
   * When both users like each other, an animated **"It's a match!"** celebration screen appears.
3. **Matches Tab & Profile Detail View:**
   * Lists all mutual matches with thumbnails, names, and college/interests.
   * Clicking any match row opens their **full profile card** (same rich details as Discover) with a *"Send a note"* action.
4. **Empty State & Demo Reset:**
   * When all 32 profiles are swiped, shows *"You're all caught up"* with a **"↺ Reset Profiles"** button to easily replay the demo.

### Backend APIs
* `GET /api/feed`: Returns unswiped profiles. Strips `hasLikedUser` server-side to guarantee zero client-side enumeration or data leakage.
* `POST /api/swipe`: Records like/pass with timestamps. Evaluates mutual match.
* `GET /api/matches`: Returns mutual matches.
* `POST /api/reset`: Resets demo state to 32 fresh profiles.

### Data Persistence
Backed by `db.json` with atomic file writes. All swipes and matches persist across page refreshes and server restarts.
