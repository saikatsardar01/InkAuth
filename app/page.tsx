import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { getFeaturedBooks, getPlatformPicks, Book } from "@/lib/db";
import ContributeBanner from "@/components/ContributeBanner";
import { Star, Sparkles, Trophy } from "lucide-react";

export const revalidate = 2592000; // 30 days in seconds

export default async function Home() {
  const books = await getFeaturedBooks();
  const platformPicks = await getPlatformPicks();

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />
      <ContributeBanner />
      <Hero />

      {/* Platform Pick Section - Hall of Fame */}
      {platformPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative">
            {/* Subtle Spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative py-10 px-6 sm:px-12 bg-card/30 dark:bg-slate-950/40 backdrop-blur-2xl border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-xl">
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-amber-500/20 rounded-tl-[2.5rem] pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-500/20 rounded-tr-[2.5rem] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-amber-500/20 rounded-bl-[2.5rem] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-amber-500/20 rounded-br-[2.5rem] pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-12 text-left sm:text-center">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-3">
                    Platform <span className="text-amber-500 italic">Picks</span>
                  </h2>
                  <p className="max-w-xl sm:mx-auto text-foreground/40 font-medium text-base leading-relaxed italic">
                    "Best 4 handpicked for our readers."
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
                  {platformPicks.map((book: Book, i: number) => (
                    <div key={`pick-${book.slug}`} className="relative group/pick">
                      {/* Subtler Pedestal */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-black/20 blur-lg rounded-full opacity-0 group-hover/pick:opacity-100 transition-opacity duration-500" />

                      <div className="relative transition-all duration-500 group-hover/pick:-translate-y-2">
                        <BookCard
                          slug={book.slug}
                          title={book.title}
                          author={book.author}
                          genre={book.genre}
                          rating={book.rating}
                          cover_image={book.cover_image}
                        />

                        {/* Number Badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500 font-black text-xs shadow-xl z-20 group-hover/pick:border-amber-500 transition-colors">
                          {i + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="featured-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-4 text-foreground">Featured Stories</h2>
          <p className="text-foreground/40 font-medium text-lg italic">"Newest reads that define the soul of our library."</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16">
          {books.map((book: Book) => (
            <BookCard
              key={book.slug}
              slug={book.slug}
              title={book.title}
              author={book.author}
              genre={book.genre}
              rating={book.rating}
              cover_image={book.cover_image}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/library"
            prefetch={false}
            className="group relative px-8 py-4 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:translate-x-2 hover:shadow-xl hover:shadow-foreground/10 overflow-hidden"
          >
            <span className="relative z-10">Explore Library</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent py-20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border pb-16">
            <div className="md:col-span-2">
              <span className="font-bold text-2xl tracking-tighter mb-4 block text-foreground">Ink Auth</span>
              <p className="max-w-xs text-foreground/50 leading-relaxed">
                A sanctuary for readers and writers. We believe in the power of stories to change the world.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Explore</h4>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><Link href="/library" prefetch={false} className="hover:text-foreground transition-colors">Library</Link></li>
                <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Authors</Link></li>
                <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Membership</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Support</h4>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/terms" prefetch={false} className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" prefetch={false} className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-sm text-foreground/30 flex justify-between items-center">
            <p>© 2026 Ink Auth. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" prefetch={false} className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" prefetch={false} className="hover:text-foreground transition-colors">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}