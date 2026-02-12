# SoleMate - Production Ready E-Commerce

This is a Next.js e-commerce starter application built with Firebase and Cloudinary.

## Getting Started

To run this application locally or deploy it to Vercel, you need to provide credentials using environment variables.

### 1. Create a Local Environment File

First, create a file named `.env.local` in the root of your project. This file will hold your secrets for local development and is ignored by Git.

You can copy the example file to get started:

```bash
cp .env.example .env.local
```

### 2. Set Your Environment Variables

Open the `.env.local` file you just created and fill in the values. You will need to get these from your Firebase and Cloudinary accounts.

#### A. Firebase Credentials

You need two sets of Firebase credentials.

**Client-Side Config (Public)**

1.  Go to the **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  Select your project and go to **Project settings** (gear icon).
3.  In the "General" tab, scroll to "Your apps" and select your Web App.
4.  Choose **"Config"** to view the `firebaseConfig` object.
5.  Copy the values into the corresponding `NEXT_PUBLIC_FIREBASE_*` fields in your `.env.local` file.

**Server-Side Admin Config (Secret)**

This is a secret key for server-side operations.

1.  In Firebase **Project settings**, go to the **"Service accounts"** tab.
2.  Click **"Generate new private key"**.
3.  **Encode the entire downloaded JSON file to Base64.** This must be a single, long string.
    *   **macOS/Linux:** `base64 -i /path/to/your/key.json`
    *   **Online Tool:** Use [base64encode.org](https://www.base64encode.org/) to encode the file.
4.  Paste the single encoded string as the value for `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64`.

#### B. Cloudinary Credentials

This application uses Cloudinary to host product images.

1.  **Get your Cloud Name:**
    *   Log in to your [Cloudinary Dashboard](https://cloudinary.com/console).
    *   Your **Cloud Name** is displayed at the top.
2.  **Get your Upload Preset Name:**
    *   In the dashboard, click the **Gear icon** (⚙️) to go to Settings, then click the **Upload** tab.
    *   Scroll down to **Upload Presets**.
    *   Find or create your preset (e.g., `Carlbtw`).
    *   **Crucially, ensure its "Signing Mode" is set to `Unsigned`.**
3.  **Set the Environment Variables**: Open your `.env.local` file and add the values from your Cloudinary account.

### 3. Install Dependencies and Run

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:9002`.

### 4. Deploying to Vercel

When you deploy to Vercel, you must add the **exact same environment variables** to your Vercel project.

1.  Go to your project's dashboard on Vercel.
2.  Navigate to **Settings > Environment Variables**.
3.  Add each variable from your `.env.local` file (`NEXT_PUBLIC_...`, `FIREBASE_ADMIN_...`, etc.).
4.  Redeploy your application for the changes to take effect.
