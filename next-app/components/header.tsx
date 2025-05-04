"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import axios from "axios"

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [numNotifs, setNumNotifs] = useState(0)
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsMobileSearchVisible(false)
    }
  }

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible)
  }

  useEffect(() => {
    async function fetchNumNotifs() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/notifications/num", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setNumNotifs(response.data.num)
      } catch (err: any) {
        console.log("fetch number of notifications (TypeScript) error", err.response?.data || err.message);
        setNumNotifs(0)
      }
    }
    if (isLoggedIn) {
      fetchNumNotifs()
    }
  }, [isLoggedIn]);

  return (
    <header className="border-b">
      {/* Main header row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex-shrink-0">
            LionSwap
          </Link>

          {/* Desktop search bar */}
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

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {isLoggedIn ? (
            <>
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-2 relative"
                >
                  <Bell className="h-5 w-5" />
                  {(numNotifs > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {numNotifs}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/cart" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : null}

          <Link href="/features" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              About
            </Button>
          </Link>

          {isLoggedIn ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:block"
              onClick={() => {
                setIsLoggedIn(false); 
                localStorage.removeItem("token"); 
                setTimeout(() => {router.push("/login");}, 10);
              }}
            >
              Log out
            </Button>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          <Link href="/listings/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base px-2 md:px-4">
              <span className="hidden sm:inline">List an item</span>
              <span className="sm:hidden">List</span>
            </Button>
          </Link>

          <Link href={`/personal`}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 md:h-10 md:w-10 p-0 overflow-hidden border-2 border-blue-100 hover:border-blue-300"
            >
              <Image
                src={"/blank-pfp.webp"}
                alt={"Profile"}
                width={40}
                height={40}
                className="object-cover"
              />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile search bar - conditionally rendered */}
      {isMobileSearchVisible && (
        <div className="container mx-auto px-4 py-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-full pl-10 pr-10 rounded-full bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              autoFocus
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={toggleMobileSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Category navigation */}
      <nav className="container mx-auto px-4 py-2 overflow-x-auto">
        <ul className="flex space-x-8 min-w-max">
          {[
            ["Textbooks", "Textbooks"],
            ["Electronics", "Electronics"],
            ["Furniture", "Furniture"],
            ["Clothing", "Clothing"],
            ["Accessories", "Accessories"],
            ["Dorm Essentials", "Dorm Essentials"],
            ["Sports", "Sports"],
            ["Event Tickets", "Event Tickets"],
            ["Other", "Other"],
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