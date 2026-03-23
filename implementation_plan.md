# LeadGen — Full Product Implementation Plan

Build the complete LeadGen product: a tool that helps freelancers find local businesses without websites or social media, filter them, save leads, and generate proposals.

## User Review Required

> [!IMPORTANT]
> **Google Places API Key Required**: You need a Google Cloud project with the Places API (New) enabled and an API key. This costs ~$0.032 per Text Search request (first $200/month is free via Google's credit). Please provide your API key or confirm you'd like me to set up a mock/demo mode instead.

> [!IMPORTANT]  
> **Supabase Auth Setup**: I'll configure Supabase Auth using your existing Supabase project. You'll need to enable Email/Password auth in your Supabase dashboard (Authentication → Providers). Google OAuth is optional but recommended.

> [!WARNING]
> **The current landing page will become the marketing page at `/`**. Logged-in users will be redirected to `/dashboard`. This changes the app from a single-page site to a full multi-page application.

---

## Proposed Changes

### 1. Dependencies & Config

#### [MODIFY] [package.json](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/package.json)
Add new dependencies:
- `@supabase/ssr` — server-side Supabase auth for Next.js App Router
- `lucide-react` — icon library (consistent, tree-shakeable)
- `jspdf` + `html2canvas` — for PDF proposal export
- `papaparse` — for CSV export of leads

#### [MODIFY] [.env.local](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/.env.local)
Add:
- `GOOGLE_PLACES_API_KEY` — server-side only (not `NEXT_PUBLIC_`)
- `NEXT_PUBLIC_SUPABASE_URL` — already exists
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — already exists

---

### 2. Supabase Database Schema

#### Supabase SQL (run in Supabase SQL Editor)
Create the following tables:
- **`profiles`** — user profile (name, plan, created_at)  
- **`saved_leads`** — bookmarked businesses (place_id, name, address, phone, website, has_social, notes, user_id)
- **`searches`** — search history (query, location, result_count, user_id)
- **`proposals`** — generated proposals (lead_id, template, content, user_id)
- Enable RLS policies for all tables

---

### 3. Authentication Layer

#### [NEW] [middleware.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/middleware.ts)
Supabase auth middleware to protect `/dashboard/*` routes. Redirects unauthenticated users to `/login`.

#### [NEW] [supabase-server.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/lib/supabase-server.ts)
Server-side Supabase client using `@supabase/ssr` with cookie handling.

#### [NEW] [supabase-browser.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/lib/supabase-browser.ts)
Browser-side Supabase client for client components.

#### [NEW] [login/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/login/page.tsx)
Login page with email/password form. Premium dark UI matching existing brand.

#### [NEW] [signup/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/signup/page.tsx)
Signup page with email/password registration.

#### [NEW] [auth/callback/route.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/auth/callback/route.ts)
OAuth callback handler for auth flows.

---

### 4. App Shell & Dashboard Layout

#### [NEW] [dashboard/layout.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/layout.tsx)
Shared dashboard layout with:
- **Collapsible sidebar** (Search, Saved Leads, Proposals, Settings)
- **Top bar** with user avatar, logout
- Dark theme with glassmorphism matching the landing page

#### [NEW] [dashboard/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/page.tsx)
Dashboard home with:
- **Stats cards** (total leads found, saved leads, proposals sent, searches this week)
- **Recent searches** list
- **Quick action buttons** (New Search, View Saved, Create Proposal)
- **Getting started guide** for new users

---

### 5. Lead Search Engine (Core Feature)

#### [NEW] [api/search/route.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/api/search/route.ts)
Server-side API route that:
1. Receives `query` (business type) + `location` params
2. Calls Google Places API Text Search with field mask: `displayName, formattedAddress, websiteUri, nationalPhoneNumber, rating, userRatingCount, googleMapsUri, types, photos`
3. For each result, checks if `websiteUri` is missing/empty
4. Returns enriched results with `hasWebsite`, `hasOnlinePresence` flags
5. Saves search to database

#### [NEW] [dashboard/search/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/search/page.tsx)
Search page with:
- **Search form** — business type input + location input (with autocomplete)
- **Filter bar** — toggle: No Website, No Phone, Low Rating, etc.
- **Results table/grid** — business name, address, phone, website status (✓/✗), rating, actions (Save, View, Create Proposal)
- **Status badges** — "🔥 Hot Lead" for businesses with no website
- Loading skeletons during search
- Pagination (Google Places returns up to 20 results per page with `nextPageToken`)

---

### 6. Lead Management

#### [NEW] [api/leads/route.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/api/leads/route.ts)
CRUD API for saved leads (save, list, delete, update notes).

#### [NEW] [api/leads/export/route.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/api/leads/export/route.ts)
CSV export endpoint using PapaParse.

#### [NEW] [dashboard/leads/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/leads/page.tsx)
Saved leads page with:
- **Table view** with sort, filter, search
- **Bulk actions** (export, delete)
- **Status tags** (New, Contacted, Proposal Sent, Won, Lost)
- **Inline notes** editing

#### [NEW] [dashboard/leads/[id]/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/leads/[id]/page.tsx)
Lead detail page:
- Full business info
- Google Maps embed
- Notes & activity timeline
- Quick actions (Create Proposal, Mark as Contacted)

---

### 7. Proposal Generator

#### [NEW] [dashboard/proposals/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/proposals/page.tsx)
Proposals list page — view all generated proposals.

#### [NEW] [dashboard/proposals/new/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/proposals/new/page.tsx)
Proposal builder:
- Select lead (pre-filled if coming from lead detail)
- Choose template (Website Pitch, Social Media Pitch, Full Digital Presence)
- Customize proposal content (auto-filled with business details)
- Live preview
- Export as PDF

#### [NEW] [api/proposals/route.ts](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/api/proposals/route.ts)
CRUD API for proposals.

---

### 8. Settings & Profile

#### [NEW] [dashboard/settings/page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/dashboard/settings/page.tsx)
Settings page:
- **Profile** — name, email (read-only)
- **API Configuration** — Google Places API key input (stored in user profile, used if provided; otherwise uses server key)
- **Plan & Usage** — current plan, searches used this month, upgrade CTA

---

### 9. Shared Components

#### [NEW] [components/](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/components/)
- `Sidebar.tsx` — collapsible navigation sidebar
- `Topbar.tsx` — top bar with user info
- `StatsCard.tsx` — reusable stats card
- `LeadCard.tsx` — lead display card
- `SearchForm.tsx` — search input component
- `FilterBar.tsx` — filter toggles
- `Modal.tsx` — reusable modal
- `EmptyState.tsx` — empty state placeholder
- `LoadingSkeleton.tsx` — skeleton loaders
- `StatusBadge.tsx` — lead status badges

---

### 10. Landing Page Update

#### [MODIFY] [page.tsx](file:///c:/Users/Hari/OneDrive/%E6%96%87%E6%A1%A3/leadGen/src/app/page.tsx)
- Add "Login" button to nav (alongside "Join Waitlist")
- Add pricing section (Free / Pro plans)
- Keep existing design; minor enhancements

---

## Verification Plan

### Browser Testing
1. **Landing Page**: Open `http://localhost:3000` — verify landing page still works with new Login button
2. **Auth Flow**: Click Login → fill in credentials → verify redirect to dashboard
3. **Dashboard**: Verify stats cards, sidebar navigation, and recent activity display
4. **Search**: Enter "restaurant" + "Chennai" → verify results appear with website status indicators
5. **Save Lead**: Click save on a result → verify it appears in Saved Leads
6. **Export**: Go to Saved Leads → click Export CSV → verify download
7. **Proposal**: Create a proposal from a lead → verify PDF generation
8. **Responsive**: Resize browser to mobile width → verify sidebar collapses and layout adapts

### Manual Verification (by user)
1. **Supabase Dashboard**: Verify tables are created with correct RLS policies
2. **Sign up with a real email**: Verify confirmation email arrives
3. **Google Places API**: Confirm API key works and results are returned
4. **Deploy to Vercel**: Push to GitHub and verify production deployment works
