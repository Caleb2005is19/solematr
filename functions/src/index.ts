/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
initializeApp();

// Production-ready Cloud Function to set a user's role.
export const setUserRole = onCall(async (request) => {
  // 1. Authentication Check: Ensure the user calling the function is authenticated.
  if (!request.auth) {
    logger.warn("setUserRole called by unauthenticated user.");
    throw new HttpsError(
      "unauthenticated",
      "You must be authenticated to call this function."
    );
  }

  // 2. Admin Check: Ensure the user calling the function is already an admin.
  const callerUid = request.auth.uid;
  const callerUserRecord = await getAuth().getUser(callerUid);
  if (callerUserRecord.customClaims?.["admin"] !== true) {
    logger.error(
      `User ${callerUid} is not an admin and tried to call setUserRole.`
    );
    throw new HttpsError(
      "permission-denied",
      "You do not have permission to perform this action."
    );
  }

  // 3. Input Validation: Check if the required parameters are provided.
  const { userId, role } = request.data;
  if (typeof userId !== "string" || typeof role !== "string") {
    logger.error("Invalid arguments for setUserRole:", request.data);
    throw new HttpsError(
      "invalid-argument",
      'The function must be called with two arguments: "userId" and "role", both strings.'
    );
  }

  // 4. Set Custom Claim: Set the custom claim for the target user.
  try {
    await getAuth().setCustomUserClaims(userId, { [role]: true });
    logger.info(
      `Successfully set role '${role}' for user ${userId}, called by admin ${callerUid}.`
    );
    return {
      status: "success",
      message: `Role '${role}' successfully assigned to user ${userId}.`,
    };
  } catch (error) {
    logger.error(`Error setting custom claims for user ${userId}:`, error);
    throw new HttpsError(
      "internal",
      "An internal error occurred while setting the user role."
    );
  }
});
