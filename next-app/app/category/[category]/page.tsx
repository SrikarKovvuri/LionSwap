import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import { products } from "@/lib/sample-data"
import { notFound } from "next/navigation"
import axios from "axios";
import { ArrowLeft, Package, Plus, Tag } from "lucide-react";

// Props type for the page component
type CategoryPageProps = {
  params: {
    category: string;
  };
};

async function getListings(category: string) {
  try{
    const results = await axios.get(`https://lionswap.onrender.com/listings/category/${category}`, {});
    return results.data.listings;
  }
  catch (err: any) {
    console.error("getListings(TypeScript) error", err.response?.data || err.message);
    return []
  }
}

export default async function CategoryPage(props: CategoryPageProps) {

  const params = await props.params;
  const { category } = params;
  
  const categoryProducts = await getListings(category);
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Category header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-blue-800">{decodeURIComponent(category)}</h1>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <p className="text-blue-700 font-medium">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'} found
            </p>
          </div>
          
          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <div className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-blue-200 mb-4" />
              <h2 className="text-2xl font-bold text-blue-800 mb-3">No items found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any items in this category. Be the first to list something!
              </p>
            </div>
          )}
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Have something to sell?</h2>
          <p className="mb-6 max-w-md mx-auto opacity-90">
            List your items for free and connect with buyers from the Columbia community.
          </p>
          <Link href="/listings/new">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
              <Plus className="mr-2 h-5 w-5" />
              List an item
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate static paths for common categories
export async function generateStaticParams() {
  // Get unique categories from your products data
  const categories = [...new Set(products.map(product => product.category))];
  
  return categories.map(category => ({
    category,
  }));
}