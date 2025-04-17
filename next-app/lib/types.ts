export interface User {
  id: string
  name: string
  username: string
  avatarUrl: string
  ratings: Rating[]
}

export interface Rating {
  reviewer: string
  stars: number
  comment: string
  date: string
}

export interface Product {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  condition: string
  status: "active" | "sold" | "reserved"
  seller: {
    id: string
    name: string
  }
}

export interface Notification {
  id: string;
  userId: string;  // ID of the user receiving the notification
  type: "message" | "offer" | "purchase" | "price_drop" | "system";
  title: string;
  message: string;
  timestamp: string;  // ISO format date string
  read: boolean;
  actionUrl?: string;
  senderId?: string;  // ID of the user sending the notification (if applicable)
  productId?: string;  // ID of the related product (if applicable)
  itemImage: string;
}