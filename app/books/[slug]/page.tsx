import { getBookBySlug } from "@/lib/db";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Star, Clock, Book as BookIcon, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";

export const revalidate = 2592000; // 30 days in seconds

export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBookBySlug(slug);

  if (!data) {
    notFound();
  }

  const { book, chapters } = data;

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Left Sidebar: Book Info */}
          <div className="lg:w-[300px] lg:sticky lg:top-32 h-fit">
            <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto lg:mx-0 overflow-hidden rounded-3xl shadow-2xl mb-8 bg-accent flex items-center justify-center">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-bold text-foreground/10">{book.title[0]}</span>
              )}
            </div>

            <div className="space-y-6 text-justify">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{book.title}</h1>
                <p className="text-lg text-foreground/40 font-medium italic">{book.author}</p>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 py-4 border-y border-border">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-foreground text-foreground" />
                    <span className="font-bold text-foreground">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Chapters</span>
                  <span className="font-bold text-foreground">{book.total_chapters}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">Status</span>
                  <span className="font-bold capitalize text-foreground">{book.status}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/30 mb-3 text-left">Synopsis</h3>
                <p className="text-foreground/60 leading-relaxed text-base text-justify">
                  {book.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="inline-block px-4 py-1.5 bg-accent rounded-full text-xs font-bold uppercase tracking-widest text-foreground/70">
                  {book.genre}
                </span>
                <ShareButton
                  bookTitle={book.title}
                  description={book.description}
                />
              </div>
            </div>
          </div>

          {/* Right Content: Chapters List */}
          <div className="lg:w-2/3">
            <div className="mb-10">
              <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Chapters</h2>
              <p className="text-foreground/40 font-medium">Continue your reading journey</p>
            </div>

            <div className="space-y-3">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/books/${book.slug}/${chapter.slug}`}
                  prefetch={false}
                  className="group flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:bg-accent transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-accent rounded-xl group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <span className="font-bold">{chapter.chapter_number}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground group-hover:text-foreground/70 transition-colors">{chapter.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-foreground/30 font-medium">
                        <span className="flex items-center gap-1.5 italic">
                          <BookIcon className="w-3.5 h-3.5" />
                          Published
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
