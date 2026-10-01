export interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface ProductItemImage {
  imageId: string;
  imageUrl: string;
  imageText: string;
}

export interface ProductItem {
  itemId: string;
  name: string;
  images: ProductItemImage[];
  sellers?: Array<{
    commertialOffer?: {
      Price: number;
      ListPrice: number;
      AvailableQuantity: number;
    };
  }>;
}

export interface Product {
  productId: string;
  productTitle: string;
  brand: string;
  linkText: string;
  categories: string[];
  description?: string;
  items: ProductItem[];
}
