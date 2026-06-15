-- ============================================================
-- Inkauth SEO Blog System — Denormalized Schema Migration
-- Architecture: Single-table read path, no JOIN overhead
-- Compatible with Turso/libSQL
-- ============================================================

-- ── Step 1: Legacy relational tables (kept for admin/taxonomy management)
CREATE TABLE IF NOT EXISTS blog_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Step 2: Primary denormalized blog_posts table
-- Tags stored as CSV string: e.g. "nextjs, seo, turso"
-- Category stored as slug + name directly inline
-- SEO metadata stored inline — zero extra table reads needed
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    cover_image TEXT,
    status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Denormalized category (no JOIN needed)
    category_slug TEXT,
    category_name TEXT,

    -- Denormalized tags as comma-separated values (no join table needed)
    tags_csv TEXT DEFAULT '',

    -- Inline SEO metadata (eliminates blog_seo_settings table lookups)
    meta_title TEXT,
    meta_description TEXT,
    focus_keyword TEXT,
    canonical_url TEXT,
    og_image TEXT,
    sitemap_include INTEGER DEFAULT 1 CHECK(sitemap_include IN (0, 1)),

    -- Feature flags
    is_featured INTEGER DEFAULT 0 CHECK(is_featured IN (0, 1)),
    is_trending INTEGER DEFAULT 0 CHECK(is_trending IN (0, 1)),
    reading_time INTEGER DEFAULT 1,
    seo_score INTEGER DEFAULT 0,
    keywords TEXT
);

-- Legacy join table kept for admin backwards compatibility
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (post_id, tag_id)
);

-- Legacy SEO settings table kept for admin backwards compatibility
CREATE TABLE IF NOT EXISTS blog_seo_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    focus_keyword TEXT,
    canonical_url TEXT,
    og_image TEXT,
    sitemap_include INTEGER DEFAULT 1 CHECK(sitemap_include IN (0, 1))
);

-- ── Step 3: Performance indexes (all single-table — fast lookup)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_slug ON blog_posts(category_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_trending ON blog_posts(is_trending);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- ── Step 4: Migration helper — add denormalized columns if blog_posts table already exists
-- Run these ALTER TABLE statements on existing Turso databases
-- (Safe to re-run — Turso ignores IF NOT EXISTS gracefully for ALTER)
-- NOTE: Turso/libSQL does not support ADD COLUMN IF NOT EXISTS directly.
-- Run individually with error handling in production migration scripts.

-- ALTER TABLE blog_posts ADD COLUMN category_slug TEXT;
-- ALTER TABLE blog_posts ADD COLUMN category_name TEXT;
-- ALTER TABLE blog_posts ADD COLUMN tags_csv TEXT DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN meta_title TEXT;
-- ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
-- ALTER TABLE blog_posts ADD COLUMN focus_keyword TEXT;
-- ALTER TABLE blog_posts ADD COLUMN canonical_url TEXT;
-- ALTER TABLE blog_posts ADD COLUMN og_image TEXT;
-- ALTER TABLE blog_posts ADD COLUMN sitemap_include INTEGER DEFAULT 1;

-- ── Step 5: Seed taxonomy reference data
INSERT OR IGNORE INTO blog_categories (id, name, slug, description) VALUES 
(1, 'Product Updates', 'product-updates', 'Latest releases, feature enhancements, and changelogs from the Inkauth team.'),
(2, 'SEO & Content', 'seo-content', 'Expert guides on search engine optimization, programmatic content scaling, and technical SEO.'),
(3, 'Engineering', 'engineering', 'Deep dives into our tech stack, database optimization, and high-performance server architectures.');

INSERT OR IGNORE INTO blog_tags (id, name, slug) VALUES 
(1, 'NextJS', 'nextjs'),
(2, 'SEO', 'seo'),
(3, 'Turso', 'turso'),
(4, 'SaaS', 'saas');

-- ── Step 6: Seed sample blog posts (fully denormalized)
INSERT OR IGNORE INTO blog_posts (
    id, slug, title, content, summary, cover_image, status, published_at,
    category_slug, category_name, tags_csv,
    meta_title, meta_description, focus_keyword, canonical_url, og_image, sitemap_include,
    is_featured, is_trending, reading_time, seo_score, keywords
) VALUES (
    1,
    'scaling-programmatic-seo-with-nextjs-and-turso',
    'Scaling Programmatic SEO with Next.js App Router and Turso',
    '# Scaling Programmatic SEO with Next.js App Router and Turso

Search Engine Optimization is no longer about publishing a single article a week and waiting for traffic. Modern content scaling requires **programmatic SEO (pSEO)** — creating high-value, highly structured landing pages at scale to capture long-tail search intent.

In this deep dive, we will explore how we built our modular, lightning-fast SEO blog system using Next.js App Router, SQLite via Turso, and advanced static revalidation strategies.

## The Pillars of High-Performance Blog Systems

To rank on modern search engines, a blog system must solve two major challenges:
1. **Speed & Core Web Vitals**: Modern search engine crawlers penalize heavy, slow-loading pages.
2. **Metadata Integrity**: Perfect breadcrumbs, automated XML sitemaps, semantic heading hierarchies, and machine-readable JSON-LD schemas.

Here is a simple schematic showing how a request flows through our statically optimized server components:

$$\text{User/Crawler} \longrightarrow \text{Next.js Server Component} \longrightarrow \text{Turso Edge Cache} \longrightarrow \text{Rendered Static HTML}$$

### 1. Database Layer: Why Turso?

Turso is a distributed database built on libSQL (an open-source SQLite fork). Because SQLite is extremely lightweight and database reads complete in microseconds, it is the perfect companion for a CMS where reads dominate writes by a ratio of $10,000:1$.

Our database schema stores everything from markdown content to raw SEO fields, enabling clean data mapping:

```sql
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    seo_score INTEGER DEFAULT 0
);
```

### 2. Static Revalidation (ISR) for Speed

Instead of querying the database on every single request, we use Next.js Incremental Static Regeneration:

```typescript
export const revalidate = 86400; // 24 hours in seconds
```

This guarantees that pages are served directly from the server-side edge cache as static HTML files. When you publish a new article or edit an existing one in the admin dashboard, we trigger a secure cache invalidation callback that updates the listing page and article detail path instantly.

### Frequently Asked Questions

#### How does Turso handle concurrent read/write queries?
Turso leverages SQLite''s standard WAL (Write-Ahead Logging) mode, permitting concurrent reads while writes are active, assuring zero database lock errors.

#### What are the recommended image formats for blog covers?
Always prefer WebP or AVIF formats. In Next.js, use the `next/image` component to automate responsive resizing and lazy-loading.

## Conclusion

Scaling content doesn''t mean sacrificing speed or quality. By combining SQLite''s microsecond reads with Next.js App Router, we deliver a production-ready, SEO-first system that pleases both human readers and search engine crawlers.',
    'Learn how to architect a high-performance programmatic SEO system using SQLite via Turso and the Next.js App Router. Maximize Core Web Vitals and achieve organic traffic growth.',
    'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop',
    'published',
    '2026-05-26 00:00:00',
    'seo-content', 'SEO & Content',
    'nextjs, seo, turso',
    'Scaling Programmatic SEO with Next.js and Turso | Inkauth',
    'Unlock hyper-scalable programmatic SEO utilizing Next.js App Router and Turso (SQLite). Learn edge database structures and cache invalidation workflows.',
    'programmatic seo',
    'https://www.inkauth.in/blog/scaling-programmatic-seo-with-nextjs-and-turso',
    'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop',
    1,
    1, 0, 6, 98,
    'nextjs, seo, turso, programmatic seo'
);

INSERT OR IGNORE INTO blog_posts (
    id, slug, title, content, summary, cover_image, status, published_at,
    category_slug, category_name, tags_csv,
    meta_title, meta_description, focus_keyword, canonical_url, og_image, sitemap_include,
    is_featured, is_trending, reading_time, seo_score, keywords
) VALUES (
    2,
    'ultimate-guide-to-technical-seo',
    'The Ultimate Guide to Technical SEO in 2026',
    '# The Ultimate Guide to Technical SEO in 2026

Technical SEO is the foundation of organic discoverability. If search engine spiders cannot crawl, index, or parse your website, the most compelling copy in the world will remain unseen.

In this guide, we covers the essential protocols every engineer must deploy to ensure 100% indexing health.

## 1. Perfecting XML Sitemaps

A sitemap is a machine-readable directory map for search engines. It shouldn''t just list URLs; it must define crawl priority and edit frequencies:
* **Featured Articles**: Priority `1.0` (critical core landing pages)
* **Trending Articles**: Priority `0.9` (fresh, viral contents)
* **Standard Articles**: Priority `0.8` (valuable static guides)
* **Categories**: Priority `0.7` (aggregate taxonomy routes)
* **Tags**: Priority `0.6` (long-tail index filters)

Each sitemap entry should follow the standard XML namespace layout:

```xml
<url>
  <loc>https://www.inkauth.in/blog/ultimate-guide-to-technical-seo</loc>
  <lastmod>2026-05-26T00:00:00.000Z</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>
```

## 2. Dynamic JSON-LD Structured Data

Search engines use structured data schemas to display rich results (star ratings, FAQ accordions, search boxes) directly in search engine result pages (SERPs). For blog posts, always inject the `Article` and `BreadcrumbList` schemas in your page `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Ultimate Guide to Technical SEO in 2026",
  "image": "cover-image-url",
  "datePublished": "2026-05-26T00:00:00.000Z"
}
```

This transforms a standard search listing into an interactive, eye-catching card.

## Frequently Asked Questions

#### Does Google penalize sites with missing ALT tags on images?
While it is not an immediate penalty, search engines rely heavily on image `alt` texts to index graphics in image searches. Missing alts weaken accessibility and search performance.

#### How frequently should a sitemap be updated?
A sitemap should refresh immediately whenever any new content is created or modified to assist spiders in crawling it immediately.

## Dynamic Cache Invalidation

Deploying a 24-hour cache limit is a solid fallback, but instant updates are superior. By calling a secure webhook on your frontend app whenever a post changes:

```typescript
// /api/revalidate/route.ts
import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true });
}
```

You ensure that your readers and search crawlers always see the freshest revisions instantly.',
    'A comprehensive handbook on sitemaps, JSON-LD schemas, cache invalidations, and robots.txt protocols to guarantee 100% crawl accuracy.',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop',
    'published',
    '2026-05-26 00:00:00',
    'seo-content', 'SEO & Content',
    'seo, saas',
    'The Ultimate Guide to Technical SEO in 2026 | Inkauth',
    'Maximize your crawl budgets and search visibility. Read our 2026 master guide detailing sitemap hierarchies, dynamic JSON-LD schemas, and instant revalidation.',
    'technical seo',
    'https://www.inkauth.in/blog/ultimate-guide-to-technical-seo',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop',
    1,
    0, 1, 4, 95,
    'seo, technical seo, sitemaps, JSON-LD'
);
