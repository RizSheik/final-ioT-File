# IoT Device Monitoring System

A comprehensive IoT device monitoring system built with Next.js, Firebase, and TypeScript.

## Features

- Real-time device monitoring
- Automatic device status detection (Online/Offline)
- Interactive maps with device locations
- Alert system for threshold violations
- Device management (add, edit, remove)
- Responsive design for all devices

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase account
- Google Maps API key (optional)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd iot-device-monitoring
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your Firebase configuration.

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)
4. Deploy!

### Environment Variables Setup on Vercel

To set up your environment variables on Vercel:

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with the corresponding value from your Firebase project
5. Make sure all variables are set as "Production" environment variables

Note: The environment variables with the `NEXT_PUBLIC_` prefix will be embedded in the client-side bundle and are visible to users. For sensitive data, use server-side environment variables without the `NEXT_PUBLIC_` prefix.

### Environment Variables

Make sure to set the following environment variables in your deployment environment:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and services
├── public/              # Static assets
├── types/               # TypeScript types
└── ...
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
"# final-ioT-File" 
