export default function SuccessPage() {
    return (
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Payment complete!</h1>
          <p>Thanks for your purchase. Your order is now being processed.</p>
          <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to homepage
          </a>
        </div>
      );
}