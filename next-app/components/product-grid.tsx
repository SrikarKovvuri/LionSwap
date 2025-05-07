import Link from "next/link";
import Image from "next/image";
import { Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100">
          <Link href={`/listings/${product.id}`} className="block relative">
            <div className="aspect-square relative overflow-hidden">
              {!product.isAvailable && (
                <div className="absolute top-0 right-0 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  SOLD
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Category Badge */}
            <div className="absolute bottom-2 left-2 z-10 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{product.category}</span>
            </div>
          </Link>
          
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link href={`/listings/${product.id}`} className="block">
                <h3 className="font-medium text-sm line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors">{product.title}</h3>
              </Link>
            </div>
            
            <div className="flex justify-between items-baseline">
              <p className="font-bold text-blue-700">${product.price.toFixed(2)}</p>
              
              {product.condition && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3" />
                  <span>{formatCondition(product.condition)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}