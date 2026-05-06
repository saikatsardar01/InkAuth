import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface BookCardProps {
  slug: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  cover_image: string;
}

export default function BookCard({ slug, title, author, genre, rating, cover_image }: BookCardProps) {
  return (
    <Link href={`/books/${slug}`} prefetch={false} className="group block w-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-accent mb-3 sm:mb-4 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
        {cover_image ? (
          <Image
            src={cover_image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-accent text-foreground/20 font-bold text-xl sm:text-2xl uppercase tracking-tighter">
            {title[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
          <div className="w-full bg-card text-foreground py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Read Now
          </div>
        </div>
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/40 line-clamp-1">{genre}</span>
          <div className="flex items-center space-x-1 text-foreground">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-foreground text-foreground" />
            <span className="text-[10px] sm:text-xs font-bold">{rating ? rating.toFixed(1) : "N/A"}</span>
          </div>
        </div>
        <h3 className="font-bold text-sm sm:text-lg leading-tight text-foreground group-hover:text-foreground/60 transition-colors line-clamp-2">{title}</h3>
        <p className="text-[11px] sm:text-sm text-foreground/60 line-clamp-1">{author}</p>
      </div>
    </Link>
  );
}
