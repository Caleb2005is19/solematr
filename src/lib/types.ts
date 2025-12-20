export type Shoe = {
  id: string; // This will be the slug
  name: string;
  brand: string;
  style: string; // e.g. 'Running', 'Casual'
  price: number;
  description: string;
  images: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  }[];
  sizes: number[];
  reviews: {
    id: number;
    rating: number;
    text: string;
    author: string;
    date: string;
  }[];
  gender: 'Men' | 'Women' | 'Unisex';
  category: string; // e.g. 'Streetwear', 'Formal'
  type: 'Sneakers' | 'Shoes'; // Main grouping
  isOnSale?: boolean;
};

export type CartItem = {
  shoeId: string;
  name: string;
  price: number;
  image: {
    url: string;
    alt: string;
  };
  quantity: number;
  size: number;
};
