import Image from "next/image"
import Link from "next/link"
import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/sample-data"
import { notFound } from "next/navigation"
import ProductGrid from "@/components/product-grid"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2">
          <div className="relative aspect-square mb-4">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square relative">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover rounded-md cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">New! Updated 1m ago</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-6">+$0.69 Buyer Protection fee</p>

            <div className="flex gap-4 mb-6">
              <Button className="flex-1">Add to cart</Button>
              <Button variant="outline" className="flex-1">
                Make offer
              </Button>
            </div>

            <Button className="w-full mb-2 bg-blue-600 hover:bg-blue-700">Buy now</Button>

            <div className="text-center text-sm text-gray-500 mb-6">or</div>

            <Button variant="outline" className="w-full mb-6">
              <Image src="/placeholder.svg?height=20&width=80" alt="PayPal" width={80} height={20} />
            </Button>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>0 Likes</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-bold mb-2">Description</h2>
            <p className="text-sm text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Seller avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{product.seller.name}</p>
                <p className="text-sm text-gray-500">Columbia University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Similar items</h2>
          <Link href={`/category/${product.category}`} className="text-blue-600 hover:underline">
            See all
          </Link>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  )
}
