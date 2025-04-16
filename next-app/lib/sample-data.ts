import type { User, Product } from "./types"

export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    username: "alexj",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    ratings: [
      {
        reviewer: "Sarah P.",
        stars: 5,
        comment: "Great seller! Item was exactly as described and shipping was fast.",
        date: "2 weeks ago",
      },
      {
        reviewer: "Mike T.",
        stars: 4,
        comment: "Good communication and fair price.",
        date: "1 month ago",
      },
    ],
  },
  {
    id: "user2",
    name: "Jamie Smith",
    username: "jamies",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    ratings: [
      {
        reviewer: "Chris D.",
        stars: 5,
        comment: "Awesome seller! Would buy from again.",
        date: "3 days ago",
      },
    ],
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: "Introduction to Economics Textbook",
    price: 45.0,
    description: "Used textbook for ECON1001. Some highlighting but in good condition. 10th edition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "textbooks",
    condition: "good",
    status: "active",
    seller: {
      id: "user1",
      name: "Alex Johnson",
    },
  },
  {
    id: 2,
    name: "MacBook Air 2021",
    price: 750.0,
    description: "M1 MacBook Air, 8GB RAM, 256GB SSD. Includes charger and protective case.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    condition: "like_new",
    status: "active",
    seller: {
      id: "user2",
      name: "Jamie Smith",
    },
  },
  {
    id: 3,
    name: "Columbia University Hoodie",
    price: 25.0,
    description: "Official Columbia University hoodie, size medium. Worn a few times but still in great condition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "clothing",
    condition: "good",
    status: "active",
    seller: {
      id: "user1",
      name: "Alex Johnson",
    },
  },
  {
    id: 4,
    name: "Desk Lamp",
    price: 15.0,
    description: "Adjustable desk lamp, perfect for dorm rooms. LED bulb included.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "dorm",
    condition: "good",
    status: "active",
    seller: {
      id: "user2",
      name: "Jamie Smith",
    },
  },
  {
    id: 5,
    name: "Calculus Early Transcendentals",
    price: 50.0,
    description: "8th edition, James Stewart. Used for MATH1101. Minor wear on cover.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "textbooks",
    condition: "good",
    status: "active",
    seller: {
      id: "user1",
      name: "Alex Johnson",
    },
  },
  {
    id: 6,
    name: "Wireless Headphones",
    price: 80.0,
    description: "Sony WH-1000XM3 Noise Cancelling Headphones. Great condition with carrying case.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    condition: "good",
    status: "active",
    seller: {
      id: "user2",
      name: "Jamie Smith",
    },
  },
  {
    id: 7,
    name: "Columbia Lions Basketball Jersey",
    price: 35.0,
    description: "Official Columbia Lions basketball jersey, size large. Like new condition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "clothing",
    condition: "like_new",
    status: "active",
    seller: {
      id: "user1",
      name: "Alex Johnson",
    },
  },
  {
    id: 8,
    name: "Mini Refrigerator",
    price: 65.0,
    description: "Compact refrigerator, perfect for dorm rooms. 2.7 cubic feet with freezer compartment.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "dorm",
    condition: "good",
    status: "sold",
    seller: {
      id: "user2",
      name: "Jamie Smith",
    },
  },
]
