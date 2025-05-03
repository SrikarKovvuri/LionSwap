import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About LionSwap</h1>
        <p className="text-xl text-muted-foreground">Columbia's Marketplace for Students</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">We're Just Getting Started</h2>
          <p className="text-lg mb-6">
            LionSwap is currently an early MVP (Minimum Viable Product) designed to connect Columbia students for buying
            and selling second-hand goods within our community.
          </p>
          <p className="text-lg mb-6">
            Our mission is to create a sustainable, convenient, and trusted marketplace exclusively for Columbia
            students, helping you save money and reduce waste.
          </p>
        </div>
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Columbia University campus"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">In-app Messaging</h3>
            <p>Chat directly with sellers and buyers without leaving the platform.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Columbia Email Verification</h3>
            <p>Verify your Columbia University status for a safer, more trusted community.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
            <p>Integrated payment system with buyer and seller protection.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Mobile App</h3>
            <p>Native iOS and Android apps for an even better experience on the go.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Dorm Delivery</h3>
            <p>Convenient on-campus delivery options for larger items.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Seasonal Marketplaces</h3>
            <p>Special sections for move-in/move-out periods and textbook rush seasons.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">We Want Your Feedback!</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Have suggestions, questions, or encountered an issue? We're actively improving LionSwap and would love to
            hear from you.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-6 w-6" />
            <a href="mailto:feedback@lionswap.columbia.edu" className="text-xl hover:underline">
              feedback@lionswap.columbia.edu
            </a>
          </div>
          <Link href="/contact">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
