import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import { notFound } from "next/navigation"
import { Product } from "@/lib/types"
import axios from "axios";


// Props type for the page component
type CategoryPageProps = {
  params: {
    category: string;
  };
};

async function getListings(category: string): Promise<Product[]> {
  try{
    const results = await axios.get(`http://localhost:5000/listings/category/${category}`, {});
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{decodeURIComponent(category)}</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">{categoryProducts.length} items found</p>
      </div>
      
      <ProductGrid products={categoryProducts} />
      
      <div className="mt-12 text-center">
        <Link href="/listings/new">
          <Button className="bg-blue-600 hover:bg-blue-700">List an item</Button>
        </Link>
      </div>
    </div>
  );
}