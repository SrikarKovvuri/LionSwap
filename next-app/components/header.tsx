"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { users as rawUsers } from "@/lib/sample-data"

// Define exactly the fields we expect on a "demo" user
type DemoUser = {
  username: string
  avatarUrl?: string
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Cast your imported sample‑data into our DemoUser shape
  const currentUser = (rawUsers[0] as unknown) as DemoUser

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-[300px] pl-10 rounded-full bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/notifications">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 relative"
            >
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

          <Link href={currentUser ? `/profile/${currentUser.username}` : "/login"}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 p-0 overflow-hidden border-2 border-blue-100 hover:border-blue-300"
            >
              {currentUser?.avatarUrl ? (
                <Image
                  src={currentUser.avatarUrl}
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
          {[
            ["Textbooks", "textbooks"],
            ["Electronics", "electronics"],
            ["Furniture", "furniture"],
            ["Clothing", "clothing"],
            ["Accessories", "accessories"],
            ["Dorm Essentials", "dorm"],
            ["Sports", "sports"],
            ["Event Tickets", "tickets"],
            ["Other", "other"],
          ].map(([label, slug]) => (
            <li key={slug}>
              <Link href={`/category/${slug}`} className="text-sm hover:text-blue-600">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
