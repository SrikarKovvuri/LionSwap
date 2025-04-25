// app/cancel/page.tsx
export default function CancelPage() {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Payment canceled</h1>
        <p>Your payment was canceled. Feel free to try again or contact support.</p>
        <a href="/cart" className="mt-6 inline-block text-blue-600 hover:underline">
          Return to cart
        </a>
      </div>
    );
  }
  