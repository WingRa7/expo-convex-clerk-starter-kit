# Expo Convex Clerk Starter Kit

A production-ready starter kit for building mobile applications with Expo, Convex, and Clerk authentication.

## Features

- **Expo Router** - File-based routing
- **Convex** - Real-time database & backend
- **Clerk** - Complete authentication solution
- **HeroUI Native & Tailwind v4** - Modern, universal styling
- **General Translation (GT)** - Seamless internationalization

## Prerequisites

- Node.js 18+ & pnpm
- Accounts: [Convex](https://convex.dev), [Clerk](https://clerk.com), [GT](https://generaltranslation.com)

## 🛠️ Setup

### 1. Initialize Project

```bash
pnpm install
npx convex dev --once --configure=new
cp .env.example .env.local
```

### 2. Configure Clerk Dashboard

1. **User Settings**: Under **User & Authentication** → **Email, Phone, Username**, toggle **Username** to **ON** and check **Required**.
2. **JWT Template (CRITICAL)**: Go to **JWT Templates** → **+ New Template** → **Convex**. Name it exactly `convex` and save.
3. **API Keys**: Get your `Publishable Key` and `Frontend API URL` from the **API Keys** section.

### 3. Configure Environment Variables

Update your `.env.local`:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_FRONTEND_API_URL=https://...
```

### 4. Sync Clerk with Convex

1. Run `npx convex dev` in your terminal.
2. Go to [Convex Dashboard](https://dashboard.convex.dev) → **Settings** → **Environment Variables**.
3. Add `CLERK_FRONTEND_API_URL` (use your Clerk Issuer URL).
4. Add `CLERK_SECRET_KEY` (from Clerk API Keys section).

### 5. Internationalization (Optional)

```bash
cp example.gt.config.json gt.config.json
# Add your GT Project ID to gt.config.json
```

## Development

Run these in separate terminals:

```bash
npx convex dev
pnpm start
```

## 🔐 Authentication Pattern

This kit uses Convex's declarative guards for navigation.

- **Layout Guards**: `app/(auth)/_layout.tsx` and `app/(home)/(tabs)/_layout.tsx` use `<Authenticated>` components to automatically redirect users based on their sync status.
- **Root Redirection**: `app/index.tsx` checks both `isAuthenticated` and the `getCurrentUser` query to ensure the session is fully established before moving to the dashboard.

## 📝 License

MIT
