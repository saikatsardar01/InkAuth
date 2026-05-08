import { turso } from "./turso";

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  cover_image: string;
  rating: number;
  total_chapters: number;
  status: 'ongoing' | 'completed';
  published_at: string;
  created_at: string;
}

export interface Chapter {
  id: number;
  book_id: number;
  slug: string;
  title: string;
  content: string;
  chapter_number: number;
  created_at: string;
}

export interface BookWithChapters {
  book: Book;
  chapters: Partial<Chapter>[];
}

export interface ChapterWithNav {
  book: { title: string; slug: string };
  chapter: Chapter;
  prevChapter: { slug: string; chapter_number: number } | null;
  nextChapter: { slug: string; chapter_number: number } | null;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

/**
 * Normalization helper to convert Turso Row objects to plain JS objects.
 */
function rowsToObjects<T>(result: any): T[] {
  if (!result || !result.columns || !result.rows) return [];
  const cols = result.columns;
  return result.rows.map((row: any) => {
    const obj: Record<string, any> = {};
    cols.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

/**
 * Data Access Layer (DAL) for "Ink Auth"
 * Centralizes all Turso database queries.
 */

export async function getFeaturedBooks(limit: number = 6): Promise<Book[]> {
  try {
    const result = await turso.execute(
      "SELECT * FROM book_summaries ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    return rowsToObjects<Book>(result);
  } catch (error) {
    console.error("Error in getFeaturedBooks:", error);
    return [];
  }
}

export async function getPlatformPicks(): Promise<Book[]> {
  try {
    const result = await turso.execute(`
      SELECT b.* 
      FROM platform_pick p
      JOIN book_summaries b ON p.book_id = (SELECT id FROM books WHERE slug = b.slug)
      ORDER BY p.id ASC
    `);
    return rowsToObjects<Book>(result);
  } catch (error) {
    console.error("Error in getPlatformPicks:", error);
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<BookWithChapters | null> {
  try {
    const bookResult = await turso.execute({
      sql: "SELECT * FROM books WHERE slug = ?",
      args: [slug],
    });

    const books = rowsToObjects<Book>(bookResult);
    if (books.length === 0) return null;

    const book = books[0];

    const chaptersResult = await turso.execute({
      sql: "SELECT id, title, chapter_number, slug FROM chapters WHERE book_id = ? ORDER BY chapter_number ASC",
      args: [book.id],
    });

    return {
      book,
      chapters: rowsToObjects<Partial<Chapter>>(chaptersResult),
    };
  } catch (error) {
    console.error("Error in getBookBySlug:", error);
    return null;
  }
}

export async function getChapterBySlug(bookSlug: string, chapterSlug: string): Promise<ChapterWithNav | null> {
  try {
    // 1. Get Book
    const bookResult = await turso.execute({
      sql: "SELECT id, title, slug FROM books WHERE slug = ?",
      args: [bookSlug],
    });

    const books = rowsToObjects<{ id: number; title: string; slug: string }>(bookResult);
    if (books.length === 0) return null;
    const book = books[0];

    // 2. Get Chapter
    const chapterResult = await turso.execute({
      sql: "SELECT * FROM chapters WHERE book_id = ? AND slug = ?",
      args: [book.id, chapterSlug],
    });

    const chapters = rowsToObjects<Chapter>(chapterResult);
    if (chapters.length === 0) return null;
    const chapter = chapters[0];

    // 3. Get Navigation (Previous and Next slugs)
    const navResult = await turso.execute({
      sql: "SELECT slug, chapter_number FROM chapters WHERE book_id = ? AND chapter_number IN (?, ?) ORDER BY chapter_number",
      args: [book.id, chapter.chapter_number - 1, chapter.chapter_number + 1],
    });

    const navItems = rowsToObjects<{ slug: string; chapter_number: number }>(navResult);
    let prevChapter = null;
    let nextChapter = null;

    navItems.forEach((item) => {
      if (item.chapter_number === chapter.chapter_number - 1) prevChapter = item;
      if (item.chapter_number === chapter.chapter_number + 1) nextChapter = item;
    });

    return {
      book,
      chapter,
      prevChapter,
      nextChapter
    };
  } catch (error) {
    console.error("Error in getChapterBySlug:", error);
    return null;
  }
}

export async function getPaginatedBooks(limit: number = 6, offset: number = 0, query: string = ""): Promise<Book[]> {
  try {
    let sql = "SELECT * FROM book_summaries";
    let args: any[] = [];

    if (query) {
      sql += " WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?";
      const searchPattern = `%${query}%`;
      args.push(searchPattern, searchPattern, searchPattern);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    args.push(limit, offset);

    const result = await turso.execute({ sql, args });
    return rowsToObjects<Book>(result);
  } catch (error) {
    console.error("Error in getPaginatedBooks:", error);
    return [];
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const result = await turso.execute("SELECT * FROM genres ORDER BY name ASC");
    return rowsToObjects<Genre>(result);
  } catch (error) {
    console.error("Error in getGenres:", error);
    return [];
  }
}

export async function getBooksByGenre(genreSlug: string): Promise<Book[]> {
  try {
    const result = await turso.execute({
      sql: `SELECT b.* FROM book_summaries b 
            JOIN genres g ON b.genre_id = g.id 
            WHERE g.slug = ? 
            ORDER BY b.created_at DESC`,
      args: [genreSlug],
    });
    
    const books = rowsToObjects<Book>(result);
    
    // Fallback if genre_id is not yet populated but genres table exists
    if (books.length === 0) {
      const resultFallback = await turso.execute({
        sql: `SELECT * FROM book_summaries 
              WHERE LOWER(REPLACE(genre, ' ', '-')) = ? 
              ORDER BY created_at DESC`,
        args: [genreSlug],
      });
      return rowsToObjects<Book>(resultFallback);
    }
    
    return books;
  } catch (error) {
    console.error("Error in getBooksByGenre:", error);
    return [];
  }
}
