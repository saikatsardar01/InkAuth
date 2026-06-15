import { NextResponse } from "next/server";
import { getBlogPosts, getCategories, getTags } from "@/lib/blog-db";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    // 1. Fetch all categories, tags, and published posts with sitemap settings
    const [categories, tags, { posts: allPosts }] = await Promise.all([
      getCategories(),
      getTags(),
      getBlogPosts({ status: "published", limit: 5000, offset: 0 })
    ]);

    const BASE_URL = "https://www.inkauth.in";

    // 2. Generate XML items
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // A. Add main Blog landing page
    xml += `
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // B. Add blog posts with custom priorities
    allPosts.forEach((post) => {
      let priority = "0.8"; // Standard posts
      if (post.is_featured === 1) {
        priority = "1.0"; // Featured posts
      } else if (post.is_trending === 1) {
        priority = "0.9"; // Trending posts
      }

      const postDate = post.updated_at || post.published_at || post.created_at || new Date().toISOString();
      const lastmod = new Date(postDate).toISOString();

      xml += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    // C. Add categories
    categories.forEach((cat) => {
      xml += `
  <url>
    <loc>${BASE_URL}/blog/category/${cat.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // D. Add tags
    tags.forEach((tag) => {
      xml += `
  <url>
    <loc>${BASE_URL}/blog/tag/${tag.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    // 3. Return XML response
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("<error>Failed to generate sitemap</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" }
    });
  }
}
