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
4.  **Important:** After signing up, copy the User UID for your new account. You can find this in the **Build > Authentication** section of the Firebase Console.

### Step 2: Deploy the Cloud Function

The `setUserRole` function needs to be live on your Firebase project so you can grant admin roles to other users later.

1.  Open a terminal in your project's root directory.
2.  Run the command: `firebase deploy --only functions`
3.  Wait for the deployment to finish successfully.

### Step 3: Run a Script to Create the First Admin

This is the final step to make your user an admin. Because this is a sensitive operation, it should be done from a secure environment (like your local machine), not from the client-side application.

1.  **Create a temporary Node.js script** (e.g., `make-admin.js`) on your local machine. **Do not** save this file inside your project directory.

2.  **Paste the following code** into the script, replacing `'UID_FROM_STEP_1'` with the actual User UID you copied.

    ```javascript
    const admin = require('firebase-admin');

    // Make sure your GOOGLE_APPLICATION_CREDENTIALS environment variable
    // is pointing to your service account key file.
    admin.initializeApp();

    const uid = 'UID_FROM_STEP_1';

    admin.auth().setCustomUserClaims(uid, { admin: true })
      .then(() => {
        console.log('✅ Successfully set admin claim for user:', uid);
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Error setting custom claim:', error);
        process.exit(1);
      });
    ```

3.  **Run the script from your terminal.** You'll need to authenticate first by pointing to the service account key file you downloaded from Firebase.

    ```bash
    # Replace the path with the actual path to your key file
    export GOOGLE_APPLICATION_CREDENTIALS="/Users/you/Downloads/my-project-firebase-adminsdk.json"

    # Now run the script
    node make-admin.js
    ```

If it's successful, you'll see a success message. The specified user is now an admin!

### Step 4: Access the Admin Dashboard

1.  **Go back to your app**. You may need to **log out and log back in** for the admin role to apply to your session.
2.  After logging in, click your **user avatar** in the header.
3.  You will now see an **Admin Panel** link in the dropdown menu. Click it.

You can now access the admin dashboard and use the "Make Admin" button to promote other users without needing this manual script again.
