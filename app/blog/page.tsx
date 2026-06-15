import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import BlogSearch from "@/components/BlogSearch";
import { getBlogPosts, getCategories, getTags, BlogPost } from "@/lib/blog-db";
import { Star, Clock, Calendar, ArrowRight, ArrowLeft, TrendingUp, Hash } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)

export async function generateMetadata(props: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; tag?: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const category = searchParams.category || "";
  const tag = searchParams.tag || "";
  const page = searchParams.page || "1";

  let title = "Inkauth Blog - Engineering, Product Updates & SEO Insights";
  let description = "Read premium tech guides, product changelogs, database architectures, and master technical SEO with the Inkauth engineering team.";

  if (category) {
    title = `Blog Categories: ${category.replace("-", " ")} | Inkauth`;
    description = `Explore high-quality articles in the ${category} category from our engineering and product teams.`;
  } else if (tag) {
    title = `Articles tagged with #${tag} | Inkauth`;
    description = `Browse our collection of guides, case studies, and engineering resources tagged with ${tag}.`;
  }

  const canonical = `https://www.inkauth.in/blog${
    category ? `/category/${category}` : tag ? `/tag/${tag}` : ""
  }${page !== "1" ? `?page=${page}` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Inkauth",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: "Inkauth Blog",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop"],
    },
  };
}

export default async function BlogListingPage(props: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; tag?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, Number(searchParams.page || "1"));
  const searchQuery = searchParams.search || "";
  const categoryFilter = searchParams.category || "";
  const tagFilter = searchParams.tag || "";
  const limit = 8;
  const offset = (currentPage - 1) * limit;

  // Fetch data concurrently for high performance
  const [
    { posts, totalCount },
    featuredPostsRes,
    trendingPostsRes,
    categories,
    tags
  ] = await Promise.all([
    getBlogPosts({
      status: 'published',
      limit,
      offset,
      categorySlug: categoryFilter,
      tagSlug: tagFilter,
      search: searchQuery
    }),
    getBlogPosts({ status: 'published', isFeatured: true, limit: 1 }),
    getBlogPosts({ status: 'published', isTrending: true, limit: 4 }),
    getCategories(),
    getTags()
  ]);

  const featuredPost = featuredPostsRes.posts[0] || null;
  const trendingPosts = trendingPostsRes.posts;
  const totalPages = Math.ceil(totalCount / limit);

  // Pagination navigation helpers (ensure crawlability)
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter) params.set("category", categoryFilter);
    if (tagFilter) params.set("tag", tagFilter);
    params.set("page", pageNumber.toString());
    return `/blog?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Hub Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border pb-12 mb-12">
          <div className="space-y-4 max-w-xl">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] inline-block">
              Resources & Insights
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground">
              The Inkauth <span className="text-indigo-500 italic">Journal</span>
            </h1>
            <p className="text-foreground/50 font-medium text-lg leading-relaxed">
              Technical guides, deep dives, and changelogs from the developers and creators of the Inkauth publishing network.
            </p>
          </div>
          
          <div className="w-full lg:w-auto">
            <BlogSearch initialValue={searchQuery} />
          </div>
        </div>

        {/* Categories & Tags Filtering HUD */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <span className="text-sm font-black text-foreground/40 uppercase tracking-widest mr-2">Categories:</span>
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !categoryFilter && !tagFilter && !searchQuery
                ? "bg-foreground text-background shadow-lg"
                : "bg-card hover:bg-foreground/5 text-foreground/60 hover:text-foreground border border-border"
            }`}
          >
            All Articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                categoryFilter === cat.slug
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-card hover:bg-foreground/5 text-foreground/60 hover:text-foreground border border-border"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Active Filters Info Banner */}
        {(categoryFilter || tagFilter || searchQuery) && (
          <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl mb-12 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-indigo-400 font-semibold">
              <span>Filtering by:</span>
              {categoryFilter && <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 uppercase tracking-wider text-xs">Category: {categoryFilter}</span>}
              {tagFilter && <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 uppercase tracking-wider text-xs">Tag: #{tagFilter}</span>}
              {searchQuery && <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 uppercase tracking-wider text-xs">Search: "{searchQuery}"</span>}
            </div>
            <Link href="/blog" className="text-xs text-foreground/40 hover:text-foreground underline font-bold">
              Clear All
            </Link>
          </div>
        )}

        {/* Featured Hero Article Section */}
        {featuredPost && currentPage === 1 && !searchQuery && !categoryFilter && !tagFilter && (
          <section className="relative group rounded-[2.5rem] overflow-hidden border border-border bg-card/20 hover:border-foreground/15 transition-all duration-500 shadow-xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden">
                {featuredPost.cover_image ? (
                  <img
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                    Featured
                  </div>
                )}
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-amber-500/90 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Featured Post
                </div>
              </div>

              <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      {featuredPost.category_name || "Uncategorized"}
                    </span>
                    <div className="flex items-center gap-1 text-foreground/40 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.reading_time} min read
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground group-hover:text-indigo-500 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-foreground/50 font-medium text-base sm:text-lg leading-relaxed line-clamp-3">
                    {featuredPost.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 text-foreground/40 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="flex items-center gap-2 text-indigo-500 group-hover:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] transition-all"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Articles Stream Grid (8 articles/page) */}
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-2xl font-black tracking-tighter text-foreground border-b border-border pb-4 mb-8">
              {searchQuery || categoryFilter || tagFilter ? "Filtered Articles" : "Latest Articles"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
              {posts.map((post) => (
                <article key={post.slug} className="group flex flex-col justify-between bg-card/20 border border-border/80 hover:border-foreground/15 rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1">
                  <div className="space-y-4">
                    {/* Cover image container */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 border border-border/50">
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          Inkauth
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider">
                          {post.category_name || "General"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-foreground/40 text-xs font-semibold">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.reading_time} min
                        </div>
                      </div>

                      <h4 className="font-bold text-lg text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-foreground/50 font-medium text-sm leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40 flex justify-end">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1.5 text-indigo-500 font-black text-[10px] uppercase tracking-[0.15em]"
                    >
                      Read Now
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}

              {posts.length === 0 && (
                <div className="sm:col-span-2 text-center py-20 bg-card/10 border border-dashed border-border rounded-[2rem] space-y-3">
                  <p className="text-foreground/40 text-lg font-medium">No articles matched your filter criteria.</p>
                  <Link href="/blog" className="text-indigo-500 text-sm font-bold hover:underline">
                    Clear filters & return to Blog
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination Controls - Clean crawable linking */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-between border-t border-border pt-8 mt-12" aria-label="Pagination">
                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={getPageUrl(currentPage - 1)}
                      className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-card border border-border text-foreground hover:bg-foreground/5 transition-all text-xs font-black uppercase tracking-wider"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Prev
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-card/10 border border-border/40 text-foreground/30 text-xs font-black uppercase tracking-wider cursor-not-allowed">
                      <ArrowLeft className="w-4 h-4" />
                      Prev
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Link
                        key={`page-${pageNum}`}
                        href={getPageUrl(pageNum)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                          isActive
                            ? "bg-foreground text-background font-black shadow-md"
                            : "bg-card text-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-border"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={getPageUrl(currentPage + 1)}
                      className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-card border border-border text-foreground hover:bg-foreground/5 transition-all text-xs font-black uppercase tracking-wider"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-card/10 border border-border/40 text-foreground/30 text-xs font-black uppercase tracking-wider cursor-not-allowed">
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </nav>
            )}
          </div>

          {/* Right Sidebar Widget Column */}
          <aside className="space-y-12 lg:pl-4">
            {/* Trending / Popular Posts widget */}
            {trendingPosts.length > 0 && (
              <div className="bg-card/20 border border-border p-6 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Trending Posts</h3>
                </div>

                <div className="space-y-5">
                  {trendingPosts.map((post, i) => (
                    <Link
                      key={`trending-${post.slug}`}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-4 items-start hover:-translate-x-1 transition-transform"
                    >
                      <span className="text-3xl font-black text-foreground/10 group-hover:text-indigo-500/20 transition-colors w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          {post.category_name || "SEO"}
                        </span>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors leading-tight line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Cloud filter widget */}
            {tags.length > 0 && (
              <div className="bg-card/20 border border-border p-6 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Hash className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Filter by Tags</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/blog/tag/${tag.slug}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        tagFilter === tag.slug
                          ? "bg-indigo-600 text-white"
                          : "bg-card hover:bg-foreground/5 text-foreground/60 hover:text-foreground border border-border"
                      }`}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Dynamic Newsletter Component */}
        <NewsletterCTA />
      </div>

      <Footer />
    </main>
  );
}
