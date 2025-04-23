import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AddToCartButton from "@/components/ui/addToCartButton"
import { notFound } from "next/navigation"
import { Product } from "@/lib/types"
import axios from "axios"


interface ProductPageProps {
  params: {
    id: number
  }
}


async function getListingById(id: number): Promise<Product | null>{
  try{
    const results = await axios.get(`http://localhost:5000/listings/${id}`, {});
    return results.data.listing;
  }
  catch (err: any) {
    console.error("getListing(TypeScript) error", err.response?.data || err.message);
    return null
  }
}

export default async function ProductPage(props: ProductPageProps) {

  // Await props.params before destructuring
  const params = await props.params;
  const { id } = params;
  
  const product = await getListingById(Number(id));

  if (!product) {
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
        </div>

        <div className="md:w-1/2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-bold mb-2">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-6">+ Buyer Protection Fee</p>

            <div className="flex gap-4 mb-6">
              <AddToCartButton itemId={product.id} itemName={product.title} itemPrice={product.price} itemImage={product.imageUrl} itemCategory={product.category}/>
              <Button variant="outline" className="flex-1">
                Make offer
              </Button>
            </div>

            <Button className="w-full mb-2 bg-blue-600 hover:bg-blue-700">Buy now</Button>

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

          <div className="border-t pt-6">
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
