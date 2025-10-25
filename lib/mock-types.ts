export interface ProductMock {
  id: number;
  name: string;
  description: string;
  prices: ProductPrices;
  images: ProductImage[];
  categories: ProductCategory[];
  stock_availability: ProductStock;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPrices {
  price: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductCategory {
  name: string;
}

export interface ProductStock {
  text: string;
  class: string;
}
