import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, ArrowRight, MessageCircle, CreditCard, Briefcase } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="text-center mb-24 relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-blue-600 opacity-10 blur-xl"></div>
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">About LionSwap</h1>
          <p className="text-2xl text-blue-700/70 max-w-2xl mx-auto">Columbia's Marketplace for Students</p>
          <div className="absolute -bottom-12 right-1/4 w-16 h-16 rounded-full bg-blue-400 opacity-10 blur-xl"></div>
        </div>

        {/* Mission */}
        <div className="max-w-3xl mx-auto mb-32 bg-white rounded-2xl p-10 shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50"></div>
          <h2 className="text-3xl font-bold mb-8 text-blue-800">Our Mission</h2>
          <p className="text-xl mb-6 text-gray-700 leading-relaxed">
            LionSwap is an early-stage marketplace designed specifically for Columbia students 
            to buy and sell second-hand goods within our community.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            We're building a safe, reliable platform where you can find exactly what you need 
            at the best possible prices—always with <span className="font-bold text-blue-600">0% commission</span>.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Why LionSwap?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">Zero Commissions</h3>
              <p className="text-gray-600 text-lg">Every dollar you make goes straight to you—no fees, ever.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <ArrowRight className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">Instant Exchanges</h3>
              <p className="text-gray-600 text-lg">
                Skip shipping and tracking anxiety. Meet on campus, get what you need immediately,
                and avoid mail center delays altogether.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg shadow-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">Seamless Access</h3>
              <p className="text-gray-600 text-lg">
                Just your Columbia/Barnard email—no extra passwords, no complex setup, and no
                unnecessary personal info required.
              </p>
            </div>
          </div>
        </div>

        {/* What's Coming Next */}
        <div className="mb-32 relative">
          <div className="absolute -top-12 right-1/3 w-24 h-24 rounded-full bg-blue-300 opacity-10 blur-xl"></div>
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">What's Coming Next</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">In-app Messaging</h3>
              <p className="text-gray-600 text-lg">Chat directly with sellers and buyers without leaving the platform.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">Student Services</h3>
              <p className="text-gray-600 text-lg">Earn money by offering services requested by fellow students.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-800">Secure Payments</h3>
              <p className="text-gray-600 text-lg">Integrated payment system with buyer and seller protection.</p>
            </div>
          </div>
          <div className="absolute -bottom-12 left-1/4 w-20 h-20 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-6">Help Us Improve</h2>
              <p className="text-xl max-w-2xl mx-auto mb-12 opacity-90">
                LionSwap is constantly evolving. Have suggestions, questions, or found an issue? 
                We'd love to hear from you as we build the marketplace Columbia students deserve.
              </p>
            </div>
            <div className="flex justify-center">
              <a 
                href="mailto:columbia.lionswap@gmail.com" 
                className="flex items-center gap-3 bg-white text-blue-600 py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="h-6 w-6" />
                <span className="font-semibold text-lg">columbia.lionswap@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-20 text-gray-500">
          <p>© 2025 LionSwap • Made for Columbia and Barnard Students</p>
        </div>
      </div>
    </div>
  )
}