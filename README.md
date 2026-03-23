# LeadGen

LeadGen is a freelancer sales tool to discover local businesses, identify weak digital presence, save leads, and generate outreach proposals.

## Features

- Landing page + waitlist API
- Email/password auth with Supabase (optional demo fallback)
- Protected dashboard routes via middleware
- Lead search endpoint using Google Places API (falls back to demo results if API key is missing)
- Save/manage leads, export CSV
- Create proposals, export PDF

## Local Setup

1) Install dependencies:

```bash
npm install
```

2) Configure environment (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_PLACES_API_KEY=...
```

3) In Supabase:
- Enable Email/Password auth provider.
- Run `supabase_schema.sql` in SQL Editor.

4) Run app:

```bash
npm run dev
```

5) Production check:

```bash
npm run build
```

## Deploy (Vercel)

1) Push repo to GitHub.
2) Import project in [Vercel](https://vercel.com).
3) Add the same environment variables in Vercel Project Settings.
4) Deploy.

## Notes

- If Supabase tables are not created yet, app still works in fallback in-memory mode for quick testing.
- For real data persistence and user-level isolation, complete Supabase setup is required.
