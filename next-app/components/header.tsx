"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import axios from "axios"

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [numNotifs, setNumNotifs] = useState(0)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
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
    if(isLoggedIn){
      fetchNumNotifs()
    }
  }, [isLoggedIn]);

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
          {(isLoggedIn)? (
            <>
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 relative"
              >
                <Bell className="h-5 w-5" />

                {(numNotifs > 0) && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {numNotifs}
                </span>}

              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            </>
            ) : (
            <></>)}

          {(isLoggedIn)? (
            <Button variant="ghost" size="sm" onClick={() => {setIsLoggedIn(false); localStorage.removeItem("token"); setTimeout(() => {router.push("/login");}, 10);}}>
              Log out
            </Button>
            ) : (
            <>
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
            </>)}

          <Link href="/listings/new">
            <Button className="bg-blue-600 hover:bg-blue-700">List an item</Button>
          </Link>

          <Link href={`/personal`}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 p-0 overflow-hidden border-2 border-blue-100 hover:border-blue-300"
            >
              <Image
                src={"/blank-pfp.webp"}
                alt={""}
                width={40}
                height={40}
                className="object-cover"
              />
            </Button>
          </Link>
        </div>
      </div>

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
