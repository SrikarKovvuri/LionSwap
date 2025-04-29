import axios from "axios";
import ProductGrid from "@/components/product-grid"
import type { Product } from "@/lib/types";

async function getListings(): Promise<Product[]>  {
    try{
      const results = await axios.get('https://lionswap.onrender.com/listings', {});
      return results.data.listings;
    }
    catch (err: any) {
      console.error("getListings(TypeScript) error", err.response?.data || err.message);
      return []
    }
  }


export default async function SearchPage() {
  const results = await getListings()

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Items</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <ProductGrid products={results} />
      )}
    </main>
  );
}
