import { turso } from "./turso";

// ────────────────────────────────────────────────────────────────────────────
// Denormalized Data Types
// Tags and category stored inline in blog_posts to avoid relational JOIN overhead
// ────────────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  summary: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Denormalized category fields (no JOIN needed)
  category_slug: string | null;
  category_name: string | null;
  // Denormalized tags stored as comma-separated string in DB
  tags_csv: string | null;
  // Denormalized SEO stored inline
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_image: string | null;
  sitemap_include: number; // 0 or 1
  // Flags & scoring
  is_featured: number; // 0 or 1
  is_trending: number; // 0 or 1
  reading_time: number;
  seo_score: number;
  keywords: string | null;
}

// Helper: parsed tag list from comma-separated CSV
export function parseTags(
  tags_csv: string | null
): { name: string; slug: string }[] {
  if (!tags_csv || tags_csv.trim() === "") return [];
  return tags_csv.split(",").map((t) => {
    const trimmed = t.trim();
    return {
      name: trimmed,
      slug: trimmed.toLowerCase().replace(/\s+/g, "-"),
    };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Legacy compatibility types (for admin forms, SEO settings separate queries)
// ────────────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogSEOSettings {
  id: number;
  post_id: number;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_image: string | null;
  sitemap_include: number;
}

// For full article detail pages (backwards compatible shape)
export interface BlogPostComplete {
  post: BlogPost;
  category: BlogCategory | null;
  tags: { name: string; slug: string }[];
  seo: BlogSEOSettings | null;
}

// ────────────────────────────────────────────────────────────────────────────
// Internal Utilities
// ────────────────────────────────────────────────────────────────────────────

function rowsToObjects<T>(result: any): T[] {
  if (!result || !result.columns || !result.rows) return [];
  const cols = result.columns as string[];
  return result.rows.map((row: any) => {
    const obj: Record<string, any> = {};
    cols.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

// ────────────────────────────────────────────────────────────────────────────
// CORE QUERY: Get Blog Posts (fully denormalized, single-table query)
// ────────────────────────────────────────────────────────────────────────────

export async function getBlogPosts(options: {
  status?: "published" | "draft";
  limit?: number;
  offset?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}): Promise<{ posts: BlogPost[]; totalCount: number }> {
  try {
    const {
      status = "published",
      limit = 8,
      offset = 0,
      categorySlug,
      tagSlug,
      search,
      isFeatured,
      isTrending,
    } = options;

    const whereClauses: string[] = ["status = ?"];
    const args: any[] = [status];

    if (isFeatured !== undefined) {
      whereClauses.push("is_featured = ?");
      args.push(isFeatured ? 1 : 0);
    }
    if (isTrending !== undefined) {
      whereClauses.push("is_trending = ?");
      args.push(isTrending ? 1 : 0);
    }
    if (categorySlug) {
      whereClauses.push("category_slug = ?");
      args.push(categorySlug);
    }
    if (tagSlug) {
      // Lightweight tag search via LIKE on denormalized tags_csv
      whereClauses.push(
        "(tags_csv LIKE ? OR tags_csv LIKE ? OR tags_csv LIKE ? OR tags_csv = ?)"
      );
      args.push(
        `${tagSlug},%`,   // starts with tag
        `%, ${tagSlug},%`, // middle
        `%, ${tagSlug}`,  // ends with tag
        tagSlug           // only tag
      );
    }
    if (search) {
      whereClauses.push(
        "(title LIKE ? OR summary LIKE ? OR keywords LIKE ? OR tags_csv LIKE ?)"
      );
      const pattern = `%${search}%`;
      args.push(pattern, pattern, pattern, pattern);
    }

    const whereString =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Single-table count — no JOIN
    const countResult = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM blog_posts ${whereString}`,
      args,
    });
    const totalCount = Number(countResult.rows[0]?.[0] || 0);

    // Single-table fetch — no JOIN
    const recordsResult = await turso.execute({
      sql: `
        SELECT * FROM blog_posts
        ${whereString}
        ORDER BY is_featured DESC, published_at DESC, created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...args, limit, offset],
    });

    return {
      posts: rowsToObjects<BlogPost>(recordsResult),
      totalCount,
    };
  } catch (error) {
    console.error("Error in getBlogPosts:", error);
    return { posts: [], totalCount: 0 };
  }
}

// ────────────────────────────────────────────────────────────────────────────
// SINGLE POST: Fetch by slug — denormalized, single-table query
// ────────────────────────────────────────────────────────────────────────────

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostComplete | null> {
  try {
    const postResult = await turso.execute({
      sql: "SELECT * FROM blog_posts WHERE slug = ? LIMIT 1",
      args: [slug],
    });

    const posts = rowsToObjects<BlogPost>(postResult);
    if (posts.length === 0) return null;
    const post = posts[0];

    // Reconstruct legacy-compatible category & tags objects from denormalized fields
    const category: BlogCategory | null = post.category_slug
      ? {
          id: 0, // placeholder, not needed for display
          name: post.category_name || post.category_slug,
          slug: post.category_slug,
          description: null,
          created_at: post.created_at,
        }
      : null;

    const tags = parseTags(post.tags_csv);

    // Reconstruct legacy SEO settings from inline fields
    const seo: BlogSEOSettings | null =
      post.meta_title || post.meta_description
        ? {
            id: 0,
            post_id: post.id,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            focus_keyword: post.focus_keyword,
            canonical_url: post.canonical_url,
            og_image: post.og_image,
            sitemap_include: post.sitemap_include ?? 1,
          }
        : null;

    return { post, category, tags, seo };
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// CATEGORIES: Direct query — no joins needed
// ────────────────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<BlogCategory[]> {
  try {
    const result = await turso.execute(
      "SELECT * FROM blog_categories ORDER BY name ASC"
    );
    return rowsToObjects<BlogCategory>(result);
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// TAGS: Derived from denormalized tags_csv — no tags table join needed
// Returns unique tag slugs from all published posts
// ────────────────────────────────────────────────────────────────────────────

export async function getTags(): Promise<{ name: string; slug: string }[]> {
  try {
    const result = await turso.execute(
      "SELECT DISTINCT tags_csv FROM blog_posts WHERE status = 'published' AND tags_csv IS NOT NULL AND tags_csv != ''"
    );
    const tagMap = new Map<string, string>();
    const rows = rowsToObjects<{ tags_csv: string }>(result);
    for (const row of rows) {
      const parsed = parseTags(row.tags_csv);
      for (const t of parsed) {
        tagMap.set(t.slug, t.name);
      }
    }
    return Array.from(tagMap.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error in getTags:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// RELATED POSTS: Single-table query by category_slug
// ────────────────────────────────────────────────────────────────────────────

export async function getRelatedPosts(
  postId: number,
  categorySlug: string | null,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    let result;
    if (categorySlug) {
      result = await turso.execute({
        sql: `
          SELECT * FROM blog_posts
          WHERE status = 'published' AND id != ? AND category_slug = ?
          ORDER BY published_at DESC
          LIMIT ?
        `,
        args: [postId, categorySlug, limit],
      });
    } else {
      result = await turso.execute({
        sql: `
          SELECT * FROM blog_posts
          WHERE status = 'published' AND id != ?
          ORDER BY published_at DESC
          LIMIT ?
        `,
        args: [postId, limit],
      });
    }

    const posts = rowsToObjects<BlogPost>(result);
    if (posts.length === 0 && categorySlug) {
      return getRelatedPosts(postId, null, limit); // Fallback to any posts
    }
    return posts;
  } catch (error) {
    console.error("Error in getRelatedPosts:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// INTERNAL LINK SUGGESTIONS: Single-table scan — no JOIN
// ────────────────────────────────────────────────────────────────────────────

export async function suggestInternalLinks(
  content: string,
  currentPostId: number
): Promise<{ title: string; slug: string; keyword: string }[]> {
  try {
    const result = await turso.execute({
      sql: "SELECT id, title, slug, keywords FROM blog_posts WHERE status = 'published' AND id != ?",
      args: [currentPostId],
    });

    const posts = rowsToObjects<{
      id: number;
      title: string;
      slug: string;
      keywords: string | null;
    }>(result);

    const suggestions: { title: string; slug: string; keyword: string }[] = [];
    const lowerContent = content.toLowerCase();

    for (const post of posts) {
      const searchKeywords = [
        post.title.toLowerCase(),
        ...(post.keywords
          ? post.keywords.split(",").map((k) => k.trim().toLowerCase())
          : []),
      ].filter((k) => k.length > 3);

      for (const keyword of searchKeywords) {
        if (
          lowerContent.includes(keyword) &&
          !suggestions.some((s) => s.slug === post.slug)
        ) {
          suggestions.push({ title: post.title, slug: post.slug, keyword });
          break;
        }
      }
    }

    return suggestions.slice(0, 5);
  } catch (error) {
    console.error("Error in suggestInternalLinks:", error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// ADMIN: Legacy helpers that admin CMS may still call
// ────────────────────────────────────────────────────────────────────────────

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM blog_posts WHERE id = ? LIMIT 1",
      args: [id],
    });
    const posts = rowsToObjects<BlogPost>(result);
    return posts[0] || null;
  } catch (error) {
    console.error("Error in getBlogPostById:", error);
    return null;
  }
}
