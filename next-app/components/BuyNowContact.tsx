'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BuyNowContactProps {
  sellerUsername: string
}

export default function BuyNowContact({ sellerUsername }: BuyNowContactProps) {
  const router = useRouter()
  const [contact, setContact] = useState<{email: string, phone: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    // 1️⃣ Check for auth token first
    const token = localStorage.getItem("token")
    if (!token) {
      // not logged in → send them to login
      router.push("/login")
      return
    }

    // 2️⃣ If already fetched, toggle hide
    if (contact) {
      setContact(null)
      return
    }

    // 3️⃣ Otherwise fetch contact info
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://lionswap.onrender.com/users/${sellerUsername}/contact`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setContact({ email: data.email, phone: data.phone })
    } catch (err: any) {
      setError(err.message || "Failed to load contact")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
      >
        {loading
          ? "Loading…"
          : contact
            ? "Hide contact"
            : "Buy now"}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {contact && (
        <div className="p-4 border rounded-md bg-white shadow-md">
          <p className="text-sm">
            <span className="font-semibold">Email:</span>{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span>{" "}
            <a
              href={`tel:${contact.phone}`}
              className="text-blue-600 hover:underline"
            >
              {contact.phone}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
