import CartClient from "@/components/cartClient"

export default async function ShoppingCart() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <CartClient></CartClient>
    </div>
  );
}
