"use client"
import { useAuth } from "@/app/context/AuthContext"
import { redirect } from "next/navigation"

export default function CheckoutPage() {
    const { isLoggedIn } = useAuth()

    if(!isLoggedIn){
        redirect("/login")
    }

    return (
        <div>CheckoutPage</div>
    )
}