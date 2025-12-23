# SoleMate - Production Ready

This is a Next.js e-commerce starter application built with Firebase. It is now configured to be production-ready and safe to deploy or commit to a public repository.

## Getting Started

To run this application, you need to provide it with your Firebase project credentials. This is done using environment variables, which keep your secrets safe.

### 1. Create a `.env.local` File for Local Development

First, create a file named `.env.local` in the root of your project. This file will hold your credentials for local testing.

```bash
cp .env.example .env.local
```

This file is ignored by Git, so your secrets will not be committed.

### 2. Get Your Firebase Credentials

You need two sets of credentials: one for the client-side (public) and one for the server-side (secret).

#### **A. Client-Side Credentials (Public)**

These are for the Firebase SDK that runs in the user's browser.

1.  Go to the **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  Select your project.
3.  Click the **Gear icon** next to "Project Overview" and go to **Project settings**.
4.  In the "General" tab, scroll down to the "Your apps" section.
5.  Click on your web app.
6.  Select **"Config"** to view the `firebaseConfig` object.
7.  Copy the values into the corresponding `NEXT_PUBLIC_...` fields in your `.env.local` file.

#### **B. Server-Side Admin Credentials (Secret)**

These are for the Firebase Admin SDK, which runs on the server to perform privileged operations like reading all product data for the main page.

1.  In your Firebase **Project settings**, go to the **"Service accounts"** tab.
2.  Click the **"Generate new private key"** button. A warning will appear; confirm by clicking **"Generate key"**.
3.  A **JSON file** will be downloaded to your computer. Open this file in a text editor.
4.  **Copy the three required values** from the JSON file into your `.env.local` file:
    *   `FIREBASE_ADMIN_PROJECT_ID`: Copy the `project_id` value.
    *   `FIREBASE_ADMIN_CLIENT_EMAIL`: Copy the `client_email` value.
    *   `FIREBASE_ADMIN_PRIVATE_KEY`: Copy the entire `private_key` value. **Important:** It is a very long string that starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----\n`. Copy the entire string, including those markers and the `\n` characters.

### 3. Install Dependencies and Run Locally

Once your `.env.local` file is complete, you can run the application.

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:9002`.

### 4. Configure Environment Variables for Production (Vercel)

For your deployed application on Vercel to work, you must also provide these environment variables to Vercel.

1.  Go to your project's dashboard on Vercel.
2.  Navigate to **Settings > Environment Variables**.
3.  Add each of the variables from your `.env.local` file (both `NEXT_PUBLIC_` and `FIREBASE_ADMIN_` variables).
    *   For the `FIREBASE_ADMIN_PRIVATE_KEY`, paste the entire multi-line key value. Vercel will handle it correctly.
4.  Ensure they are enabled for the **Production** environment (and Preview, if desired).
5.  **Redeploy** your application to apply the changes. The new build will now have access to the credentials and will be able to fetch data from Firestore on the server.
