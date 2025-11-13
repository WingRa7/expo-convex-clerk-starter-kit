# Expo Convex Clerk Starter Kit

A production-ready starter kit for building mobile applications with Expo, Convex, and Clerk authentication.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🚀 Features

- **Expo Router** - File-based routing for React Native
- **Convex** - Backend-as-a-Service with real-time database
- **Clerk** - Complete authentication solution with social logins
- **TypeScript** - Full type safety throughout
- **Formik & Yup** - Form handling and validation
- **React Native New Architecture** - Enabled for better performance

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- [Convex account](https://convex.dev) (free tier available)
- [Clerk account](https://clerk.com) (free tier available)

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Initialize Convex (follow prompts)
npx convex init

# Create .env.local file (see Environment Variables section)
# Configure Clerk and Convex (see Setup section below)

# Start development
pnpm start
# In another terminal:
npx convex dev
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Create Environment File

Create a `.env.local` file in the root directory. This file will store your environment variables (it's already in `.gitignore`).

```bash
touch .env.local
```

### 3. Initialize Convex

```bash
npx convex init
```

This will add the following environment variables to `.env.local`:
- `CONVEX_DEPLOYMENT`
- `EXPO_PUBLIC_CONVEX_URL`

### 4. Configure Clerk

1. Get your API keys from [Clerk Dashboard](https://dashboard.clerk.com) → Configure → API Keys
2. Add to `.env.local`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. Set up JWT Template:
   - Go to Clerk Dashboard → Configure → Session Management → + Add New Template
   - Set the Template field to `JWT`
   - Copy the Issuer URL and add to `.env.local`:
     ```
     CLERK_FRONTEND_API_URL=https://your-clerk-instance.clerk.accounts.dev
     ```

### 5. Configure Convex Environment Variables

1. Run Convex in development mode:
   ```bash
   npx convex dev
   ```

2. Add Clerk environment variable to Convex:
   - Go to [Convex Dashboard](https://dashboard.convex.dev) → Settings → Environment Variables
   - Click `Add new variable` (make sure you're on the `dev` tab)
   - Name: `CLERK_FRONTEND_API_URL`
   - Value: Your Clerk Issuer URL (same as above)
   - Click `Save`

3. Add Clerk Secret Key:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com) → API Keys
   - Copy the Secret Key (starts with `sk_...`)
   - Go to Convex Dashboard → Settings → Environment Variables → `dev` tab
   - Add new variable:
     - Name: `CLERK_SECRET_KEY`
     - Value: Your Clerk Secret Key
     - Click `Save`

### 6. Configure Google Sign-In (Optional)

For one-tap Google sign-in:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Follow the [Clerk Google OAuth guide](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google#configure-for-your-production-instance)
3. Enable "Always show account selector" so users can choose their Google account
4. Add branding information in Google Cloud Console

## 🏃 Running the App

```bash
# Start Expo development server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Run on Web
pnpm web
```

Make sure Convex is running in another terminal:
```bash
npx convex dev
```

## 📁 Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication routes
│   ├── (home)/            # Protected routes
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── convex/                # Convex backend functions
│   ├── auth.ts           # Auth configuration
│   └── tasks.ts          # Example queries/mutations
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

## 🔐 Authentication

### Using Convex Auth Components

This starter uses Convex's authentication components instead of Clerk's directly. This ensures proper token synchronization between Clerk and Convex.

**Use these Convex components:**
- `<Authenticated>` - Shows content when user is signed in
- `<Unauthenticated>` - Shows content when user is signed out
- `<AuthLoading>` - Shows loading state

**Use this hook:**
- `useConvexAuth()` - Check authentication state (instead of Clerk's `useAuth()`)

### Accessing User Identity in Convex

In your Convex functions, access the authenticated user:

```typescript
import { query } from "./_generated/server";

export const myQuery = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null; // User not authenticated
  }
  // Use identity.tokenIdentifier or identity.subject
  return identity;
});
```

## 📦 What's Included

This starter kit comes with:

- **Authentication Flow**: Complete sign-in, sign-up, password reset, and account management screens
- **Protected Routes**: Example of authenticated routes using Expo Router groups
- **Example Components**: Reusable UI components (buttons, text, views, forms)
- **Form Validation**: Formik + Yup integration for form handling
- **Custom Hooks**: Password verification and theme hooks
- **Example Convex Functions**: Sample queries and mutations in `convex/tasks.ts`
- **TypeScript**: Full type safety with generated Convex types

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Clerk Dashboard → API Keys |
| `CLERK_FRONTEND_API_URL` | Clerk issuer URL | Clerk Dashboard → JWT Template |
| `CONVEX_DEPLOYMENT` | Convex deployment name | Generated by `npx convex init` |
| `EXPO_PUBLIC_CONVEX_URL` | Convex deployment URL | Generated by `npx convex init` |

**Note**: Variables prefixed with `EXPO_PUBLIC_` are exposed to your app. Never put secrets in these variables.

## 🎨 Customization

### Fonts

1. Add font files to `assets/fonts/`
2. Import and load fonts in `app/_layout.tsx`

### Bundle Identifiers

Update the following files with your own bundle identifiers:
- `app.json` - `ios.bundleIdentifier` and `android.package`
- Update iOS project settings if needed (run `npx expo prebuild` to regenerate native projects)

### App Name and Display

Update `app.json`:
- `name` - App display name
- `slug` - URL-friendly name
- `scheme` - Deep linking scheme

## 🐛 Troubleshooting

### "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY"

Make sure you've created `.env.local` and added all required environment variables. Restart your Expo dev server after adding environment variables.

### Convex connection errors

1. Ensure `npx convex dev` is running in a separate terminal
2. Check that `EXPO_PUBLIC_CONVEX_URL` in `.env.local` matches your Convex deployment
3. Verify Convex environment variables are set in the Convex Dashboard

### Authentication not working

1. Verify Clerk JWT template is set up correctly (Template field = `JWT`)
2. Check that `CLERK_FRONTEND_API_URL` matches your Clerk issuer URL exactly
3. Ensure `CLERK_FRONTEND_API_URL` is set in both `.env.local` and Convex Dashboard
4. Verify `CLERK_SECRET_KEY` is set in Convex Dashboard (dev environment)

### iOS build issues

If you encounter issues with the iOS project:
```bash
# Clean and regenerate native projects
npx expo prebuild --clean
cd ios && pod install && cd ..
```

### Android build issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
```

## 🚀 Deployment

### Building for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

**Important**: Before deploying:
1. Set up production environment variables in Convex Dashboard
2. Update Clerk to use production keys
3. Configure production bundle identifiers in `app.json`
4. Set up EAS (Expo Application Services) if using: `npm install -g eas-cli && eas login`

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev)
- [Convex](https://convex.dev)
- [Clerk](https://clerk.com)
- [React Native](https://reactnative.dev)
