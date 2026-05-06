"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { Loader2, Search, Filter } from "lucide-react";

interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  genre: string;
  cover_image: string;
  rating: number;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const limit = 6;

  const fetchBooks = async (currentOffset: number, isInitial = false, query = "") => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/books?limit=${limit}&offset=${currentOffset}&q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isInitial) {
        setBooks(data);
      } else {
        setBooks((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBooks(0, true);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setOffset(0);
    setHasMore(true);
    setActiveSearch(searchQuery);
    fetchBooks(0, true, searchQuery);
  };

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchBooks(nextOffset, false, activeSearch);
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 pb-32">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">Library</h1>
          <p className="text-foreground/40 font-medium">Explore our collection of stories and adventures.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full bg-accent/30 border border-border rounded-2xl py-3 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background rounded-2xl font-bold text-sm hover:opacity-90 transition-all"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-foreground/20" />
            <p className="text-foreground/30 font-medium italic">Scanning the archives...</p>
          </div>
        ) : (
          <>
            {books.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16">
                {books.map((book) => (
                  <BookCard
                    key={book.id + book.slug}
                    slug={book.slug}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    rating={book.rating}
                    cover_image={book.cover_image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl font-medium text-foreground/40">No books found matching "{activeSearch}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveSearch(""); fetchBooks(0, true, ""); }}
                  className="mt-4 text-foreground underline font-medium"
                >
                  Clear search
                </button>
              </div>
            )}

            {hasMore && books.length > 0 && (
              <div className="mt-20 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group relative px-12 py-4 bg-foreground text-background font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load More"}
                  </div>
                </button>
              </div>
            )}

            {!hasMore && books.length > 0 && (
              <p className="mt-20 text-center text-foreground/20 font-medium italic">You've reached the end of the collection.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
