import { getGenres } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";

export const revalidate = 840000; // 1 hour

export default async function CategoriesPage() {
  const genres = await getGenres();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-foreground/40 mb-4 animate-gentle-bounce">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Explore</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="mt-4 text-lg text-foreground/60 max-w-2xl">
            Discover your next favorite story across our curated collection of genres.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {genres.length > 0 ? genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/categories/${genre.slug}`}
              className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-foreground/5 hover:border-foreground/10"
            >
              {/* Decorative Background Gradient */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-foreground/[0.03] rounded-full blur-3xl group-hover:bg-foreground/[0.05] transition-colors" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                    <span className="text-xl font-bold">{genre.name.charAt(0)}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground transition-all duration-500 group-hover:translate-x-1" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">{genre.name}</h3>
                <p className="text-sm text-foreground/40 line-clamp-2 leading-relaxed">
                  {genre.description || `Explore the best ${genre.name} stories and novels.`}
                </p>

                <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 group-hover:text-foreground transition-colors">
                    View Collection
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-border bg-foreground/[0.02]">
              <p className="text-foreground/40 italic">No categories found yet. Please make sure the migration is complete.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
