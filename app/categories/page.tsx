import Link from "next/link";
import { getGenres } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Ghost,
  Heart,
  Flame,
  Rocket,
  Search,
  Laugh,
  Zap,
  BookMarked
} from "lucide-react";

export const revalidate = 840000; // 1 hour

export default async function CategoriesPage() {
  const genres = await getGenres();

  // Genre to Icon mapping
  const getGenreIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('fantasy')) return <Sparkles className="w-7 h-7" />;
    if (lowerName.includes('horror')) return <Ghost className="w-7 h-7" />;
    if (lowerName.includes('romantic') || lowerName.includes('romance')) return <Heart className="w-7 h-7" />;
    if (lowerName.includes('thriller')) return <Zap className="w-7 h-7" />;
    if (lowerName.includes('action')) return <Flame className="w-7 h-7" />;
    if (lowerName.includes('sci-fi') || lowerName.includes('science')) return <Rocket className="w-7 h-7" />;
    if (lowerName.includes('mystery')) return <Search className="w-7 h-7" />;
    if (lowerName.includes('drama')) return <BookMarked className="w-7 h-7" />;
    if (lowerName.includes('comedy')) return <Laugh className="w-7 h-7" />;
    return <LayoutGrid className="w-7 h-7" />;
  };

  // Theme-specific color mapping for the glow and icons
  const getGenreTheme = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('fantasy')) return 'from-indigo-600/20 to-purple-600/20 group-hover:shadow-indigo-500/40';
    if (lowerName.includes('horror')) return 'from-red-900/40 to-zinc-900/40 dark:from-zinc-600 dark:to-red-750 group-hover:shadow-red-300/40';
    if (lowerName.includes('romantic') || lowerName.includes('romance')) return 'from-rose-500/20 to-pink-500/20 group-hover:shadow-pink-500/40';
    if (lowerName.includes('thriller')) return 'from-red-600/20 to-orange-600/20 group-hover:shadow-orange-500/40';
    if (lowerName.includes('action')) return 'from-orange-600/20 to-amber-600/20 group-hover:shadow-amber-500/40';
    if (lowerName.includes('sci-fi') || lowerName.includes('science')) return 'from-cyan-600/20 to-blue-600/20 group-hover:shadow-cyan-500/40';
    if (lowerName.includes('mystery')) return 'from-slate-800/20 to-slate-900/20 group-hover:shadow-slate-500/40';
    return 'from-foreground/5 to-foreground/10 group-hover:shadow-foreground/20';
  };

  const getGenreIconColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('fantasy')) return 'text-indigo-500 bg-indigo-500/10';
    if (lowerName.includes('horror')) return 'text-red-600 bg-red-600/10';
    if (lowerName.includes('romantic') || lowerName.includes('romance')) return 'text-pink-600 bg-pink-600/10';
    if (lowerName.includes('thriller')) return 'text-red-500 bg-red-500/10';
    if (lowerName.includes('action')) return 'text-orange-500 bg-orange-500/10';
    if (lowerName.includes('sci-fi') || lowerName.includes('science')) return 'text-cyan-500 bg-cyan-500/10';
    if (lowerName.includes('mystery')) return 'text-slate-400 bg-slate-400/10';
    return 'text-foreground/40 bg-foreground/5';
  };

  return (
    <main className="min-h-screen bg-background mesh-gradient noise-bg overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-foreground/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8">
            Select <span className="text-foreground/20">Genre</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-foreground/40 font-medium leading-relaxed">
            Choose your path through infinite worlds and timeless tales.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16">
          {genres.length > 0 ? (
            genres.map((genre) => {
              const themeClass = getGenreTheme(genre.name);
              const iconClass = getGenreIconColor(genre.name);

              return (
                <Link
                  key={genre.id}
                  href={`/categories/${genre.slug}`}
                  prefetch={false}
                  className="group perspective-1000"
                >
                  <div className={`
                    relative h-[280px] sm:h-[320px] w-full 
                    rounded-[2.5rem] p-6 sm:p-8 
                    bg-gradient-to-br ${themeClass}
                    border border-foreground/[0.03] 
                    transition-all duration-500 ease-out
                    hover:shadow-2xl hover:-translate-y-2
                    card-3d
                    overflow-hidden
                  `}>
                    {/* Adaptive Highlight/Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="absolute -inset-[2px] bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm pointer-events-none hidden dark:block" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full translate-z-20">
                      <div className="flex items-center justify-between mb-auto">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${iconClass} border border-foreground/[0.05] flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
                          {getGenreIcon(genre.name)}
                        </div>
                        <div className="p-2 rounded-full bg-foreground/[0.02] border border-foreground/[0.05] group-hover:bg-foreground group-hover:text-background transition-all duration-700 hidden sm:flex">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3 tracking-tight group-hover:translate-x-1 transition-transform">
                          {genre.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-foreground/40 line-clamp-3 leading-relaxed font-medium">
                          {genre.description || `Explore the captivating depths of ${genre.name.toLowerCase()} fiction.`}
                        </p>

                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-foreground/[0.05] flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20 group-hover:text-foreground/60 transition-colors">
                            Discover
                          </span>
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground group-hover:scale-150 transition-all duration-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center rounded-[3rem] border border-dashed border-foreground/10 bg-foreground/[0.01]">
              <div className="inline-flex p-4 rounded-full bg-foreground/[0.02] mb-6">
                <LayoutGrid className="w-8 h-8 text-foreground/20" />
              </div>
              <h3 className="text-xl font-medium text-foreground/40 italic">
                No genres found in the library.
              </h3>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
