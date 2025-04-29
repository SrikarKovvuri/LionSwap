import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import axios from "axios";


async function getListings() {
  try{
    const results = await axios.get('https://lionswap.onrender.com/listings', {});
    return results.data.listings;
  }
  catch (err: any) {
    console.error("getListings(TypeScript) error", err.response?.data || err.message);
    return []
  }
}

export default async function Home() {
  const listings = await getListings()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-blue-50 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h1 className="text-3xl font-bold mb-4">Columbia&apos;s Marketplace for Students</h1>
            <p className="text-lg mb-6">Buy and sell second-hand items within the Columbia community with LionSwap.</p>
            <div className="flex gap-4">
              <Link href="/listings/new">
                <Button className="bg-blue-600 hover:bg-blue-700">List an item</Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline">Browse items</Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Image
              src="/LionSwapLogo2.png"
              alt="Columbia students trading items"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Textbooks</h2>
          <Link href="/category/Textbooks" className="text-blue-600 hover:underline">
            See all
          </Link>
        </div>
        <ProductGrid products={listings.filter((p: { category: string; }) => p.category === "Textbooks").slice(0, 4)} />
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Electronics</h2>
          <Link href="/category/Electronics" className="text-blue-600 hover:underline">
            See all
          </Link>
        </div>
        <ProductGrid products={listings.filter((p: { category: string; }) => p.category === "Electronics").slice(0, 4)} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Clothing</h2>
          <Link href="/category/Clothing" className="text-blue-600 hover:underline">
            See all
          </Link>
        </div>
        <ProductGrid products={listings.filter((p: { category: string; }) => p.category === "Clothing").slice(0, 4)} />
      </section>
    </div>
  )
}
