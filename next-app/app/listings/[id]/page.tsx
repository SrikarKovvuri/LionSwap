// app/listings/[id]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/ui/addToCartButton"
import { notFound } from "next/navigation"
import { Product } from "@/lib/types"
import BuyNowContact from "@/components/BuyNowContact"
import { ArrowLeft, Tag, Clock, Star, User } from "lucide-react"

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getListingById(id: string): Promise<Product | null> {
  const res = await fetch(`https://lionswap.onrender.com/listings/${id}`, {
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
    // this will show Next.js' 404 page
    notFound()
  }

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

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link href="/browse" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to browsing
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-white rounded-2xl shadow-lg p-6">
          <div className="md:w-1/2">
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-blue-200/10 backdrop-blur-sm transform -rotate-2 rounded-xl"></div>
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Meta Information */}
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium text-sm">
                <Tag className="h-4 w-4" />
                {product.category}
              </div>
              
              {/* Condition Badge */}
              {product.condition && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm">
                  <Star className="h-4 w-4" />
                  {formatCondition(product.condition)}
                </div>
              )}
            </div>
            
            {/* Keep the commented out code section as is */}
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
              <h1 className="text-3xl font-bold mb-4 text-blue-900">{product.title}</h1>
              <p className="text-3xl font-bold mb-4 text-blue-700">${product.price.toFixed(2)}</p>
              {/* <p className="text-sm text-gray-500 mb-6">+ Buyer Protection Fee</p> */} 

              {product.isAvailable ? 
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
                  
                  <div className="mb-6">
                    <BuyNowContact sellerUsername={product.sellerUsername} />
                  </div>
                </>
                ) : (
                  <div className="bg-orange-500 text-white font-bold text-lg text-center px-4 py-2 rounded-lg w-40 shadow-md">
                    SOLD
                  </div>
                )
              }

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

            <div className="border-t border-blue-100 pt-4">
              <h2 className="font-bold mb-3 text-blue-800 text-lg">Description</h2>
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>

              <Link href={`/profile/${product.sellerUsername}`}>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">{product.sellerUsername}</p>
                    <p className="text-sm text-gray-500">Columbia Student</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 shadow-md mb-8">
          <h2 className="text-lg font-bold mb-3 text-blue-800">Trading Safely on Campus</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Meet in public locations on campus during daylight hours
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Verify the item condition before completing the transaction
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              Report any suspicious listings to LionSwap moderation team
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}