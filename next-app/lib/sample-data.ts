import type { User, Product, Order, Notification, CartItem } from "./types"

export const users: User[] = [
  {
    id: 1,
    username: "alexj",
    password: "hashedpassword1",
    timestamp: "2025-03-15T10:30:00Z"
  },
  {
    id: 2,
    username: "jamies",
    password: "hashedpassword2",
    timestamp: "2025-03-18T14:45:00Z"
  }
]

export const products: Product[] = [
  {
    id: 1,
    title: "Introduction to Economics Textbook",
    price: 45.0,
    description: "Used textbook for ECON1001. Some highlighting but in good condition. 10th edition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Textbooks",
    condition: "good",
    isAvailable: true,
    timestamp: "2025-04-01T09:15:00Z",
    sellerId: 1,
    sellerUsername: "alexj",
  },
  {
    id: 2,
    title: "MacBook Air 2021",
    price: 750.0,
    description: "M1 MacBook Air, 8GB RAM, 256GB SSD. Includes charger and protective case.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
    condition: "like_new",
    isAvailable: true,
    timestamp: "2025-04-02T11:30:00Z",
    sellerId: 2,
    sellerUsername: "jamies",
  },
  {
    id: 3,
    title: "Columbia University Hoodie",
    price: 25.0,
    description: "Official Columbia University hoodie, size medium. Worn a few times but still in great condition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
    condition: "good",
    isAvailable: true,
    timestamp: "2025-04-03T14:20:00Z",
    sellerId: 1,
    sellerUsername: "alexj",
  },
  {
    id: 4,
    title: "Desk Lamp",
    price: 15.0,
    description: "Adjustable desk lamp, perfect for dorm rooms. LED bulb included.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Dorm Essentials",
    condition: "good",
    isAvailable: true,
    timestamp: "2025-04-04T16:45:00Z",
    sellerId: 2,
    sellerUsername: "jamies",
  },
  {
    id: 5,
    title: "Calculus Early Transcendentals",
    price: 50.0,
    description: "8th edition, James Stewart. Used for MATH1101. Minor wear on cover.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Textbooks",
    condition: "good",
    isAvailable: true,
    timestamp: "2025-04-05T10:10:00Z",
    sellerId: 1,
    sellerUsername: "alexj",
  },
  {
    id: 6,
    title: "Wireless Headphones",
    price: 80.0,
    description: "Sony WH-1000XM3 Noise Cancelling Headphones. Great condition with carrying case.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
    condition: "good",
    isAvailable: true,
    timestamp: "2025-04-06T13:25:00Z",
    sellerId: 2,
    sellerUsername: "jamies",
  },
  {
    id: 7,
    title: "Columbia Lions Basketball Jersey",
    price: 35.0,
    description: "Official Columbia Lions basketball jersey, size large. Like new condition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Clothing",
    condition: "like_new",
    isAvailable: true,
    timestamp: "2025-04-07T09:50:00Z",
    sellerId: 1,
    sellerUsername: "alexj",
  },
  {
    id: 8,
    title: "Mini Refrigerator",
    price: 65.0,
    description: "Compact refrigerator, perfect for dorm rooms. 2.7 cubic feet with freezer compartment.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "Dorm Essentials",
    condition: "good",
    isAvailable: false,
    timestamp: "2025-04-08T15:35:00Z",
    sellerId: 2,
    sellerUsername: "jamies",
  }
]

export const orders: Order[] = [
  {
    id: 1,
    buyerId: 2,
    productId: 5,
    timestamp: "2025-04-15T13:45:00Z",
    status: "completed"
  },
  {
    id: 2,
    buyerId: 1,
    productId: 8,
    timestamp: "2025-04-16T14:45:00Z",
    status: "completed"
  }
]

export const notifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: "message",
    title: "New message from Jamie Smith",
    message: "Hey, is the textbook still available?",
    timestamp: "2025-04-17T10:30:00Z",
    read: false,
    actionUrl: "/messages/jamies",
    senderId: 2,
    itemImage: "/placeholder.svg"
  },
  {
    id: 2,
    userId: 1,
    type: "offer",
    title: "New offer on 'Calculus Early Transcendentals'",
    message: "Jamie has made an offer of $40 for your textbook.",
    timestamp: "2025-04-17T08:15:00Z",
    read: false,
    actionUrl: "/listings/offers/1",
    senderId: 2,
    productId: 5,
    itemImage: "/placeholder.svg"
  },
  {
    id: 3,
    userId: 1,
    type: "purchase",
    title: "Your item has been purchased!",
    message: "Jamie has purchased your 'Intro to Psychology' textbook for $25.",
    timestamp: "2025-04-16T14:45:00Z",
    read: true,
    actionUrl: "/sales/123",
    senderId: 2,
    productId: 9,
    itemImage: "/placeholder.svg"
  },
  {
    id: 4,
    userId: 1,
    type: "system",
    title: "Welcome to LionSwap!",
    message: "Start buying and selling items within the Columbia community today.",
    timestamp: "2025-04-15T09:00:00Z",
    read: true,
    actionUrl: "/getting-started",
    itemImage: "/placeholder.svg"
  },
  {
    id: 5,
    userId: 1,
    type: "price_drop",
    title: "Price drop alert!",
    message: "A Samsung monitor you viewed has dropped in price by $20.",
    timestamp: "2025-04-15T11:30:00Z",
    read: false,
    actionUrl: "/product/monitor123",
    productId: 10,
    itemImage: "/placeholder.svg"
  },
  {
    id: 6,
    userId: 2,
    type: "message",
    title: "New message from Alex Johnson",
    message: "Thanks for your interest! Yes, the textbook is still available.",
    timestamp: "2025-04-17T11:15:00Z",
    read: false,
    actionUrl: "/messages/alexj",
    senderId: 1,
    itemImage: "/placeholder.svg"
  },
  {
    id: 7,
    userId: 2,
    type: "system",
    title: "Your listing is about to expire",
    message: "Your 'Dorm Desk Lamp' listing will expire in 3 days. Consider refreshing it.",
    timestamp: "2025-04-16T16:00:00Z",
    read: true,
    actionUrl: "/listings/my-listings",
    productId: 4,
    itemImage: "/placeholder.svg"
  },
  {
    id: 8,
    userId: 2,
    type: "purchase",
    title: "Purchase successful!",
    message: "You've successfully purchased 'Calculus Textbook' from Alex.",
    timestamp: "2025-04-15T13:45:00Z",
    read: true,
    actionUrl: "/purchases/456",
    senderId: 1,
    productId: 5,
    itemImage: "/placeholder.svg"
  }
];

export const cartItems: CartItem[] = [
  {
    id: 1,
    userId: 1, // Note: interfaces defines this as string but userId elsewhere is number
    productId: 1,
    title: "Introduction to Economics Textbook",
    price: 45.0,
    image: "/placeholder.svg?height=400&width=400",
    timestamp: "2025-04-17T09:30:00Z"
  },
  {
    id: 2,
    userId: 1, 
    productId: 5,
    title: "Calculus Early Transcendentals",
    price: 50.00,
    image: "/placeholder.svg",
    timestamp: "2025-04-17T09:32:00Z"
  }
]