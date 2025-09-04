'use client';
import Link from "next/link";
import Image from "next/image";
import { Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useState } from "react";
import axios from "axios";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PersonalProductGridProps {
  products: Product[];
  onProductUpdate: () => void; // Callback to refresh the product list
}

export default function PersonalProductGrid({ products, onProductUpdate }: PersonalProductGridProps) {
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: 'sold' | 'delete' | null }>({});

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

  const handleMarkAsSold = async (productId: number) => {
    setLoadingStates(prev => ({ ...prev, [productId]: 'sold' }));
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://lionswap.onrender.com/listings/${productId}/mark-sold`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Refresh the product list
      onProductUpdate();
    } catch (error: any) {
      console.error("Error marking item as sold:", error);
      console.error("Response data:", error.response?.data);
      alert(`Failed to mark item as sold: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleDelete = async (productId: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
    
    if (!isConfirmed) return;
    
    setLoadingStates(prev => ({ ...prev, [productId]: 'delete' }));
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://lionswap.onrender.com/listings/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Refresh the product list
      onProductUpdate();
    } catch (error: any) {
      console.error("Error deleting item:", error);
      console.error("Response data:", error.response?.data);
      alert(`Failed to delete item: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: null }));
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100">
          <Link href={`/listings/${product.id}`} className="block relative">
            <div className="aspect-square relative overflow-hidden">
              {(product.isAvailable === false) && (
                <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white text-base font-extrabold px-3 py-2 rounded shadow-md transform rotate-0">
                  SOLD
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title || "Product image"}
                  fill
                  unoptimized={true} // Key fix: prevent Next.js from optimizing external images
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
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
            <div className="flex justify-between items-baseline mb-3">
              <p className="font-bold text-blue-700">${product.price.toFixed(2)}</p>
              {product.condition && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3" />
                  <span>{formatCondition(product.condition)}</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons - Only show for available items */}
            {product.isAvailable && (
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkAsSold(product.id);
                  }}
                  disabled={loadingStates[product.id] === 'sold'}
                  className="flex-1 bg-orange-300 hover:bg-orange-400 text-white text-xs py-2 px-3 rounded-md transition-colors"
                  size="sm"
                >
                  {loadingStates[product.id] === 'sold' ? 'Marking...' : 'Mark Sold'}
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(product.id);
                  }}
                  disabled={loadingStates[product.id] === 'delete'}
                  className="flex-1 bg-red-300 hover:bg-red-400 text-white text-xs py-2 px-3 rounded-md transition-colors"
                  size="sm"
                >
                  {loadingStates[product.id] === 'delete' ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 