# SoleMate - Production Ready

This is a Next.js e-commerce starter application built with Firebase. It is now configured to be production-ready and safe to deploy or commit to a public repository.

## Getting Started

### 1. Set Up Environment Variables

This project uses environment variables to handle sensitive credentials securely. For the application to function correctly, both locally and in production (e.g., on Vercel), you must set these variables.

1.  **Create a local environment file:**
    Rename the `.env.example` file to `.env.local`. This file is ignored by Git, so your secrets will not be committed.

    ```bash
    cp .env.example .env.local 
    ```

2.  **Fill in your Firebase credentials:**
    Open `.env.local` and fill in the placeholder values. The file is split into two sections: **Client-Side Credentials** (which are safe to expose in the browser) and **Server-Side Admin Credentials** (which must be kept secret).

---

### How to Find Your Firebase Credentials

#### **Client-Side Credentials (`NEXT_PUBLIC_...`)**

These are for the Firebase SDK that runs in the user's browser.

1.  Go to the **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  Select your project.
3.  Click the **Gear icon** next to "Project Overview" and go to **Project settings**.
4.  In the "General" tab, scroll down to the "Your apps" section.
5.  Click on your web app (or create one if you haven't).
6.  Select **"Config"** to view the `firebaseConfig` object.
7.  Copy the values for `apiKey`, `authDomain`, `projectId`, and `appId` into the matching `NEXT_PUBLIC_...` fields in your `.env.local` file.



#### **Server-Side Admin Credentials (`FIREBASE_ADMIN_...`)**

These are for the Firebase Admin SDK, which runs on the server to securely access your data (e.g., fetching products for server-rendered pages).

1.  In your Firebase **Project settings**, go to the **"Service accounts"** tab.
2.  Click the **"Generate new private key"** button. A JSON file will be downloaded to your computer.
3.  **Open the JSON file.** It will look like this:

    ```json
    {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "some_long_hex_string",
      "private_key": "-----BEGIN PRIVATE KEY-----\n...some_very_long_string...=\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
      "client_id": "...",
      "auth_uri": "...",
      "token_uri": "...",
      "auth_provider_x509_cert_url": "...",
      "client_x509_cert_url": "..."
    }
    ```

4.  **Copy the three required values** into your `.env.local` file:
    *   `FIREBASE_ADMIN_PROJECT_ID`: Copy the `project_id` value.
    *   `FIREBASE_ADMIN_CLIENT_EMAIL`: Copy the `client_email` value.
    *   `FIREBASE_ADMIN_PRIVATE_KEY`: Copy the entire `private_key` value. **Important:** It is a very long string that starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----\n`. Copy the entire string, including those markers and the `\n` characters.

---

### 2. Set Environment Variables for Production (Vercel)

For your deployed application to work, you must also provide these environment variables to your hosting provider (e.g., Vercel).

1.  Go to your project's dashboard on Vercel.
2.  Navigate to **Settings > Environment Variables**.
3.  Add each of the variables from your `.env.local` file (both `NEXT_PUBLIC_` and `FIREBASE_ADMIN_` variables).
4.  Ensure they are enabled for the **Production** environment (and Preview, if desired).
5.  **Redeploy** your application to apply the changes.

---

### 3. Install Dependencies and Run Locally

Once your `.env.local` file is set, you can run the application.

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:9002`.
