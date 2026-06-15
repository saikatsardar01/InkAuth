import BlogListingPage, { generateMetadata as generateMainMetadata } from "../../page";
import type { Metadata } from "next";

export const revalidate = 86400; // 24 hours

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  // Reuse listing generator by shaping parameters
  return generateMainMetadata({
    searchParams: Promise.resolve({
      ...searchParams,
      category: params.category
    })
  });
}

export default async function CategoryArchivePage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Pass down category filter to the central BlogListingPage component
  return (
    <BlogListingPage
      searchParams={Promise.resolve({
        ...searchParams,
        category: params.category
      })}
    />
  );
}
