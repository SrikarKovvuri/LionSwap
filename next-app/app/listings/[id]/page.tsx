// app/listings/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/ui/addToCartButton"
import { notFound } from "next/navigation"
import { Product } from "@/lib/types"
// import ProductGrid from "@/components/product-grid"  <-- you already have this
import BuyNowContact from "@/components/BuyNowContact"
interface ProductPageProps {
  params: {
    id: string
  }
}

async function getListingById(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:5000/listings/${id}`, {
    cache: "no-store"  // optional: always fetch fresh
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error fetching listing: ${res.statusText}`)
  const json = await res.json()
  return json.listing as Product
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getListingById(id)

  if (!product) {
    // this will show Next.js’ 404 page
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2">
          <div className="relative aspect-square mb-4">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {

            
  /* 
  temporary for launch
  <div className="grid grid-cols-5 gap-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="aspect-square relative">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={`${product.title} thumbnail ${i + 1}`}
          fill
          className="object-cover rounded-md cursor-pointer"
        />
      </div>
    ))}
  </div>
  */
}
        </div>

        <div className="md:w-1/2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-bold mb-2">${product.price.toFixed(2)}</p>
           {/* <p className="text-sm text-gray-500 mb-6">+ Buyer Protection Fee</p> */} 

            {product.isAvailable? 
            (<>
              <div className="flex gap-4 mb-6">
                {/* <AddToCartButton itemId={product.id} itemName={product.title} itemPrice={product.price} itemImage={product.imageUrl} itemCategory={product.category}/>
                <Link href={`/profile/${product.sellerUsername}`}>
                  <Button variant="outline" className="flex-1">
                    Make offer
                  </Button>
                </Link>
                */}
              </div>
              
            
              <BuyNowContact sellerUsername={product.sellerUsername} />
              </>
            ) : (
              <div className="bg-orange-500 text-white font-bold text-lg text-center px-4 py-2 rounded-md w-40 shadow-md">
                SOLD
              </div>
            )}


            {/* <div className="text-center text-sm text-gray-500 mb-6">or</div>

            <Button variant="outline" className="w-full mb-6">
              <Image src="/placeholder.svg?height=20&width=80" alt="PayPal" width={80} height={20} />
            </Button> */}

            {/* <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>0 Likes</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div> */}
          </div>

          <div className="border-t">
            <h2 className="font-bold mb-2">Description</h2>
            <p className="text-sm text-gray-700 mb-6">{product.description}</p>

            <Link href={`/profile/${product.sellerUsername}`}>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Seller avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{product.sellerUsername}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
