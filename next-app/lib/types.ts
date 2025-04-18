export interface User {
  id: number
  username: string
  password: string
  timestamp: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  condition: string
  imageUrl: string
  timestamp: string
  isAvailable: boolean
  category: "Textbooks" | "Electronics" | "Furniture" | "Clothing" | "Accessories" | "Dorm Essentials" | "Sports" | "Event Tickets" | "Other"
  //status: "active" | "sold" | "reserved"
  sellerId: number
}

export interface Order {
  id: number
  buyerId: number
  productId: number
  timestamp: string
  status: string
}

export interface Notification {
  id: number;
  userId: number;  // ID of the user receiving the notification
  type: "message" | "offer" | "purchase" | "price_drop" | "system";
  title: string;
  message: string;
  timestamp: string;  // ISO format date string
  read: boolean;
  actionUrl?: string;
  senderId?: number;  // ID of the user sending the notification (if applicable)
  productId?: number;  // ID of the related product (if applicable)
  itemImage?: string;
}

export interface CartItem {
  id: number;
  title: string;
  userId: string;
  productId: number;
  price: number;
  image: string;
  timestamp: string;
}