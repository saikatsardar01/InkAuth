import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blog-db";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    const { posts } = await getBlogPosts({ status: "published", limit: 20, offset: 0 });
    const BASE_URL = "https://www.inkauth.in";

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Inkauth Journal</title>
  <link>${BASE_URL}/blog</link>
  <description>Technical guides, product releases, database insights, and engineering articles from the Inkauth core team.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`;

    posts.forEach((post) => {
      const postUrl = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date(post.created_at).toUTCString();

      rss += `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${post.summary || ""}]]></description>
    <content:encoded><![CDATA[${post.content || ""}]]></content:encoded>
  </item>`;
    });

    rss += `\n</channel>\n</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("<error>Failed to generate RSS feed</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" }
    });
  }
}
