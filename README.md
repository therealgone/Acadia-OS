# acadia-os

A cleaner, modern interface for SRM Academia. Fast, organized, and beautiful.

## Features

- Timetable, Attendance, Marks, Profile
- Vertical flow on mobile, grid on desktop
- Modern palette, semantic tags, soft panels
- PWA-ready, optimized for Vercel

## Tech

- Next.js 15 (App Router)
- TypeScript
- Tailwind (with custom CSS vars)
- TanStack Query

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/<you>/acadia-os.git
   cd acadia-os
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Open http://localhost:3000

## Project Structure

```
acadia-os/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── app/               # Main application routes
│   │   │   ├── attendance/    # Attendance tracking
│   │   │   ├── calendar/      # Academic calendar
│   │   │   ├── course/        # Course information
│   │   │   ├── marks/         # Grades and marks
│   │   │   ├── profile/       # User profile
│   │   │   ├── timetable/     # Class schedule
│   │   │   └── components/    # Shared components
│   │   ├── auth/              # Authentication pages
│   │   └── components/        # Global components
│   ├── hooks/                 # Custom React hooks
│   ├── server/                # Server actions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## 🎯 Key Features Explained

### Modern Dashboard

- Clean interface that replaces the traditional SRM Portal
- Real-time data updates with React Query
- Responsive design that works on all devices

### Academic Management

- **Timetable**: View your daily class schedule with ease
- **Attendance**: Track your attendance percentage across all courses
- **Marks**: Monitor your academic performance and grades
- **Courses**: Access detailed course information
- **Calendar**: Academic calendar with important dates and events
- **Profile**: Academic Student information

## 🔧 Scripts

- dev: `pnpm dev`
- build: `pnpm build`
- start: `pnpm start`
- lint: `pnpm lint`

## Deployment (Vercel)

1. Push to a GitHub repo named `acadia-os`.
2. Import in Vercel and select framework: Next.js.
3. Set environment variables (Project → Settings → Environment Variables).
4. Leave build settings on Automatic and deploy.

This repo includes `vercel.json` with Next.js + pnpm defaults. Ensure Node 18+ and pnpm are enabled in Vercel Project Settings.

Troubleshooting:
- If dependency install fails, enable pnpm in Vercel or remove non-pnpm lockfiles.
- Verify required env vars exist for production.

## 🌐 API

This application uses the `srm-academia-api` package to interact with SRM University's backend services. The API provides secure access to:

- Student authentication
- Academic data retrieval
- Real-time updates

## 📄 License

This project is licensed under the Creative Commons Attribution 4.0 International License - see the [LICENSE-CC-BY-4.0](LICENSE-CC-BY-4.0) file for details.

## 🔗 Links

- **GitHub Repository**: [https://github.com/jackwaghan/academiax](https://github.com/jackwaghan/academiax)
- **NPM Package**: [https://www.npmjs.com/package/srm-academia-api](https://www.npmjs.com/package/srm-academia-api)
- **AcademiaX**: [https://academiax.in](https://academiax.in)
