
import type { Shoe } from './types';
import { getAdminDb, getAdminAuth } from './firebase-admin';
import { notFound } from 'next/navigation';

const DB_ERROR_MESSAGE =
  'CRITICAL: Firebase Admin SDK is not initialized. This typically means the `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64` environment variable is missing or invalid. The application cannot fetch server-side data. See README.md for setup instructions.';

/**
 * Fetches shoes from the Firestore 'shoes' collection.
 * This function is for SERVER-SIDE use only.
 */
export async function getShoes(filters?: { type?: string; category?: string; brand?: string; style?: string; size?: string; gender?: string; onSale?: boolean }): Promise<Shoe[]> {
  try {
    const adminDb = getAdminDb();
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('shoes');

    if (filters) {
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }
        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }
        if (filters.brand) {
            query = query.where('brand', '==', filters.brand);
        }
        if (filters.style) {
            query = query.where('style', '==', filters.style);
        }
        if (filters.size) {
            query = query.where('sizes', 'array-contains', Number(filters.size));
        }
        if (filters.gender) {
            query = query.where('gender', '==', filters.gender);
        }
        if (filters.onSale) {
            query = query.where('isOnSale', '==', filters.onSale);
        }
    }

    const snapshot = await query.get();
    
    if (snapshot.empty) {
        return [];
    }

    const shoes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        reviews: data.reviews || [],
        ...data
      } as Shoe;
    });

    return shoes;
  } catch (error) {
    console.error("Error fetching shoes from Firestore:", (error as Error).message);
    throw new Error(`Failed to fetch shoes from Firestore. The database might be misconfigured or the Admin SDK credentials may be invalid. Reason: ${(error as Error).message}`);
  }
}

/**
 * Fetches a single shoe by its ID (slug) from Firestore.
 * This function is for SERVER-SIDE use only.
 */
export async function getShoeBySlug(slug: string): Promise<Shoe | null> {
  try {
    const adminDb = getAdminDb();
    const docRef = adminDb.collection('shoes').doc(slug);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      notFound();
    }
    
    const data = docSnap.data();
    return {
        id: docSnap.id,
        reviews: data?.reviews || [],
        ...data
    } as Shoe;
  } catch (error) {
    console.error(`Error fetching shoe with slug ${slug}:`, error);
    notFound();
  }
}

/**
 * Fetches a single shoe by its ID from Firestore, throwing a 404 if not found.
 * This function is for SERVER-SIDE use only.
 */
export async function getShoeById(id: string): Promise<Shoe | null> {
    const shoe = await getShoeBySlug(id);
    return shoe;
}


async function getDistinctFieldValues(field: string): Promise<string[]> {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb.collection('shoes').select(field).get();
        if (snapshot.empty) return [];
        
        const valueSet = new Set<string>();
        snapshot.docs.forEach(doc => {
            const value = doc.data()[field];
            if(value) {
                valueSet.add(value);
            }
        });
        return Array.from(valueSet);
    } catch (error) {
        console.error(`Error fetching distinct values for field ${field}:`, error);
        throw new Error(`Failed to fetch distinct values for field ${field}. Reason: ${(error as Error).message}`);
    }
}

export async function getAllBrands(): Promise<string[]> {
    return getDistinctFieldValues('brand');
}

export async function getAllStyles(): Promise<string[]> {
    return getDistinctFieldValues('style');
}

export async function getAllGenders(): Promise<string[]> {
    return getDistinctFieldValues('gender');
}

export async function getAllSizes(): Promise<number[]> {
    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb.collection('shoes').select('sizes').get();
        if (snapshot.empty) return [];
        
        const valueSet = new Set<number>();
        snapshot.docs.forEach(doc => {
            const sizes = doc.data().sizes;
            if (Array.isArray(sizes)) {
                sizes.forEach(size => valueSet.add(size));
            }
        });
        return Array.from(valueSet).sort((a,b) => a - b);
    } catch (error) {
        console.error(`Error fetching distinct sizes:`, error);
        throw new Error(`Failed to fetch distinct sizes. Reason: ${(error as Error).message}`);
    }
}


export async function getCategoryDetails(type: string, category: string) {
    const details = {
        sneakers: {
            streetwear: {
                title: 'Streetwear Sneakers',
                description: 'Discover the latest in urban fashion with our collection of streetwear sneakers. Featuring bold designs from top brands, these kicks are perfect for making a statement. Find your perfect pair to rock in Nairobi and beyond.'
            },
            running: {
                title: 'Running Sneakers',
                description: 'Elevate your performance with our range of running sneakers. Engineered for comfort, speed, and durability, these shoes will help you conquer your next run, whether it\'s through Karura Forest or on the city pavement.'
            },
            basketball: {
                title: 'Basketball Sneakers',
                description: 'Dominate the court with high-performance basketball sneakers. Our collection offers superior grip, ankle support, and responsive cushioning to help you play at your peak.'
            },
            default: {
                 title: 'All Sneakers',
                 description: 'From classic kicks to the latest drops, explore our entire collection of sneakers. Find the perfect pair for any occasion, combining style, comfort, and performance.'
            }
        },
        shoes: {
            formal: {
                title: 'Formal Shoes',
                description: 'Step up your style with our collection of elegant formal shoes. Perfect for business meetings, weddings, or any special occasion, these shoes are crafted from premium materials for a sophisticated look.'
            },
            boots: {
                title: 'Durable Boots',
                description: 'Ready for any adventure, our boots are built to last. From rugged hiking boots to stylish city boots, find the perfect pair that offers both durability and comfort for Kenyan terrain.'
            },
            casual: {
                title: 'Casual Shoes',
                description: 'Discover the perfect everyday shoe in our casual collection. Combining comfort and laid-back style, these shoes are your go-to for weekend outings, coffee dates, and everything in between.'
            },
            default: {
                 title: 'All Shoes',
                 description: 'Browse our diverse range of shoes for every style and need. From formal elegance to casual comfort, find high-quality footwear that fits your life.'
            }
        },
    } as const;

    const safeType = type.toLowerCase() as keyof typeof details;
    const safeCategory = category?.toLowerCase() as keyof typeof details[keyof typeof details];

    if (details[safeType]) {
        if (safeCategory && details[safeType][safeCategory]) {
            // @ts-ignore
            return details[safeType][safeCategory];
        }
        return details[safeType].default;
    }
    
    return { title: 'All Products', description: 'Explore our full range of high-quality footwear.' };
}

type AppUser = {
  id: string;
  email: string | null;
  displayName: string | null;
};

export async function getAdminUsers(): Promise<AppUser[]> {
    try {
        const adminAuth = getAdminAuth();
        const userRecords = await adminAuth.listUsers();
        return userRecords.users.map(user => ({
            id: user.uid,
            email: user.email || null,
            displayName: user.displayName || null,
        }));
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        throw new Error("You do not have permission to list users or the Admin SDK is not configured correctly.");
    }
}
