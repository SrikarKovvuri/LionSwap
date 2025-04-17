// app/categories/[category]/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import { products } from "@/lib/sample-data"
import { notFound } from "next/navigation"

// Props type for the page component
type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  // Get the category from the URL
  const category = params.category;
  
  // Format category for display (capitalize first letter)
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Filter products by the category
  const categoryProducts = products.filter(product => product.category === category);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{formattedCategory}</h1>
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

// Generate static paths for common categories
export async function generateStaticParams() {
  // Get unique categories from your products data
  const categories = [...new Set(products.map(product => product.category))];
  
  return categories.map(category => ({
    category,
  }));
}