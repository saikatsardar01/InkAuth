import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, secret } = body;

    // Secure webhook token check
    if (secret !== "inkauth-secret-token") {
      return NextResponse.json({ message: "Invalid token secret" }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
      
      // If it's a specific post, revalidate general listing elements as well
      if (path.startsWith("/blog/")) {
        revalidatePath("/blog");
        revalidatePath("/blog-sitemap.xml");
        revalidatePath("/rss.xml");
      }
      
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default global blog invalidation
    revalidatePath("/blog");
    revalidatePath("/blog-sitemap.xml");
    revalidatePath("/rss.xml");
    
    return NextResponse.json({ revalidated: true, message: "Global blog cache purged" });
  } catch (err: any) {
    console.error("Cache invalidation hook error:", err);
    return NextResponse.json({ message: "Revalidation failed", error: err.message }, { status: 500 });
  }
}
