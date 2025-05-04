import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
   
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About LionSwap</h1>
        <p className="text-xl text-muted-foreground">Columbia's Marketplace for Students</p>
      </div>

      
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-6">Our Mission</h2>
        <p className="text-lg mb-4">
          LionSwap is an early-stage marketplace designed specifically for Columbia students 
          to buy and sell second-hand goods within our community.
        </p>
        <p className="text-lg">
          We're building a safe, reliable platform where you can find exactly what you need 
          at the best possible prices.
        </p>
      </div>

      
      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">What's Coming Next</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">In-app Messaging</h3>
            <p>Chat directly with sellers and buyers without leaving the platform.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Student Services</h3>
            <p>Earn money by offering services requested by fellow students.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
            <p>Integrated payment system with buyer and seller protection.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Help Us Improve</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            LionSwap is constantly evolving. Have suggestions, questions, or found an issue? 
            We'd love to hear from you as we build the marketplace Columbia students deserve.
          </p>
        </div>

        <div className="flex justify-center">
          <a 
            href="mailto:columbia.lionswap@gmail.com" 
            className="flex items-center gap-2 bg-white text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">columbia.lionswap@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}