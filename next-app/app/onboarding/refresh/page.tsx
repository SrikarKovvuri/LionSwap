"use client";

import { useRouter } from "next/navigation";


export default function OnboardRefresh() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center h-screen text-center">
          <div>
            <h1 className="text-xl font-semibold mb-2"> Onboarding Canceled</h1>
            <p className="text-sm mb-4 text-gray-600">Looks like the process was interrupted.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
}