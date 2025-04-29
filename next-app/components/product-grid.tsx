'use client';

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden group">
          <Link href={`/listings/${product.id}`} className="block relative">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.imageUrls[0] || "/placeholder.svg"}
                alt={product.title || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="p-3">
            <Link href={`/listings/${product.id}`} className="block">
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
              <p className="font-bold">${product.price.toFixed(2)}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
