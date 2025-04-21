"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product-grid"
import type { Product } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuestion, setSearchQuestion] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (initialQuery) fetchResults(initialQuery);
  }, [initialQuery]);

  async function fetchResults(query: string) {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/search",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(data.results);
      window.history.replaceState({}, "", `?q=${encodeURIComponent(query)}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchResults(searchQuestion);
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <ProductGrid products={results} />
      )}
    </main>
  );
}
