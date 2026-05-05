import { getBooksByGenre, getGenres } from "@/lib/db";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 840000; // 1 hour

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genres = await getGenres();
  const currentGenre = genres.find(g => g.slug === slug);

  if (!currentGenre) {
    // If genres table is empty or slug not found, we still try to fetch books by slug
    // to handle the transition phase gracefully.
    const books = await getBooksByGenre(slug);
    if (books.length === 0) notFound();

    return <GenreLayout genreName={slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')} books={books} />;
  }

  const books = await getBooksByGenre(slug);

  return <GenreLayout genreName={currentGenre.name} books={books} description={currentGenre.description} />;
}

function GenreLayout({ genreName, books, description }: { genreName: string; books: any[]; description?: string | null }) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Categories
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {genreName}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl">
              {description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-2">
            <span className="px-3 py-1 bg-foreground/5 rounded-full text-xs font-medium text-foreground/60">
              {books.length} {books.length === 1 ? 'Book' : 'Books'} available
            </span>
          </div>
        </header>

        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16">
            {books.map((book) => (
              <BookCard 
                key={book.id} 
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
          <div className="py-20 text-center rounded-[2.5rem] border border-dashed border-border bg-foreground/[0.02]">
            <p className="text-foreground/40 italic">No stories found in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
