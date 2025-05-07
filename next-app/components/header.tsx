"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, User, Menu, X, Tag, BookOpen, Laptop, Shirt, Home, Award, Ticket, Package } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    if (!isMobileSearchVisible) {
      setIsMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      setIsMobileSearchVisible(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setTimeout(() => {
      router.push("/login");
    }, 10);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  useEffect(() => {
    async function fetchNumNotifs() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://lionswap.onrender.com/notifications/num", {
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

  // Category icons mapping
  const categoryIcons = {
    "Textbooks": <BookOpen className="h-4 w-4" />,
    "Electronics": <Laptop className="h-4 w-4" />,
    "Furniture": <Home className="h-4 w-4" />,
    "Clothing": <Shirt className="h-4 w-4" />,
    "Accessories": <Award className="h-4 w-4" />,
    "Dorm Essentials": <Home className="h-4 w-4" />,
    "Event Tickets": <Ticket className="h-4 w-4" />,
    "Other": <Package className="h-4 w-4" />
  };

  const categories = [
    ["Textbooks", "Textbooks"],
    ["Electronics", "Electronics"],
    ["Furniture", "Furniture"],
    ["Clothing", "Clothing"],
    ["Accessories", "Accessories"],
    ["Dorm Essentials", "Dorm"],
    ["Sports", "Sports"],
    ["Event Tickets", "Tickets"],
    ["Other", "Other"],
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            {/* Coded Logo */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center rounded-lg px-4 py-2 shadow-md">
              <div className="flex items-center">
                <span className="text-white font-bold text-xl">Lion</span>
                <span className="text-white font-bold text-xl">Swap</span>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1 text-white"
                >
                  <path 
                    d="M7.5 21L3 16.5M16.5 3L21 7.5M11.39 7.5L3 16.5L7.5 21L16.5 11.39M11.39 7.5L12.85 6.15C13.2905 5.7095 13.8748 5.45544 14.485 5.43266C15.0952 5.40988 15.6958 5.62076 16.165 6.015L16.5 6.25C16.9308 6.61223 17.213 7.1159 17.2949 7.66264C17.3768 8.20939 17.2527 8.76647 16.949 9.222L16.5 10L11.39 7.5Z" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Desktop search bar */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-[300px] pl-10 rounded-full border-blue-100 focus:border-blue-300 bg-blue-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 relative hover:bg-blue-50"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {(numNotifs > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {numNotifs}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            <Link href="/features">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-gray-600">
                About
              </Button>
            </Link>

            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="hover:bg-blue-50 text-gray-600"
              >
                Log out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-gray-600">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-gray-600">
                    Sign up
                  </Button>
                </Link>
              </>
            )}

            <Link href="/listings/new">
              <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
                List an item
              </Button>
            </Link>

            <Link href={`/personal`}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 p-0 overflow-hidden border-2 border-blue-100 hover:border-blue-300"
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
      </div>

      {/* Mobile search bar - conditionally rendered */}
      {isMobileSearchVisible && (
        <div className="container mx-auto px-4 py-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-full pl-10 pr-10 rounded-full border-blue-100 focus:border-blue-300 bg-blue-50"
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

      {/* Mobile menu - conditionally rendered */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-4">
            <Link href="/listings/new" className="block">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                List an item
              </Button>
            </Link>
            
            <div className="space-y-2">
              <Link href="/personal" className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <span>Profile</span>
              </Link>
              
              {isLoggedIn && (
                <Link href="/notifications" className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Notifications</span>
                  {(numNotifs > 0) && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                      {numNotifs}
                    </span>
                  )}
                </Link>
              )}
              
              <Link href="/features" className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600" />
                <span>About</span>
              </Link>
              
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg w-full text-left"
                >
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Log out</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Log in</span>
                  </Link>
                  <Link href="/signup" className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Sign up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile logo - small screen only */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex justify-center py-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center rounded-lg px-4 py-2">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg">LionSwap</span>
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 text-white"
              >
                <path 
                  d="M7.5 21L3 16.5M16.5 3L21 7.5M11.39 7.5L3 16.5L7.5 21L16.5 11.39M11.39 7.5L12.85 6.15C13.2905 5.7095 13.8748 5.45544 14.485 5.43266C15.0952 5.40988 15.6958 5.62076 16.165 6.015L16.5 6.25C16.9308 6.61223 17.213 7.1159 17.2949 7.66264C17.3768 8.20939 17.2527 8.76647 16.949 9.222L16.5 10L11.39 7.5Z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Category navigation */}
      <nav className="bg-white border-t border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-2 overflow-x-auto">
          <ul className="flex space-x-6 min-w-max">
            {categories.map(([label, slug], index) => (
              <li key={slug}>
                <Link 
                  href={`/category/${slug}`} 
                  className="text-sm hover:text-blue-600 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  {categoryIcons[label as keyof typeof categoryIcons]}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}