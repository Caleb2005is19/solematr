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

#### A. Client-Side Credentials (Public)

These are for the Firebase SDK that runs in the user's browser.

1.  Go to the **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  Select your project.
3.  Click the **Gear icon** next to "Project Overview" and go to **Project settings**.
4.  In the "General" tab, scroll down to the "Your apps" section.
5.  If you haven't created a web app yet, click the **</>** icon to add one. Follow the steps, giving it a nickname.
6.  Once you have a web app, select it.
7.  Choose **"Config"** to view the `firebaseConfig` object. It will look like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:12345..."
    };
    ```
8.  Open your `.env.local` file and copy the values from the `firebaseConfig` object into the corresponding `NEXT_PUBLIC_...` fields. For example, the `apiKey` value goes into `NEXT_PUBLIC_FIREBASE_API_KEY`.

#### B. Server-Side Admin Credentials (Secret)

These are for the Firebase Admin SDK, which runs on the server to perform privileged operations like reading all user data. This requires a **single, base64-encoded** environment variable.

1.  In your Firebase **Project settings**, go to the **"Service accounts"** tab.
2.  Click the **"Generate new private key"** button. A warning will appear; confirm by clicking **"Generate key"**.
3.  A **JSON file** will be downloaded to your computer (e.g., `my-project-firebase-adminsdk.json`). **Keep this file secure and do not commit it to Git.**

4.  **CRITICAL STEP: Encode the entire JSON file to Base64.** This is a common point of error. The result should be a single, long string of text.
    *   **Online Tool (Easy):** Go to a site like [base64encode.org](https://www.base64encode.org/), choose "Encode files", upload your downloaded JSON file, and copy the resulting encoded string.
    *   **Command Line (macOS/Linux):**
        ```bash
        # Replace the path with the actual path to your key file
        base64 -i /path/to/your/downloaded-key-file.json
        ```
    *   **Command Line (Windows PowerShell):**
        ```powershell
        # Replace with the actual path and pipes the output to your clipboard
        [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\\path\\to\\your\\key.json")) | Set-Clipboard
        ```

5.  **Set the Environment Variable**: Open your `.env.local` file. Paste the single, long, encoded string as the value for `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64`. It should look like this:
    ```
    FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64=ZXlKb2RI...your-very-long-encoded-string...JrZCI6IiJ9
    ```

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
3.  Add each of the `NEXT_PUBLIC_` variables from your `.env.local` file.
4.  Add the **single** `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64` variable, pasting the same long, base64-encoded string you used locally.
5.  Ensure all variables are enabled for the **Production** environment (and Preview, if desired).
6.  **Redeploy** your application. The new build will now have access to the credentials and will be able to connect to Firebase.
