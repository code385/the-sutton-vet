import { BlogDirectory } from "@/components/blog/BlogDirectory";
import { Reveal } from "@/components/shared/Reveal";
import { SectionCta } from "@/components/shared/SectionCta";
import { blogPageSeed, seededBlogPosts } from "@/lib/blogSeed";
import { getBlogPosts } from "@/sanity/lib/blog";
import { getBlogPageDocument } from "@/sanity/lib/contentPages";

export default async function BlogPage() {
  const [sanityPosts, blogPageDocument] = await Promise.all([getBlogPosts(), getBlogPageDocument()]);
  const page = blogPageDocument || blogPageSeed;
  const posts = sanityPosts.length ? sanityPosts : seededBlogPosts;
  const normalizedPosts = posts.map((post) => ({
    id: post._id,
    title: post.title || "Untitled article",
    slug: post.slug?.current || "",
    category: post.category || "Advice",
    excerpt: post.excerpt || "Practical veterinary guidance will appear here.",
    coverImageUrl: post.coverImageUrl || seededBlogPosts[0].coverImageUrl,
    publishedAt: post.publishedAt,
  }));

  return (
    <>
      <section className="blog-page-hero full-bleed-section">
        <Reveal variant="up" className="services-page-hero-reveal">
          <div className="services-page-banner blog-page-banner">
            <div className="shell services-page-banner-shell">
              <p className="eyebrow">{page.eyebrow || blogPageSeed.eyebrow}</p>
              <h1>{page.title || blogPageSeed.title}</h1>
              <p className="services-page-banner-copy">{page.description || blogPageSeed.description}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="blog-page-section shell">
        <Reveal variant="up">
          <div className="section-heading">
            <p className="eyebrow">{page.introEyebrow || blogPageSeed.introEyebrow}</p>
            <h2>{page.introTitle || blogPageSeed.introTitle}</h2>
            <p className="section-intro-copy">{page.introDescription || blogPageSeed.introDescription}</p>
          </div>
        </Reveal>
        <BlogDirectory posts={normalizedPosts} />
      </section>

      <SectionCta
        eyebrow="Next Step"
        title={page.ctaTitle || "Need guidance sooner?"}
        text={page.ctaText || "If the question feels urgent, contact the practice directly rather than waiting to read further."}
        primaryLabel={page.ctaPrimaryLabel}
        primaryHref={page.ctaPrimaryHref}
        secondaryLabel={page.ctaSecondaryLabel}
        secondaryHref={page.ctaSecondaryHref}
      />
    </>
  );
}
