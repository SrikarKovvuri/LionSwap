export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/product-grid';
import {
  Sparkles,
  BookOpen,
  Laptop,
  Shirt,
  ArrowRight,
} from 'lucide-react';
import type { Product } from '@/lib/types';

async function getListings(): Promise<Product[]> {
  try {
    const firstCategory = "Textbooks";
    const secondCategory = "Electronics";
    const thirdCategory = "Furniture";
    
    // Added cache-busting timestamp query parameter
    const timestamp = new Date().getTime();
        
    const firstResponse = await axios.get<{ listings: Product[] }>(
      `https://lionswap.onrender.com/listings/category/${encodeURIComponent(firstCategory)}?t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    const secondResponse = await axios.get<{ listings: Product[] }>(
      `https://lionswap.onrender.com/listings/category/${encodeURIComponent(secondCategory)}?t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    const thirdResponse = await axios.get<{ listings: Product[] }>(
      `https://lionswap.onrender.com/listings/category/${encodeURIComponent(thirdCategory)}?t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );
    
    // Correctly access the data from the response objects
    const textbookListings = firstResponse.data.listings || [];
    const electronicsListings = secondResponse.data.listings || [];
    const furnitureListings = thirdResponse.data.listings || [];

    const combinedListings = [...textbookListings, ...electronicsListings, ...furnitureListings];
    
    return combinedListings;
  } catch (err: any) {
    console.error(
      'getListings(TypeScript) error',
      err.response?.data || err.message
    );
    return [];
  }
}

export default async function Home() {
  const listings = await getListings();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-24 relative">
          <div className="absolute -top-12 left-1/4 w-20 h-20 rounded-full bg-blue-300 opacity-10 blur-xl" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-blue-400 opacity-10 blur-xl" />

          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-10 md:p-12 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3 blur-3xl" />

            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="mb-10 md:mb-0 md:mr-8 text-white max-w-xl">
                <div className="flex items-center gap-3 mb-6 bg-white/10 px-4 py-2 rounded-full inline-block">
                  <Sparkles className="h-5 w-5 text-yellow-200" />
                  <span className="font-medium">Columbia University's Official Marketplace</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  The Marketplace Made For Columbia Students
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Buy and sell second-hand items within the Columbia community with zero commissions,
                  instant exchanges, and seamless access.
                </p>

                <div className="flex gap-4">
                  <Link href="/listings/new">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
                      List an item
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" className="bg-blue-700/30 text-white border-white/30 hover:bg-blue-700/50 px-6 py-6 rounded-xl text-lg font-medium transform transition-all duration-300 hover:-translate-y-1">
                      Browse items
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-2/5 relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl transform -rotate-6" />
                <div className="relative bg-white rounded-2xl p-3 shadow-2xl transform transition-all duration-500 hover:rotate-1">
                  <Image
                    src="/products.png"
                    alt="Columbia students trading items"
                    width={500}
                    height={500}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exactly what you need from your fellow Columbia students.
            </p>
          </div>

          {/* Textbooks Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-800">Textbooks</h2>
              </div>
              <Link href="/category/Textbooks" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100">
              <ProductGrid
                products={listings.filter((p) => p.category === 'Textbooks').slice(0, 4)}
              />
            </div>
          </section>

          {/* Electronics Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Laptop className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-800">Electronics</h2>
              </div>
              <Link href="/category/Electronics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100">
              <ProductGrid
                products={listings.filter((p) => p.category === 'Electronics').slice(0, 4)}
              />
            </div>
          </section>

          {/* Furniture Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Shirt className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-800">Furniture</h2>
              </div>
              <Link href="/category/Furniture" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100">
              <ProductGrid
                products={listings.filter((p) => p.category === 'Furniture').slice(0, 4)}
              />
            </div>
          </section>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl shadow-lg border border-blue-100 text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Ready to join LionSwap?</h2>
            <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
              Join hundreds of Columbia students already buying and selling on campus with
              zero fees.
            </p>
            <Link href="/listings/new">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 border-t border-gray-100">
          <p>© 2025 LionSwap • Made for Columbia and Barnard Students</p>
        </div>
      </div>
    </div>
  );
}