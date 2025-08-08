#!/usr/bin/env node

// Script to help set up environment variables for Vercel deployment
console.log(`
Vercel Environment Variables Setup Guide
=====================================

To deploy this application to Vercel, you need to set the following environment variables in your Vercel project settings:

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key (optional)

Steps to set environment variables on Vercel:
1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with the corresponding value from your Firebase project
5. Make sure all variables are set as "Production" environment variables

For local development, copy .env.example to .env.local and fill in your values:
cp .env.example .env.local
`);