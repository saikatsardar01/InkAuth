import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <br />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Where reading, <br className="hidden sm:block" />
            <span className="text-foreground/40 italic">meets atmosphere.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-foreground/60 mb-10 leading-relaxed px-4 sm:px-0">
            Explore a curated collection of independent stories accompanied by live global radio.  <b>Crafted to create the perfect atmosphere for reading.</b>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            <a href="#featured-stories" className="w-full sm:w-auto bg-foreground text-background px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base">
              <b>Start Reading</b>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link href="/radio" prefetch={false} className="w-full sm:w-auto bg-card border-2 border-foreground/10 px-8 py-4 rounded-full font-medium hover:bg-accent transition-all text-foreground text-sm sm:text-base flex items-center justify-center gap-2">
              <b>Listen Live</b>
              <div className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-foreground/[0.02] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/[0.03] rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
}
