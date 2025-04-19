"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { users } from "@/lib/sample-data" // Import users from your sample data

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  // For demo purposes, we'll use the first user as the "logged in" user
  // In a real app, you would get this from your auth state
  const currentUser = users[0]
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LionSwap
          </Link>
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anything"
                className="w-[300px] pl-10 rounded-full bg-muted/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          {/* Updated Bell icon with notification count and link */}
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="ghost" size="sm">
              Sign up
            </Button>
          </Link>
          <Link href="/listings/new">
            <Button className="bg-blue-600 hover:bg-blue-700">List an item</Button>
          </Link>
          
          {/* Profile Button - Moved to the far right */}
          <Link href={currentUser ? `/profile/${currentUser.username}` : "/login"}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-10 w-10 p-0 overflow-hidden border-2 border-blue-100 hover:border-blue-300"
            >
              {currentUser ? (
                <Image
                  src={"/blank-pfp.webp"}
                  alt={currentUser.username}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </Link>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-2 overflow-x-auto">
        <ul className="flex space-x-8 min-w-max">
          <li>
            <Link href="/category/textbooks" className="text-sm hover:text-blue-600">
              Textbooks
            </Link>
          </li>
          <li>
            <Link href="/category/electronics" className="text-sm hover:text-blue-600">
              Electronics
            </Link>
          </li>
          <li>
            <Link href="/category/furniture" className="text-sm hover:text-blue-600">
              Furniture
            </Link>
          </li>
          <li>
            <Link href="/category/clothing" className="text-sm hover:text-blue-600">
              Clothing
            </Link>
          </li>
          <li>
            <Link href="/category/accessories" className="text-sm hover:text-blue-600">
              Accessories
            </Link>
          </li>
          <li>
            <Link href="/category/dorm" className="text-sm hover:text-blue-600">
              Dorm Essentials
            </Link>
          </li>
          <li>
            <Link href="/category/sports" className="text-sm hover:text-blue-600">
              Sports
            </Link>
          </li>
          <li>
            <Link href="/category/tickets" className="text-sm hover:text-blue-600">
              Event Tickets
            </Link>
          </li>
          <li>
            <Link href="/category/other" className="text-sm hover:text-blue-600">
              Other
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}