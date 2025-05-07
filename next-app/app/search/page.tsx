"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, redirect } from "next/navigation";
import ProductGrid from "@/components/product-grid"
import type { Product } from "@/lib/types";
import { useAuth } from "@/app/context/AuthContext"
import { Search, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  if(!isLoggedIn){
      redirect("/login")
  }

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuestion, setSearchQuestion] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialQuery) fetchResults(initialQuery);
  }, [initialQuery]);

  async function fetchResults(query: string) {
    setIsSearching(true);
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        "https://lionswap.onrender.com/search",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Modify the results to ensure all items are shown as available
      const modifiedResults = data.results.map((item: Product) => ({
        ...item,
        isAvailable: true // Force all items to be available regardless of their actual status
      }));
      
      setResults(modifiedResults);
      window.history.replaceState({}, "", `?q=${encodeURIComponent(query)}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchResults(searchQuestion);
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6 text-blue-800 flex items-center gap-3">
            <Search className="h-8 w-8 text-blue-600 bg-blue-100 p-1 rounded-lg" />
            Search Results
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                value={searchQuestion}
                onChange={(e) => setSearchQuestion(e.target.value)}
                className="pl-10 bg-gray-50 border-blue-100 focus:border-blue-300 w-full"
                placeholder="Search for items..."
              />
            </div>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {isSearching ? (
            <div className="py-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-blue-800 font-medium">Searching for items...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-blue-200 mb-4" />
              <h2 className="text-2xl font-bold text-blue-800 mb-3">No items found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any items matching your search. Try different keywords or browse categories.
              </p>
              <Link href="/browse">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse all items
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-800">
                  {results.length} {results.length === 1 ? 'item' : 'items'} found
                </h2>
                <Link href="/browse" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Browse all categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ProductGrid products={results} />
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-bold mb-3 text-blue-800">Search Tips</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Use specific keywords like brand names or model numbers
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Try searching by category (e.g., "textbooks", "electronics")
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Can't find what you're looking for? Check back later or post a "wanted" item
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}