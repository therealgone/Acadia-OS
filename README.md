## Acadia OS

A sleek, modern interface for SRM Academia — fast, organized, and beautiful.

Built with great care and attention to UX. Done by Jeevan Baabu Murugan.

### Highlights
- Real-time academic data: Timetable, Attendance, Marks, Courses, Calendar, Profile
- Predictive insights: Attendance projection and actionable margins
- Offline-friendly caching: Client-side persistence with TanStack Query
- Responsive UI: Mobile-first layout with a desktop dock and glass panels
- Secure auth flow: Cookie-based sessions with middleware protection
- Edge-ready: Middleware on edge; deploys seamlessly on Vercel

## Tech Stack
- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 with custom CSS variables and utility layers
- TanStack Query v5 (+ async-storage persister, devtools)
- Zustand (small client-side state for auth flow)
- Lucide / React Icons
- Local SRM-SCRAPPER (SRM data access)

## Project Structure
```text
acadia-os/
├─ src/
│  ├─ app/                         # App Router
│  │  ├─ layout.tsx                # Root layout, global containers
│  │  ├─ page.tsx                  # Landing (Hero + Headers)
│  │  ├─ globals.css               # Tailwind + tokens + utilities
│  │  ├─ app/                      # Auth-protected application
│  │  │  ├─ layout.tsx             # Provides QueryProvider + shell
│  │  │  ├─ components/            # App-level components
│  │  │  │  ├─ CommandCenter.tsx   # Mobile bottom nav + desktop dock
│  │  │  │  ├─ loader.tsx          # SVG loader + GlobalLoader wrapper
│  │  │  │  └─ provider.tsx        # Query client, persistence, menu
│  │  │  ├─ attendance/
│  │  │  │  ├─ PredictModal.tsx    # Date range modal, scenario select
│  │  │  │  └─ page.tsx
│  │  │  ├─ calendar/
│  │  │  │  └─ page.tsx
│  │  │  ├─ course/
│  │  │  │  └─ page.tsx
│  │  │  ├─ marks/
│  │  │  │  └─ page.tsx
│  │  │  ├─ profile/
│  │  │  │  └─ page.tsx
│  │  │  └─ timetable/
│  │  │     └─ page.tsx
│  │  ├─ auth/
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx
│  │  │  └─ logout/
│  │  │     └─ page.tsx
│  │  └─ components/                # Landing headers, hero
│  ├─ hooks/
│  │  ├─ query.ts                   # TanStack Query hooks
│  │  └─ zustand.ts                 # Auth flow and utilities
│  ├─ server/
│  │  └─ action.ts                  # Server actions (local SRM-SCRAPPER)
│  ├─ utils/
│  │  ├─ attendancePredict.ts       # Attendance math + projections
│  │  ├─ currentClass.ts            # Time-window check for current class
│  │  ├─ currentMonth.ts            # Calendar helpers
│  │  ├─ getCookieClient.ts         # Read cookies on client
│  │  └─ getCookieServer.ts         # Read cookies on server
│
├─ public/                          # Icons, manifest, sw.js
├─ next.config.ts                   # Next config (images, experimental)
├─ vercel.json                      # Vercel project settings
└─ package.json                     # Scripts and dependencies
```

## Feature Overview

### Authentication & Security
- Middleware (`src/middleware.ts`) protects all `/app/**` routes.
- Server actions (`src/server/action.ts`) delegate to local `SRM-SCRAPPER` for:
  - User verification, password verification, logout
  - Timetable, Attendance, Marks, Courses, Calendar, Day Order
- Cookies `token` and `user` set on successful login; cleared on logout.

### Data Layer
- TanStack Query with:
  - Sensible `staleTime` per resource
  - Disabled queries when unauthenticated
  - LocalStorage persistence (30 days)
  - React Query Devtools in development

### Timetable
- Day Order navigation with current day highlighting and smooth scroll.
- Current class auto-highlight using precise time window checks.
- Attendance integration shows up-to-date percentages.

### Attendance
- Split by Theory and Practical with clear color semantics.
- Predictive modal to simulate attend/absent over a date range.
- Projection math: min classes to reach threshold, skip margins, window feasibility.

### Marks
- Per-course marks with exam breakdowns and totals.
- Course metadata joined for cleaner display.

### Courses
- Compact cards: code, type, faculty, slot, room, credits.

### Calendar
- Month grid with current day highlight, holiday states, events.

### Profile
- Student details and a prominent logout action.

### UX & UI System
- Tailwind v4 + custom CSS variables (`globals.css`) for tokens:
  - Background, text, accents, borders, rings
- Reusable utility classes and “glass” panels.
- Mobile bottom navigation and desktop dock (`CommandCenter`).
- Consistent loaders with centered layout (`GlobalLoader`).

## Getting Started

### Prerequisites
- Node.js 22.x (per `package.json` engines)
- npm 10+

### Install
```bash
git clone https://github.com/<your-username>/acadia-os.git
cd acadia-os
npm ci
```

### Development
```bash
npm run dev
# open http://localhost:3000
```

### Build & Start
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Deployment (Vercel)
This repo includes `vercel.json` and is optimized for Vercel.

1. Push to GitHub.
2. Import the project in Vercel (Framework: Next.js).
3. Build command: `npm run vercel-build` (already set).
4. Install command: `npm ci` (already set).
5. Deploy.

No extra env vars are required by the app; data access is via local `SRM-SCRAPPER`.

## Notes on Data Access
This app depends on the local `SRM-SCRAPPER` package for authenticated data. Ensure your browser manages cookies correctly and that your account has access.

## Credits
- Design and Development: Jeevan Baabu Murugan

## License
This project is licensed under the Creative Commons Attribution 4.0 International License — see `LICENSE-CC-BY-4.0`.



