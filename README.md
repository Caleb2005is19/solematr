# SoleMate - Production Ready

This is a Next.js e-commerce starter application built with Firebase. It is now configured to be production-ready and safe to deploy or commit to a public repository.

## Getting Started

### 1. Set Up Environment Variables

This project uses environment variables to handle sensitive credentials securely.

1.  **Copy the example file:**
    Rename the `.env.example` file to `.env.local`. This file is ignored by Git, so your secrets will not be committed.

    ```bash
    cp .env.example .env.local
    ```

2.  **Fill in your Firebase credentials:**
    Open `.env.local` and replace the placeholder values with your actual Firebase project credentials. You can find detailed instructions inside the file on where to get each value.

### 2. Install Dependencies and Run

Once your environment variables are set, you can run the application.

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## How to Create Your First Admin User

To access the Admin Panel, you need to grant a user the `admin` role. This is a secure, server-side operation.

### Step 1: Create a User Account in the App

1.  Run the app and open it in your browser.
2.  Click **Login**, then choose **Sign Up** to create a new account.
3.  Go to the **Firebase Console** -> **Authentication** -> **Users** tab and find the UID for the user you just created.

### Step 2: Deploy Cloud Functions

The `setUserRole` function is required to grant admin privileges.

1.  Open a terminal and run:
    ```bash
    firebase deploy --only functions
    ```

### Step 3: Grant Admin Role

There are two primary ways to set the admin claim:

**Option A: Use the Admin Panel (Recommended)**

If you already have an admin user, the easiest way is to use the UI:
1.  Log in as an existing admin.
2.  Go to the **Admin Panel**.
3.  Navigate to the **Users** tab.
4.  Find the user and click **"Make Admin"**.

**Option B: Manual Setup for the First Admin (Node.js Script)**

To create your very first admin, you can run a local Node.js script.

1.  **Create a script file** (e.g., `set-first-admin.js`) **outside** of your project directory (to avoid committing it).
2.  Add the following code, replacing the placeholder UID:

    ```javascript
    const admin = require('firebase-admin');
    
    // IMPORTANT: Initialize with your service account.
    // Ensure you have `GOOGLE_APPLICATION_CREDENTIALS` set in your terminal
    // or initialize it explicitly.
    admin.initializeApp();

    const uid = 'PASTE_THE_USER_ID_HERE'; // The UID from Step 1

    admin.auth().setCustomUserClaims(uid, { admin: true })
      .then(() => {
        console.log(`✅ Successfully set admin claim for user: ${uid}`);
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error setting custom claim:', error);
        process.exit(1);
      });
    ```
3.  **Run the script:**
    ```bash
    # You must authenticate the Admin SDK first.
    # Point this to your downloaded service account file.
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

    node set-first-admin.js
    ```

### Step 4: Access the Admin Panel

1.  **Log out and log back in** to your application. This refreshes the user's token to include the new `admin` claim.
2.  Click your user avatar in the header, and you will now see an **Admin Panel** link.
