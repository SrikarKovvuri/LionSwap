// app/onboarding/success/page.tsx
'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

export default function OnboardingSuccess() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // read the account ID back from the query string
    const q = new URLSearchParams(window.location.search)
    const acct = q.get("account_id")
    if (acct && user) {
      setUser({ ...user, stripe_account_id: acct })
    }
    // now bounce wherever you like
    router.push("/")
  }, [router, setUser, user])

  return (
    <div className="p-8 text-center">
      <p>🎉 Your Stripe account is connected! Redirecting…</p>
    </div>
  )
}
