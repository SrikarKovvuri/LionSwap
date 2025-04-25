"use client"
import CartClient from "@/components/cartClient"
import { useAuth } from "@/app/context/AuthContext"
import { redirect } from "next/navigation"

export default function ShoppingCart() {
  const { isLoggedIn, setIsLoggedIn } = useAuth()

  if(!isLoggedIn){
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <CartClient></CartClient>
    </div>
  );
}
