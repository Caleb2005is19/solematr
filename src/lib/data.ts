import type { Shoe } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // A more graceful fallback for missing images
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
    style: 'Running',
    price: 120.00,
    description: 'Experience timeless comfort and style with the Classic Runner. Built for daily wear, it features a cushioned sole and a breathable upper, making it your perfect companion for both morning jogs and casual outings.',
    images: [getImage('classic-runner-1'), getImage('classic-runner-2')],
    sizes: [7, 8, 9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Incredibly comfortable and stylish. I wear them everywhere!', author: 'Alex D.', date: '2023-05-15' },
      { id: 2, rating: 4.5, text: 'Great for running, very supportive.', author: 'Sam B.', date: '2023-04-22' },
    ],
    gender: 'Unisex',
    category: 'Athletic'
  },
  {
    id: 'high-top-sneaker',
    name: 'High-Top Sneaker',
    brand: 'Apex',
    style: 'Casual',
    price: 150.00,
    description: 'Make a statement with the Apex High-Top Sneaker. Its bold design and premium materials offer a modern urban look, while the ankle support provides extra comfort and stability for all-day wear.',
    images: [getImage('high-top-sneaker-1'), getImage('high-top-sneaker-2')],
    sizes: [8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 5, text: 'Love the look and feel of these. So many compliments!', author: 'Jessie R.', date: '2023-06-01' },
      { id: 2, rating: 5, text: 'The quality is top-notch. Worth every penny.', author: 'Mike T.', date: '2023-05-28' },
    ],
    gender: 'Unisex',
    category: 'Streetwear'
  },
  {
    id: 'suede-loafer',
    name: 'Suede Loafer',
    brand: 'Elegance',
    style: 'Formal',
    price: 180.00,
    description: 'Step into sophistication with the Elegance Suede Loafer. Crafted from genuine suede and featuring a classic silhouette, this loafer is the epitome of smart-casual, perfect for the office or a night out.',
    images: [getImage('suede-loafer-1'), getImage('suede-loafer-2')],
    sizes: [9, 10, 11, 12, 13],
    reviews: [
      { id: 1, rating: 4, text: 'Very classy and comfortable for long events.', author: 'Charles P.', date: '2023-03-19' },
    ],
    gender: 'Men',
    category: 'Classic'
  },
  {
    id: 'leather-boot',
    name: 'Leather Boot',
    brand: 'Endurance',
    style: 'Boots',
    price: 250.00,
    description: 'Brave any element with the Endurance Leather Boot. Made with waterproof leather and a rugged outsole, these boots are designed for durability and comfort, whether you\'re on a trail or navigating city streets.',
    images: [getImage('leather-boot-1'), getImage('leather-boot-2')],
    sizes: [8, 9, 10, 11, 12, 13],
    reviews: [
      { id: 1, rating: 5, text: 'The best boots I\'ve ever owned. Sturdy and comfortable.', author: 'Ben L.', date: '2023-01-10' },
      { id: 2, rating: 5, text: 'Perfect for hiking and they look great too.', author: 'Kara S.', date: '2022-12-05' },
    ],
    gender: 'Unisex',
    category: 'Outdoor'
  },
  {
    id: 'sport-sandal',
    name: 'Sport Sandal',
    brand: 'Trek',
    style: 'Sandal',
    price: 75.00,
    description: 'Embrace the outdoors with the Trek Sport Sandal. Featuring adjustable straps for a secure fit and a contoured footbed for arch support, it\'s the ideal choice for warm-weather adventures.',
    images: [getImage('sport-sandal-1'), getImage('sport-sandal-2')],
    sizes: [7, 8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 4, text: 'Super comfy for walking around all day.', author: 'Maria G.', date: '2023-07-11' },
    ],
    gender: 'Unisex',
    category: 'Outdoor'
  },
  {
    id: 'urban-explorer',
    name: 'Urban Explorer',
    brand: 'Apex',
    style: 'Casual',
    price: 165.00,
    description: 'The Urban Explorer combines futuristic design with practical comfort. Its lightweight frame and responsive sole make it ideal for navigating the modern cityscape with ease and style.',
    images: [getImage('urban-explorer-1'), getImage('urban-explorer-2')],
    sizes: [8, 9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Feels like walking on clouds. The design is sick!', author: 'Leo F.', date: '2023-06-25' },
      { id: 2, rating: 4, text: 'Good looking shoe, but took a day to break in.', author: 'Nina K.', date: '2023-06-20' },
    ],
    gender: 'Unisex',
    category: 'Streetwear'
  },
  {
    id: 'vintage-wingtip',
    name: 'Vintage Wingtip',
    brand: 'Elegance',
    style: 'Formal',
    price: 220.00,
    description: 'A nod to classic menswear, the Vintage Wingtip features intricate brogue detailing and a polished leather finish. A timeless addition to any formal wardrobe.',
    images: [getImage('vintage-wingtip-1'), getImage('vintage-wingtip-2')],
    sizes: [9, 10, 11, 12],
    reviews: [
      { id: 1, rating: 5, text: 'Absolutely stunning craftsmanship.', author: 'Arthur M.', date: '2023-02-14' },
    ],
    gender: 'Men',
    category: 'Classic'
  },
  {
    id: 'canvas-slip-on',
    name: 'Canvas Slip-On',
    brand: 'Nova',
    style: 'Casual',
    price: 85.00,
    description: 'Effortless style meets everyday comfort. The Nova Canvas Slip-On is your go-to for relaxed weekends, featuring a durable canvas upper and a flexible sole for easy wear.',
    images: [getImage('canvas-slipon-1')],
    sizes: [7, 8, 9, 10, 11],
    reviews: [
      { id: 1, rating: 5, text: 'My favorite summer shoes. So easy to wear.', author: 'Chloe T.', date: '2023-07-02' },
      { id: 2, rating: 4, text: 'Comfortable and versatile.', author: 'David S.', date: '2023-06-15' },
    ],
    gender: 'Unisex',
    category: 'Lifestyle'
  },
];

// Simulate API calls with a delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getShoes(): Promise<Shoe[]> {
  await apiDelay(500);
  return JSON.parse(JSON.stringify(shoes));
}

export async function getShoeById(id: string): Promise<Shoe | undefined> {
  await apiDelay(500);
  const shoe = shoes.find(shoe => shoe.id === id);
  return shoe ? JSON.parse(JSON.stringify(shoe)) : undefined;
}
