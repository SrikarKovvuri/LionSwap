import { Metadata } from "next";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <main>
      <h1>Search Results for: "{query}"</h1>
      {/* Display results based on `query` */}
    </main>
  );
}