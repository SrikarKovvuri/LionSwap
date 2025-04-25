"use client"
import { useAuth } from "@/app/context/AuthContext"
import { redirect } from "next/navigation"

export default function CheckoutPage() {
    const { isLoggedIn, setIsLoggedIn } = useAuth()

    if(!isLoggedIn){
        redirect("/login")
    }

    return (
        <div>CheckoutPage</div>
    )
}