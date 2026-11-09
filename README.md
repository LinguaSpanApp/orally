# Oraly - Your Dataset Recording Studio

Oraly is a browser-based tool designed to help researchers and developers collect high-quality voice recordings for datasets. It allows users to import text prompts, record audio directly in the browser, and export everything as a structured ZIP file.

## 🚀 How to Host This for Free

Since this app is built with Next.js and operates entirely in the browser (client-side), you can host it for free on several platforms.

### Option 1: Vercel (Recommended)
Vercel is the creator of Next.js and offers the most seamless deployment experience.
1. Create a free account at [vercel.com](https://vercel.com).
2. Push your code to a GitHub, GitLab, or Bitbucket repository.
3. Connect your repository to Vercel.
4. Click **Deploy**. Vercel will automatically detect Next.js and set everything up.

### Option 2: Netlify
Netlify is another excellent option with a great free tier.
1. Create a free account at [netlify.com](https://netlify.com).
2. Connect your GitHub repository.
3. Choose the `main` branch and click **Deploy**.

### Option 3: Firebase App Hosting
Since you are in Firebase Studio, you can use Firebase App Hosting.
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **App Hosting** in the sidebar.
3. Connect your GitHub repository and follow the setup wizard.
*Note: Firebase App Hosting has a free tier, but check the latest pricing if you are on a "Spark" plan.*

## 🛠 Features
- **Easy Import**: Paste text or upload `.csv/.tsv/.txt` files.
- **In-Browser Recording**: High-quality audio capture using `getUserMedia`.
- **Progress Tracking**: See exactly how much of your dataset is recorded.
- **Instant Export**: Downloads a ZIP file containing all `.webm` audio files and a `metadata.tsv` mapping file.

## 💻 Local Development
If you want to run it on your own machine:
1. `npm install`
2. `npm run dev`
3. Open [http://localhost:9002](http://localhost:9002) in your browser.

---
© 2025 Oraly Studio. Built for the open-source speech community.
