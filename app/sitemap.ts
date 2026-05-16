import type { MetadataRoute } from "next";

const BASE_URL = "https://inkauth.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/library`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/radio`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Attempt to fetch dynamic book routes
  try {
    const res = await fetch(`${BASE_URL}/api/books`, {
      next: { revalidate: 864000 },
    });

    if (res.ok) {
      const data = await res.json();
      const books: { id: string | number; updatedAt?: string }[] =
        Array.isArray(data) ? data : data.books ?? [];

      const bookRoutes: MetadataRoute.Sitemap = books.map((book) => ({
        url: `${BASE_URL}/books/${book.id}`,
        lastModified: book.updatedAt ? new Date(book.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      return [...staticRoutes, ...bookRoutes];
    }
  } catch {
    // Fall back to static routes only
  }

  return staticRoutes;
}
