"use client"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden group">
          <Link href={`/listings/${product.id}`} className="block relative">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                // Add to favorites logic here
              }}
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to favorites</span>
            </Button> */}
          </Link>
          <div className="p-3">
            <Link href={`/listings/${product.id}`} className="block">
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
              <p className="font-bold">${product.price.toFixed(2)}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
