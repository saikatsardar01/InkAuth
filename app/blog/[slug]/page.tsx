import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import TableOfContents from "@/components/TableOfContents";
import BlogShareButtons from "@/components/BlogShareButtons";
import NewsletterCTA from "@/components/NewsletterCTA";
import { getBlogPostBySlug, getRelatedPosts, suggestInternalLinks } from "@/lib/blog-db";
import { Clock, Calendar, ChevronRight, User, ArrowLeft, ArrowUpRight, Award, Hash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Ensure KaTeX css loads
import type { Metadata } from "next";

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const data = await getBlogPostBySlug(params.slug);
  if (!data) return {};

  const { post, seo } = data;
  const title = seo?.meta_title || `${post.title} | Inkauth Blog`;
  const description = seo?.meta_description || post.summary || "";
  const canonical = seo?.canonical_url || `https://www.inkauth.in/blog/${post.slug}`;
  const ogImage = seo?.og_image || post.cover_image || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop";

  return {
    title,
    description,
    keywords: post.keywords || undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Inkauth",
      images: [{ url: ogImage, alt: post.title }],
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      tags: data.tags.map(t => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: seo?.sitemap_include === 1,
      follow: true,
    }
  };
}

// Automatically parses FAQ schemas from markdown headers/paragraphs
function parseFAQsFromMarkdown(markdown: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = markdown.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match headers starting with ### or #### containing a question mark
    if ((line.startsWith("###") || line.startsWith("####")) && line.includes("?")) {
      const question = line.replace(/^(#+)\s+/, "").trim();
      let answer = "";
      
      // Look at the following lines for the answer block
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith("#")) break; // Next header ends answer
        if (nextLine) {
          answer += (answer ? "\n" : "") + nextLine;
        }
      }
      
      if (question && answer) {
        faqs.push({ question, answer: answer.replace(/\*|_|`/g, "") });
      }
    }
  }
  
  return faqs;
}

export default async function BlogPostDetailPage(props: PageProps) {
  const params = await props.params;
  const data = await getBlogPostBySlug(params.slug);
  if (!data) notFound();

  const { post, category, tags, seo } = data;

  // Concurrently fetch related data
  const [relatedPosts, internalLinkSuggestions] = await Promise.all([
    getRelatedPosts(post.id, post.category_id, 3),
    suggestInternalLinks(post.content, post.id)
  ]);

  const faqs = parseFAQsFromMarkdown(post.content);

  // Schema structured JSON-LD data builders
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.inkauth.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.inkauth.in/blog"
      },
      category ? {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://www.inkauth.in/blog/category/${category.slug}`
      } : null,
      {
        "@type": "ListItem",
        "position": category ? 4 : 3,
        "name": post.title,
        "item": `https://www.inkauth.in/blog/${post.slug}`
      }
    ].filter(Boolean)
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200&auto=format&fit=crop",
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": "Inkauth Engineering"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Inkauth",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.inkauth.in/favicon.ico"
      }
    },
    "description": post.summary || "",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.inkauth.in/blog/${post.slug}`
    }
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Custom components to pass to react-markdown to inject IDs into headers dynamically
  const markdownComponents = {
    h2: ({ node, ...props }: any) => {
      const text = props.children?.toString() || "";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h2 id={id} className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-12 mb-6" {...props} />;
    },
    h3: ({ node, ...props }: any) => {
      const text = props.children?.toString() || "";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h3 id={id} className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-8 mb-4" {...props} />;
    },
    img: ({ node, alt, ...props }: any) => (
      <span className="block my-8 space-y-2">
        <img {...props} alt={alt || post.title} className="w-full rounded-[2rem] border border-border shadow-md object-cover max-h-[500px]" loading="lazy" />
        {alt && <span className="block text-center text-xs font-medium text-foreground/40 italic">{alt}</span>}
      </span>
    )
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 relative">
      {/* Dynamic Watery Progress Bar */}
      <ScrollProgress />
      <Navbar />

      {/* JSON-LD Schema Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-card border border-border text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>
        </div>

        {/* Semantic Breadcrumbs HUD */}
        <nav className="flex items-center gap-2 text-xs font-bold text-foreground/40 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              <Link href={`/blog/category/${category.slug}`} className="hover:text-foreground transition-colors uppercase tracking-wider text-[10px]">{category.name}</Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-foreground/70 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header Cover Banner */}
        <header className="space-y-8 mb-12">
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-black text-xs uppercase tracking-wider"
                >
                  {category.name}
                </Link>
              )}
              <div className="flex items-center gap-1.5 text-foreground/40 text-xs font-bold">
                <Clock className="w-4 h-4" />
                {post.reading_time} min read
              </div>
              {post.seo_score > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  SEO Score: {post.seo_score}/100
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              {post.title}
            </h1>

            <p className="text-foreground/50 text-lg sm:text-xl font-medium leading-relaxed italic max-w-3xl">
              "{post.summary}"
            </p>
          </div>

          <div className="flex items-center justify-between py-5 border-y border-border/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm text-foreground">Inkauth Engineering</span>
                <span className="block text-xs font-semibold text-foreground/40">Core Team Developers</span>
              </div>
            </div>

            <div className="text-right text-xs font-bold text-foreground/40 uppercase tracking-widest">
              <Calendar className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
            </div>
          </div>

          <div className="aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-border shadow-xl">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Inkauth Journal Cover
              </div>
            )}
          </div>
        </header>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main content prose */}
          <article className="lg:col-span-8 space-y-8 min-w-0">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-500 hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-border prose-pre:rounded-2xl">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={markdownComponents as any}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags footer */}
            {tags.length > 0 && (
              <div className="pt-8 border-t border-border flex flex-wrap items-center gap-2">
                <Hash className="w-4 h-4 text-foreground/35" />
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sticky Widgets Sidebar column */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Scroll-tracked TOC */}
            <TableOfContents content={post.content} />

            {/* Contextual internal links suggestions */}
            {internalLinkSuggestions.length > 0 && (
              <div className="bg-card/20 border border-border p-6 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Recommended</h4>
                </div>
                <div className="space-y-4">
                  {internalLinkSuggestions.map((sug) => (
                    <Link
                      key={`sug-${sug.slug}`}
                      href={`/blog/${sug.slug}`}
                      className="group flex flex-col p-3 rounded-2xl bg-card border border-border hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all"
                    >
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                        Contextual Match
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                      <span className="font-bold text-xs text-foreground group-hover:text-indigo-500 transition-colors leading-tight line-clamp-2">
                        {sug.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Buttons */}
            <BlogShareButtons title={post.title} />
          </aside>
        </div>

        {/* Related Articles section */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border pt-16 mt-20 space-y-8">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Related <span className="text-indigo-500 italic">Resources</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={`related-${rPost.slug}`}
                  href={`/blog/${rPost.slug}`}
                  className="group flex flex-col justify-between bg-card/20 border border-border hover:border-foreground/15 rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-900 border border-border/50">
                      {rPost.cover_image ? (
                        <img
                          src={rPost.cover_image}
                          alt={rPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          Inkauth
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-bold text-[9px] uppercase tracking-wider">
                        {rPost.category_name || "General"}
                      </span>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors leading-snug line-clamp-2">
                        {rPost.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-border/40 flex justify-between items-center text-[10px] font-bold text-foreground/40 uppercase">
                    <span>{rPost.reading_time} min read</span>
                    <span className="text-indigo-500 flex items-center gap-0.5 font-black group-hover:translate-x-1 transition-transform">
                      Read
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <NewsletterCTA />
      </div>

      <Footer />
    </main>
  );
}
