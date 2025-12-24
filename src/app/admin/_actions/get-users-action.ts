'use server';

import { getAdminUsers as fetchAdminUsers } from "@/lib/data";

/**
 * Server Action to securely fetch the list of all users.
 * This action runs only on the server, preventing the 'firebase-admin' SDK
 * from being exposed to the client.
 */
export async function getAdminUsers() {
    try {
        const users = await fetchAdminUsers();
        return { users };
    } catch (error: any) {
        console.error("Server Action error fetching users:", error.message);
        // It's important to not leak sensitive error details to the client.
        return { error: "You do not have permission to view users or an internal error occurred." };
    }
}
