'use client';
import Link from "next/link";
import Image from "next/image";
import { Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Convert condition to user-friendly format
  const formatCondition = (condition?: string) => {
    if (!condition) return "";
    switch(condition) {
      case "new": return "New";
      case "like_new": return "Like New";
      case "good": return "Good";
      case "fair": return "Fair";
      case "poor": return "Poor";
      default: return condition; 
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group relative block overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          {!product.isAvailable && (
            <div className="absolute top-2 right-2 bg-hearty-orange text-white px-2 py-1 rounded-md text-xs font-bold z-10">
              SOLD
            </div>
          )}

          <div className="relative h-48 bg-gray-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            {product.category}
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {product.title}
            </h3>
            <p className="mt-1 text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            {product.condition && (
              <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {formatCondition(product.condition)}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}