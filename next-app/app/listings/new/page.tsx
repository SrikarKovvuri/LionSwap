"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter, redirect } from "next/navigation";
import { Camera, Plus, Upload, Tag, DollarSign, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NewListingPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, user } = useAuth();

  // ─── Local state ─────────────────────────────────────────────────────
  const [loadingOnboard, setLoadingOnboard] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  //two below are what we gonna use to send a form to flask to manually store the blobs
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
   // we need a ref to clear the file input if user "Remove"s the image
   const fileInputRef = useRef<HTMLInputElement>(null);
  // ─── Wait for auth to initialize ─────────────────────────────────────
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-blue-100 rounded mb-2"></div>
          <div className="h-4 w-36 bg-blue-50 rounded"></div>
        </div>
      </div>
    </div>;
  }

  // ─── Redirect to login if not authenticated ─────────────────────────
  if (!isLoggedIn) {
    redirect("/login");
    return null;
  }

  // ─── If we're mid-onboarding, show a loader and bail ────────────────
  if (loadingOnboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-800 font-medium">Redirecting you to connect your Stripe account…</p>
        </div>
      </div>
    );
  }

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
  /*
  stripe stuff, we'll add this later date
    // 1) Onboard if they've never connected
    if (user && !user.stripe_account_id) {
      setLoadingOnboard(true)
      try {
        const token = localStorage.getItem("token")
        const { data } = await axios.post(
          "http://localhost:5000/onboard",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // only redirect if Stripe actually gave you a URL
        if (data.url) {
          window.location.href = data.url
          return  // bail out, they're off to Stripe
        } else {
          // already onboarded → fall through to listing step
          setLoadingOnboard(false)
        }
      } catch (err) {
        console.error("Onboarding failed", err)
        alert("Could not start Stripe onboarding. Please try again.")
        setLoadingOnboard(false)
        setIsSubmitting(false)
        return
      }
    }
  */
  
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("You must be logged in")
      
        // build FormData
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("category", category);
      form.append("condition", condition);
      form.append("price", price);
      if (file) {
        form.append("image", file);
      }

      await axios.post(
        "https://lionswap.onrender.com/listings", form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
           // not setting file type because axios assumes multipart boundary => "Content-Type": "application/json",
          },
        }
      )
      router.push("/") 
      alert("Your item has successfully been added");         // you're done, go home
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      alert(err.response?.data?.error || "Failed to create listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── The actual form ─────────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-8 text-blue-800 flex items-center gap-3">
            <Plus className="h-8 w-8 text-blue-600 bg-blue-100 p-1 rounded-lg" />
            List an item
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* --- Photos --- */}
            <div className="space-y-4 bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">Photo</h2>
              </div>
              <p className="text-gray-600 mb-4">Add a clear photo of your item to attract buyers</p>
              <div className="flex flex-col items-center">
                {preview ? (
                  <div className="relative w-full max-w-md aspect-square mb-4 rounded-xl overflow-hidden shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-3 right-3 rounded-lg shadow-md"
                      onClick={clearImage}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="w-full max-w-md aspect-square flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-white rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <Upload className="h-16 w-16 text-blue-400 mb-4" />
                    <span className="text-blue-600 font-medium mb-1">Upload photo</span>
                    <span className="text-sm text-gray-500">Click to browse files</span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* --- Details --- */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">Details</h2>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <Label htmlFor="title" className="text-blue-800 font-medium mb-2 block">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  required
                  className="bg-gray-50 border-blue-100 focus:border-blue-300"
                  placeholder="e.g. MacBook Pro 2023"
                />
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <Label htmlFor="description" className="text-blue-800 font-medium mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  className="min-h-[120px] bg-gray-50 border-blue-100 focus:border-blue-300"
                  placeholder="Describe your item's condition, features, and any other relevant details"
                  required
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm flex-1">
                  <Label htmlFor="category" className="text-blue-800 font-medium mb-2 block">Category</Label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger id="category" className="bg-gray-50 border-blue-100">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Textbooks">Textbooks</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Dorm Essentials">Dorm Essentials</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Event Tickets">Event Tickets</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm flex-1">
                  <Label htmlFor="condition" className="text-blue-800 font-medium mb-2 block">Condition</Label>
                  <Select
                    value={condition}
                    onValueChange={setCondition}
                    required
                  >
                    <SelectTrigger id="condition" className="bg-gray-50 border-blue-100">
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
            </div>

            {/* --- Pricing --- */}
            <div className="space-y-4 bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">Pricing</h2>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <Label htmlFor="price" className="text-blue-800 font-medium mb-2 block">Price ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.currentTarget.value)}
                    className="pl-8 bg-gray-50 border-blue-100 focus:border-blue-300"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Set a competitive price to sell your item quickly</p>
              </div>
            </div>

            {/* --- Submit --- */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Listing your item..." : "List item now"}
              </Button>
              
              <p className="text-center text-gray-500 mt-4 text-sm">
                By listing an item, you agree to LionSwap's Terms & Conditions
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}