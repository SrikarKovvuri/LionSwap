"use client";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function OnboardSuccess() {
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");

        }, 3000)
    }, [router]);
    return (
        <div className="flex items-center justify-center h-screen text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2"> Onboarding Complete!</h1>
            <p className="text-sm text-gray-600">Redirecting you to the homepage...</p>
          </div>
        </div>
      );
}