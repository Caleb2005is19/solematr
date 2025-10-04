export type Shoe = {
  id: string;
  name: string;
  brand: string;
  style: string;
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
