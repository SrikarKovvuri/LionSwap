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
  id: string
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
