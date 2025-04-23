import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductGrid from "@/components/product-grid"
import axios from "axios"
import { User, Product } from "@/lib/types"

interface ProfilePageProps {
    params: {
      username: string
    }
}

async function fetchProductsByUsername(username: string): Promise<[Product[], User | null]> {
    try {
        const response = await axios.get(`http://localhost:5000/listings/username/${username}`, {});
        return [response.data.listings, response.data.user];
    } catch (err: any) {
        if(err.response.status === 401){
            return [[], null];
        }else{
            console.log("getProductsByUsername(TypeScript) error", err.response?.data || err.message);
            return [[], null];
        }
    }
}

export default async function ProfilePage(props: ProfilePageProps) {

  const params = await props.params;
  const { username } = params;

  const output = await fetchProductsByUsername(username)
  const products = output[0]
  const user = output[1]


  if (!user) {
    return (
      <h1>This user does not exist.</h1>
    )
  }

  const activeListings = products.filter((p) => p.isAvailable === true)
  const soldListings = products.filter((p) => p.isAvailable === false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={"/blank-pfp.webp"}
              alt={user.username}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <p className="font-bold">{activeListings.length}</p>
              <p className="text-sm text-gray-500">Listings</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{soldListings.length}</p>
              <p className="text-sm text-gray-500">Sold</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold">Contact Info</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="listings">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="listings" className="flex-1">
                My Listings
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

          </Tabs>
        </div>
      </div>
    </div>
  )
}
