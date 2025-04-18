"use client"
import type React from "react"
import axios from "axios";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera } from "lucide-react"
export default function NewListingPage() {
  const router = useRouter();

  const [images, setImages]         = useState<string[]>([]);
  const [title, setTitle]           = useState("");
  const [description, setDesc]      = useState("");
  const [category, setCategory]     = useState("");
  const [condition, setCondition]   = useState("");
  const [price, setPrice]           = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      /* send only the first image URL for now */
      const payload = {
        title,
        description,
        category,
        condition,
        price: Number(price),
        image_url: images[0] ?? "",
      };

      await axios.post("http://localhost:5000/listings", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      /* go back to homepage (or wherever you like) */
      router.push("/");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Listing failed – see console");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* …everything else in the form stays identical…                         */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* …photo section…                                                     */}
        {/* …details section… */}
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        {/* adapt Select components to lift values into state */}
        <Select value={category} onValueChange={setCategory} required> … </Select>
        <Select value={condition} onValueChange={setCondition} required> … </Select>

        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(parseFloat(e.target.value) || 0)
          }
          required
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Listing…" : "List item"}
        </Button>
      </form>
    </div>
  );
}
