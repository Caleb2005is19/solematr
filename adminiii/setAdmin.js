const admin = require('firebase-admin');

// IMPORTANT: Replace with the actual path to your service account key file.
// Make sure this file is in the same folder as this script.
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// IMPORTANT: Paste the UID you copied from the Firebase Console here.
const uid = 'Vtnw3S8CXDgPUtbbg7W7LDfV2uv2';

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
