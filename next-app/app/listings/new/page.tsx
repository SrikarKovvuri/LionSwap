"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, redirect } from "next/navigation"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/AuthContext"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import type { User } from "@/lib/types";

export default function NewListingPage() {
  const router = useRouter()
  const { isLoggedIn, user, refetchUser} = useAuth()
  const [stripeOnboardUrl, setStripeOnboardUrl] = useState<string | null>(null)
  const [loadingOnboard, setLoadingOnboard] = useState(false);
  
  if(!isLoggedIn){
    redirect("/login")
  }

  useEffect(() => {
    if (user && !user.stripe_account_id) {
      setLoadingOnboard(true);
      const token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:5000/onboard",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          // send them into Stripe Express flow
          window.location.href = res.data.url;
        })
        .catch((err) => {
          console.error("Onboarding failed", err);
          alert("Could not start Stripe onboarding. Please try again.");
        });
    }
  }, [user]);

  // 3) While onboarding, show a loader
  if (loadingOnboard || (user && !user.stripe_account_id)) {
    return (
      <div className="p-8 text-center">
        <p>Redirecting you to connect your Stripe account…</p>
      </div>
    );
  }

  // -- form state --
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [price, setPrice] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // -- handlers --
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const urls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    )
    setImages((prev) => [...prev, ...urls])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("You must be logged in")

      const payload = {
        title,
        description,
        category,
        condition,
        price: parseFloat(price),
        // for now we only send one image:
        image_url: images[0] ?? "",
      }

      await axios.post("http://localhost:5000/listings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      router.push("/")
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      alert(err.response?.data?.error || "Failed to create listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">List an item</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Photos --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Photos</h2>
          <p className="text-sm text-gray-500">
            Add up to 12 photos. The first image will be the cover (drag to
            reorder).
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, i) => (
              <div
                key={i}
                className="aspect-square relative border rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {images.length < 12 && (
              <label className="aspect-square flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add photo</span>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* --- Details --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Details</h2>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Textbooks">Textbooks</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Dorm">Dorm Essentials</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Tickets">Event Tickets</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={condition}
              onValueChange={setCondition}
              required
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like_new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- Pricing --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pricing</h2>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.currentTarget.value)}
            required
          />
        </div>

        {/* --- Submit --- */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Listing…" : "List item"}
        </Button>
      </form>
    </div>
  )
}


