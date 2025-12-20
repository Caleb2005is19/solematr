# Cloud Functions for SoleMate

This directory contains the backend Cloud Functions for the SoleMate application. These functions handle sensitive operations that cannot be safely performed in the client-side application.

## Function Overview

*   **`setUserRole`**: A callable function that allows an existing admin user to grant the 'admin' role to another user. This is used by the "Make Admin" button in the app's Admin Panel.

---

## How to Create Your First Admin & Access the Dashboard

Follow these steps carefully to securely set up your first administrator account. This is a one-time setup process.

### Step 1: Create Your User Account in the App

First, you need a regular user account that you want to promote to an admin.

1.  **Run the app** and open it in your browser.
2.  Click the **Login** button in the header.
3.  Choose **Sign Up** and create an account with your email and password.

### Step 2: Get Your User ID (UID)

Next, you need to find your account's unique User ID (UID) from the Firebase Console.

**Why do you need the UID?** The UID is your account's unique identifier in Firebase. To create the first admin, you will run a secure script that tells Firebase exactly *which user* to grant admin privileges to. The UID is how you specify that user.

1.  Log in to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: **`studio-9165057693-5c1af`**.
3.  In the left-hand menu, go to **Build > Authentication**.
4.  In the **Users** tab, you will see a list of all users. Find the account you just created.
5.  Copy the **User UID** for that account. It's a long string of letters and numbers (e.g., `gHZ9n7s2b9X8fJ2kP3s5t8YxVOE2`).

### Step 3: Deploy the Cloud Function

Before you can set an admin, the `setUserRole` function needs to be live on your Firebase project.

1.  Open a terminal in your project's root directory.
2.  Run the command: `firebase deploy --only functions`
3.  Wait for the deployment to finish successfully.

### Step 4: Manually Set the First Admin (One-Time Setup)

This final step involves running a secure script on your own computer. This is the safest way to create the first admin because it uses credentials that should never be stored in the app's code.

1.  **Create a temporary script file:** On your local computer (e.g., on your Desktop), create a new file named `setAdmin.js`.

2.  **Download your service account key:**
    *   Go back to the [Firebase Console](https://console.firebase.google.com/).
    *   In your project, go to **Project Settings** (click the gear icon) > **Service accounts**.
    *   Click the "**Generate new private key**" button.
    *   A JSON file will be downloaded. **Save this file in the same location** as your `setAdmin.js` script. Rename it if you like, but remember the filename.

3.  **Add the code to `setAdmin.js`:** Copy and paste the code below into your `setAdmin.js` file. **You must replace two placeholders:**
    *   `<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json`: Replace this with the actual filename of the key you just downloaded (e.g., `my-project-key.json`).
    *   `<USER_UID_TO_MAKE_ADMIN>`: Replace this with the User UID you copied in Step 2.

    ```javascript
    const admin = require('firebase-admin');

    // IMPORTANT: Replace with the actual path to your service account key file.
    // Make sure this file is in the same folder as this script.
    const serviceAccount = require('./<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // IMPORTANT: Paste the UID you copied from the Firebase Console here.
    const uid = '<USER_UID_TO_MAKE_ADMIN>';

    admin.auth().setCustomUserClaims(uid, { admin: true })
      .then(() => {
        console.log('✅ Successfully set admin claim for user:', uid);
        console.log('You can now log in to the app with this user to access the Admin Panel.');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error setting custom claim:', error);
        process.exit(1);
      });
    ```

4.  **Install the dependency:** In your terminal, navigate to the folder where you saved `setAdmin.js` and run:
    `npm install firebase-admin`

5.  **Run the script:** In the same terminal, run:
    `node setAdmin.js`

If it's successful, you'll see a success message. The specified user is now an admin!

### Step 5: Access the Admin Dashboard

1.  **Go back to your app**. You may need to log out and log back in for the admin role to apply to your session.
2.  After logging in, click your **user avatar** in the header.
3.  You will now see an **Admin Panel** link in the dropdown menu. Click it.

You can now access the admin dashboard and use the "Make Admin" button to promote other users without needing this manual script again.
