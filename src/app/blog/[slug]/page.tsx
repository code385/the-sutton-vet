import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogFeedback } from "@/components/blog/BlogFeedback";
import { Reveal } from "@/components/shared/Reveal";
import { seededBlogPosts } from "@/lib/blogSeed";
import { getBlogPostBySlug, getBlogPosts, portableTextToParagraphs } from "@/sanity/lib/blog";
import { getBlogPageDocument } from "@/sanity/lib/contentPages";

function formatDate(value?: string) {
  if (!value) {
    return "Recent";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const sanityPosts = await getBlogPosts();
  const posts = sanityPosts.length ? sanityPosts : seededBlogPosts;

  return posts
    .map((post) => post.slug?.current)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [sanityPost, blogPageDocument] = await Promise.all([getBlogPostBySlug(slug), getBlogPageDocument()]);
  const fallbackPost = seededBlogPosts.find((post) => post.slug.current === slug);
  const post = sanityPost || fallbackPost;

  if (!post) {
    notFound();
  }

  const paragraphs = portableTextToParagraphs(post.content);

  return (
    <>
      <section className="blog-post-hero full-bleed-section">
        <div
          className="blog-post-hero-media"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18, 28, 42, 0.44), rgba(18, 28, 42, 0.58)), url(${post.coverImageUrl || seededBlogPosts[0].coverImageUrl})`,
          }}
        />
        <div className="shell blog-post-hero-shell">
          <Reveal variant="left">
            <div className="blog-post-hero-copy">
              <Link className="text-link" href="/blog">
                Back to blog
              </Link>
              <p className="eyebrow">{post.category || "Advice"}</p>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <span className="blog-date blog-date-light">{formatDate(post.publishedAt)}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell blog-post-content-wrap">
        <Reveal variant="up">
          <article className="blog-post-content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </Reveal>

        <Reveal variant="up" delayMs={70}>
          <BlogFeedback
            eyebrow={blogPageDocument?.feedbackEyebrow}
            title={blogPageDocument?.feedbackTitle}
            description={blogPageDocument?.feedbackDescription}
            helperLabel={blogPageDocument?.feedbackHelperLabel}
            helperHref={blogPageDocument?.feedbackHelperHref}
            helpfulLabel={blogPageDocument?.feedbackHelpfulLabel}
            moreLabel={blogPageDocument?.feedbackMoreLabel}
            contactLabel={blogPageDocument?.feedbackContactLabel}
            helpfulResponse={blogPageDocument?.feedbackHelpfulResponse}
            moreResponse={blogPageDocument?.feedbackMoreResponse}
            contactResponse={blogPageDocument?.feedbackContactResponse}
            browseMoreLabel={blogPageDocument?.browseMoreLabel}
            browseMoreHref={blogPageDocument?.browseMoreHref}
            askDirectLabel={blogPageDocument?.askDirectLabel}
            askDirectHref={blogPageDocument?.askDirectHref}
          />
        </Reveal>
      </section>
    </>
  );
}
