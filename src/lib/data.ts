import type { Shoe } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    return {
      id: 'not-found',
      url: 'https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found',
      alt: 'Image not found',
      hint: 'placeholder',
    };
  }
  return {
    id: image.id,
    url: image.imageUrl,
    alt: image.description,
    hint: image.imageHint,
  };
}

const shoes: Shoe[] = [
  {
    id: 'classic-runner',
    name: 'Classic Runner',
    brand: 'Nova',
    type: 'Sneakers',
    category: 'Running',
    style: 'Running', // Legacy, can be mapped from category
    price: 120.00,
    description: 'Experience timeless comfort and style with the Classic Runner. Built for daily wear, it features a cushioned sole and a breathable upper, making it your perfect companion for both morning jogs and casual outings. This versatile sneaker is perfect for the active individual in Nairobi, providing support on city streets and park trails alike.',
    images: [getImage('classic-runner-1'), getImage('classic-runner-2')],
    sizes: [7, 8, 9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Incredibly comfortable and stylish. I wear them everywhere!', author: 'Alex D.', date: '2023-05-15' },
      { id: 2, rating: 4.5, text: 'Great for running, very supportive.', author: 'Sam B.', date: '2023-04-22' },
    ],
    gender: 'Unisex',
  },
  {
    id: 'high-top-sneaker',
    name: 'High-Top Sneaker',
    brand: 'Apex',
    type: 'Sneakers',
    category: 'Streetwear',
    style: 'Casual', // Legacy
    price: 150.00,
    isOnSale: true,
    description: 'Make a statement with the Apex High-Top Sneaker. Its bold design and premium materials offer a modern urban look, while the ankle support provides extra comfort and stability for all-day wear. A favorite among the fashion-forward crowd in Kenya.',
    images: [getImage('high-top-sneaker-1'), getImage('high-top-sneaker-2')],
    sizes: [8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 5, text: 'Love the look and feel of these. So many compliments!', author: 'Jessie R.', date: '2023-06-01' },
      { id: 2, rating: 5, text: 'The quality is top-notch. Worth every penny.', author: 'Mike T.', date: '2023-05-28' },
    ],
    gender: 'Unisex',
  },
  {
    id: 'suede-loafer',
    name: 'Suede Loafer',
    brand: 'Elegance',
    type: 'Shoes',
    category: 'Formal',
    style: 'Formal', // Legacy
    price: 180.00,
    description: 'Step into sophistication with the Elegance Suede Loafer. Crafted from genuine suede and featuring a classic silhouette, this loafer is the epitome of smart-casual, perfect for the office or a night out in Westlands.',
    images: [getImage('suede-loafer-1'), getImage('suede-loafer-2')],
    sizes: [9, 10, 11, 12, 13],
    reviews: [
      { id: 1, rating: 4, text: 'Very classy and comfortable for long events.', author: 'Charles P.', date: '2023-03-19' },
    ],
    gender: 'Men',
  },
  {
    id: 'leather-boot',
    name: 'Leather Boot',
    brand: 'Endurance',
    type: 'Shoes',
    category: 'Boots',
    style: 'Boots', // Legacy
    price: 250.00,
    description: 'Brave any element with the Endurance Leather Boot. Made with waterproof leather and a rugged outsole, these boots are designed for durability and comfort, whether you\'re on a trail up Mt. Kenya or navigating city streets.',
    images: [getImage('leather-boot-1'), getImage('leather-boot-2')],
    sizes: [8, 9, 10, 11, 12, 13],
    reviews: [
      { id: 1, rating: 5, text: 'The best boots I\'ve ever owned. Sturdy and comfortable.', author: 'Ben L.', date: '2023-01-10' },
      { id: 2, rating: 5, text: 'Perfect for hiking and they look great too.', author: 'Kara S.', date: '2022-12-05' },
    ],
    gender: 'Unisex',
  },
  {
    id: 'sport-sandal',
    name: 'Sport Sandal',
    brand: 'Trek',
    type: 'Shoes',
    category: 'Casual',
    style: 'Sandal', // Legacy
    price: 75.00,
    description: 'Embrace the coastal warmth with the Trek Sport Sandal. Featuring adjustable straps for a secure fit and a contoured footbed for arch support, it\'s the ideal choice for warm-weather adventures in Mombasa or Lamu.',
    images: [getImage('sport-sandal-1'), getImage('sport-sandal-2')],
    sizes: [7, 8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 4, text: 'Super comfy for walking around all day.', author: 'Maria G.', date: '2023-07-11' },
    ],
    gender: 'Unisex',
  },
  {
    id: 'urban-explorer',
    name: 'Urban Explorer',
    brand: 'Apex',
    type: 'Sneakers',
    category: 'Streetwear',
    style: 'Casual', // Legacy
    price: 165.00,
    description: 'The Urban Explorer combines futuristic design with practical comfort. Its lightweight frame and responsive sole make it ideal for navigating the modern cityscape of Nairobi with ease and style.',
    images: [getImage('urban-explorer-1'), getImage('urban-explorer-2')],
    sizes: [8, 9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Feels like walking on clouds. The design is sick!', author: 'Leo F.', date: '2023-06-25' },
      { id: 2, rating: 4, text: 'Good looking shoe, but took a day to break in.', author: 'Nina K.', date: '2023-06-20' },
    ],
    gender: 'Unisex',
  },
  {
    id: 'vintage-wingtip',
    name: 'Vintage Wingtip',
    brand: 'Elegance',
    type: 'Shoes',
    category: 'Formal',
    style: 'Formal', // Legacy
    price: 220.00,
    description: 'A nod to classic menswear, the Vintage Wingtip features intricate brogue detailing and a polished leather finish. A timeless addition to any formal wardrobe, perfect for weddings and corporate events.',
    images: [getImage('vintage-wingtip-1'), getImage('vintage-wingtip-2')],
    sizes: [9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Absolutely stunning craftsmanship.', author: 'Arthur M.', date: '2023-02-14' },
    ],
    gender: 'Men',
  },
  {
    id: 'canvas-slip-on',
    name: 'Canvas Slip-On',
    brand: 'Nova',
    type: 'Shoes',
    category: 'Casual',
    style: 'Casual', // Legacy
    price: 85.00,
    description: 'Effortless style meets everyday comfort. The Nova Canvas Slip-On is your go-to for relaxed weekends, featuring a durable canvas upper and a flexible sole for easy wear.',
    images: [getImage('canvas-slipon-1')],
    sizes: [7, 8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 5, text: 'My favorite summer shoes. So easy to wear.', author: 'Chloe T.', date: '2023-07-02' },
      { id: 2, rating: 4, text: 'Comfortable and versatile.', author: 'David S.', date: '2023-06-15' },
    ],
    gender: 'Unisex',
  },
   {
    id: 'performance-basketball',
    name: 'Performance BBall',
    brand: 'Apex',
    type: 'Sneakers',
    category: 'Basketball',
    style: 'Athletic',
    price: 190.00,
    description: 'Designed for explosive power and sharp cuts, the Performance Basketball shoe gives you the edge on the court. Superior grip and lockdown support help you play your best game.',
    images: [getImage('classic-runner-1')], // Placeholder, should be updated
    sizes: [9, 10, 11, 12, 13, 14],
    reviews: [],
    gender: 'Unisex',
  },
];

// Simulate API calls with a delay
const apiDelay = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

export async function getShoes(filters?: { type?: string; category?: string; brand?: string; style?: string; size?: string; gender?: string; onSale?: boolean }): Promise<Shoe[]> {
  await apiDelay();
  let filteredShoes = shoes;

  if (filters) {
    filteredShoes = shoes.filter((shoe) => {
      return (
        (!filters.type || shoe.type.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.category || shoe.category.toLowerCase() === filters.category.toLowerCase()) &&
        (!filters.brand || shoe.brand === filters.brand) &&
        (!filters.style || shoe.style === filters.style) &&
        (!filters.size || shoe.sizes.includes(Number(filters.size))) &&
        (!filters.gender || shoe.gender === filters.gender) &&
        (!filters.onSale || shoe.isOnSale === filters.onSale)
      );
    });
  }

  return JSON.parse(JSON.stringify(filteredShoes));
}


export async function getShoeBySlug(slug: string): Promise<Shoe | undefined> {
  await apiDelay();
  const shoe = shoes.find(shoe => shoe.id === slug);
  return shoe ? JSON.parse(JSON.stringify(shoe)) : undefined;
}


export async function getAllBrands(): Promise<string[]> {
    await apiDelay();
    return [...new Set(shoes.map((shoe) => shoe.brand))];
}

export async function getAllStyles(): Promise<string[]> {
    await apiDelay();
    return [...new Set(shoes.map((shoe) => shoe.style))];
}

export async function getAllSizes(): Promise<number[]> {
    await apiDelay();
    return [...new Set(shoes.flatMap(shoe => shoe.sizes))].sort((a,b) => a - b);
}

export async function getAllGenders(): Promise<string[]> {
    await apiDelay();
    return [...new Set(shoes.map((shoe) => shoe.gender))];
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
