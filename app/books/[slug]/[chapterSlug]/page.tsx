import { getChapterBySlug } from "@/lib/db";
import Navbar from "@/components/Navbar";
import LatexRenderer from "@/components/LatexRenderer";
import ScrollProgress from "@/components/ScrollProgress";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";

export const revalidate = 2592000; // 30 days in seconds

export default async function ChapterPage({ params }: { params: Promise<{ slug: string; chapterSlug: string }> }) {
  const { slug, chapterSlug } = await params;
  const data = await getChapterBySlug(slug, chapterSlug);

  if (!data) {
    notFound();
  }

  const { book, chapter, prevChapter, nextChapter } = data;

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <ScrollProgress />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-32">
        {/* Reader Header */}
        <div className="mb-20 text-center">
          <Link
            href={`/books/${book.slug}`}
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-3 h-3" />
            {book.title}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            {chapter.title}
          </h1>
          <div className="relative mt-8 min-h-[40px] flex flex-col items-center md:flex-row md:justify-center">
            <div className="md:absolute md:inset-0 md:flex md:items-center md:justify-center z-0">
              <span className="px-4 py-1.5 bg-accent text-foreground/40 rounded-full font-medium text-sm">
                Chapter {chapter.chapter_number}
              </span>
            </div>
            <div className="w-full mt-6 md:mt-0 flex justify-end relative z-10">
              <ShareButton
                bookTitle={book.title}
                chapterTitle={chapter.title}
              // popupPosition="bottom"
              />
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="bg-card p-8 md:p-16 rounded-[2.5rem] shadow-sm border border-border transition-colors duration-500">
          <LatexRenderer content={chapter.content} />
        </div>

        {/* Reader Navigation */}
        <div className="mt-20 flex items-center justify-between border-t border-border pt-12">
          {prevChapter ? (
            <Link
              href={`/books/${book.slug}/${prevChapter.slug}`}
              prefetch={false}
              className="flex items-center gap-4 group text-left"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-foreground/30">Previous</span>
                <span className="font-bold text-sm text-foreground">Chapter {prevChapter.chapter_number}</span>
              </div>
            </Link>
          ) : <div />}

          <Link
            href={`/books/${book.slug}`}
            prefetch={false}
            className="p-4 bg-accent hover:bg-foreground hover:text-background rounded-full transition-all duration-300"
            title="Table of Contents"
          >
            <List className="w-5 h-5" />
          </Link>

          {nextChapter ? (
            <Link
              href={`/books/${book.slug}/${nextChapter.slug}`}
              prefetch={false}
              className="flex items-center gap-4 group text-right"
            >
              <div className="hidden sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-foreground/30">Next</span>
                <span className="font-bold text-sm text-foreground">Chapter {nextChapter.chapter_number}</span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  );
}
