'use server';

import { adminDb } from "@/lib/firebase-admin";

/**
 * Server Action to securely fetch the list of all orders.
 * This action runs only on the server, using the 'firebase-admin' SDK.
 */
export async function getAdminOrders() {
    if (!adminDb) {
        return { error: "Admin SDK not initialized. Cannot fetch orders." };
    }
    try {
        const ordersSnapshot = await adminDb.collectionGroup('orders').get();
        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // The data contains timestamps which are not serializable by default.
        // We need to manually convert them or handle them on the client.
        // For simplicity, we'll let the client handle it if needed, but be aware.
        // A more robust solution would convert them here.
        return { orders: JSON.parse(JSON.stringify(orders)) };

    } catch (error: any) {
        console.error("Server Action error fetching orders:", error.message);
        return { error: "You do not have permission to view orders or an internal error occurred." };
    }
}

    