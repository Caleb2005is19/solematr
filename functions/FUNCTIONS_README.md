# Cloud Functions for SoleMate

This directory contains the backend Cloud Functions for the SoleMate application. These functions handle sensitive operations that cannot be safely performed in the client-side application.

## Function Overview

*   **`setUserRole`**: A callable function that allows an existing admin user to grant the 'admin' role to another user. This is used by the "Make Admin" button in the app's Admin Panel.

## Getting Started

### Prerequisites

1.  **Install Firebase CLI:** If you haven't already, install the Firebase command-line tools:
    `npm install -g firebase-tools`
2.  **Log In to Firebase:**
    `firebase login`
3.  **Initialize Firebase in your project:**
    Make sure you are in the root directory of your project (not the `functions` directory) and run:
    `firebase init`
    Follow the prompts. When asked which features to set up, select **Functions**. Choose to use an existing project and select the project you are using for this app.

### Deploying Functions

To deploy your functions to Firebase, run the following command from the **root** of your project:

`firebase deploy --only functions`


## Step-by-Step: Creating an Admin and Accessing the Dashboard

### Step 1: Create Your User Account in the App

First, you need a regular user account that you want to promote to an admin.

1.  **Run the app** and open it in your browser.
2.  Click the **Login** button in the header.
3.  Choose **Sign Up** and create an account with your email and password.

### Step 2: Get Your User ID (UID)

Once you have created your account, you need to find its unique User ID (UID).

1.  Log in to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: **`studio-9165057693-5c1af`**.
3.  In the left-hand menu, go to **Build > Authentication**.
4.  In the **Users** tab, you will see a list of all users who have signed up for your app. Find the user account you just created.
5.  Copy the **User UID** for that account. It's a long string of letters and numbers (e.g., `gHZ9n7s2b9X8fJ2kP3s5t8YxVOE2`).

**Why do you need the UID?** The UID is your account's unique identifier in Firebase. To create the first admin, you will run a secure script that tells Firebase exactly *which user* to grant admin privileges to. The UID is how you specify that user.

### Step 3: Manually Set the First Admin (One-Time Setup)

The `setUserRole` function requires the caller to already be an admin. To create your *first* admin user, you must do it manually from a secure environment that has the Firebase Admin SDK configured.

1.  **Create a temporary script:** On your local computer, create a file named `setAdmin.js` in a secure folder (do not add this file to your project repository).
2.  **Download your service account key** from the Firebase Console:
    *   Go to **Project Settings > Service accounts**.
    *   Click "**Generate new private key**". A JSON file will be downloaded. Place it in the same directory as your `setAdmin.js` script.
3.  **Add the following code to `setAdmin.js`**, replacing `<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json` and `<USER_UID_TO_MAKE_ADMIN>`:

    ```javascript
    const admin = require('firebase-admin');

    // IMPORTANT: Replace with the path to your service account key file
    const serviceAccount = require('./<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // IMPORTANT: Paste the UID you copied from the Firebase Console here.
    const uid = '<USER_UID_TO_MAKE_ADMIN>';

    admin.auth().setCustomUserClaims(uid, { admin: true })
      .then(() => {
        console.log('Successfully set admin claim for user:', uid);
        process.exit(0);
      })
      .catch(error => {
        console.error('Error setting custom claim:', error);
        process.exit(1);
      });
    ```
4. **Install the dependency:** In your terminal, in the same folder as your script, run `npm install firebase-admin`.
5. **Run the script:** From your terminal, run `node setAdmin.js`. The specified user is now an admin.

### Step 4: Access the Admin Dashboard

1.  **Go back to your app**. You may need to log out and log back in for the admin role to be applied to your session.
2.  After logging in, click your **user avatar** in the header.
3.  You will now see an **Admin Panel** link in the dropdown menu. Click it.

You can now access the admin dashboard and use the "Make Admin" button to promote other users without needing the manual script again.
