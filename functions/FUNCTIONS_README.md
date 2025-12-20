# Cloud Functions for SoleMate

This directory contains the backend Cloud Functions for the SoleMate application.

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

## Managing Admin Roles

For security, user roles (like "admin") must be managed from a secure backend environment. You cannot grant admin privileges from the client-side application directly.

### Creating the First Admin (One-Time Setup)

The `setUserRole` function requires the caller to already be an admin. To create your *first* admin user, you must do it manually via a terminal that has the Firebase Admin SDK configured.

1.  **Get the User's UID:**
    First, you need the unique User ID (UID) of the user you want to make an admin. You can find this in a few ways:
    *   Log in to the application as that user and find their UID in the "Users" tab of the Admin Panel.
    *   Go to the Firebase Console -> Authentication -> Users tab. The UID is listed there.

2.  **Set the Custom Claim using Node.js:**
    *   Create a temporary file (e.g., `setAdmin.js`) in a secure location on your computer (do not add this file to your project repository).
    *   You will need to download your service account key from the Firebase Console:
        *   Go to Project Settings > Service accounts.
        *   Click "Generate new private key". A JSON file will be downloaded.
    *   Add the following code to `setAdmin.js`, replacing `<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json` and `<USER_UID_TO_MAKE_ADMIN>` with your actual values.

    ```javascript
    const admin = require('firebase-admin');

    // IMPORTANT: Replace with the path to your service account key file
    const serviceAccount = require('./<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY>.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

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

3.  **Run the Script:**
    *   From your terminal, in the same directory as your script, run:
        `node setAdmin.js`

The specified user is now an admin and can use the "Make Admin" button in the app to promote other users.
