/**
 * Shared types for EcoFinds
 */

export type Category =
  | "Electronics"
  | "Fashion"
  | "Home"
  | "Books"
  | "Toys"
  | "Sports"
  | "Other";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}
export interface AuthLoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number; // cents
  imageUrl: string; // placeholder or external URL
  sellerId: string;
  createdAt: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  category: Category;
  price: number; // cents
  imageUrl: string;
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

export interface ListingsQuery {
  search?: string;
  category?: Category | "";
}

export interface CartItem {
  listingId: string;
  addedAt: number;
}

export interface PurchaseItem {
  id: string; // unique purchase id
  listing: Listing;
  purchasedAt: number;
}

export interface CheckoutResponse {
  purchases: PurchaseItem[];
}

export interface DemoResponse {
  message: string;
}
