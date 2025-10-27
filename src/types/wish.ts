export interface Wish {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
}

export type SortByDate = 'newest' | 'oldest';
export type SortByPrice = "priceLow" | "priceHigh";