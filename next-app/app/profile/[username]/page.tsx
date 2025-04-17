import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductGrid from "@/components/product-grid"
import { users, products } from "@/lib/sample-data"
import { notFound } from "next/navigation"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = users.find((u) => u.username === params.username)

  if (!user) {
    notFound()
  }

  const userProducts = products.filter((p) => p.seller.id === user.id)
  const activeListings = userProducts.filter((p) => p.status === "active")
  const soldListings = userProducts.filter((p) => p.status === "sold")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={user.avatarUrl || "/placeholder.svg"}
              alt={user.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          <p className="text-gray-500 mb-4">@{user.username}</p>
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <p className="font-bold">{user.ratings.length}</p>
              <p className="text-sm text-gray-500">Ratings</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{activeListings.length}</p>
              <p className="text-sm text-gray-500">Listings</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{soldListings.length}</p>
              <p className="text-sm text-gray-500">Sold</p>
            </div>
          </div>
          <Button className="w-full mb-2">Message</Button>
          {/* <Button variant="outline" className="w-full">
            Follow
          </Button> */}
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="listings">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="listings" className="flex-1">
                Listings
              </TabsTrigger>
              <TabsTrigger value="sold" className="flex-1">
                Sold
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              {activeListings.length > 0 ? (
                <ProductGrid products={activeListings} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No active listings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold">
              {soldListings.length > 0 ? (
                <ProductGrid products={soldListings} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No sold items</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {user.ratings.length > 0 ? (
                <div className="space-y-4">
                  {user.ratings.map((rating, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt="Reviewer avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{rating.reviewer}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < rating.stars ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-xs text-gray-500 ml-2">{rating.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
