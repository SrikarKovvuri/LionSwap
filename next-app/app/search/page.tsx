"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
}

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const initialQuery = searchParams.q || "";

  const [searchQuestion, setSearchQuestion] = useState(initialQuery);
  //  we'll stash the array of products returned from the server
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery]);

  
  async function fetchResults(query: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/search",
        { query },                          
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Flask returns { results: [ { id, title, description }, … ] }
      setResults(response.data.results);
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
    <main>
      <h1>Search Products</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuestion}
          onChange={(e) => setSearchQuestion(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {results.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          results.map((p) => (
            <div key={p.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
