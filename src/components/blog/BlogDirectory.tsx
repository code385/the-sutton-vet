"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BlogDirectoryPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImageUrl: string;
  publishedAt?: string;
};

type BlogDirectoryProps = {
  posts: BlogDirectoryPost[];
};

function formatDate(value?: string) {
  if (!value) {
    return "Recent";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatArchiveKey(value?: string) {
  if (!value) {
    return "Recent";
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogDirectory({ posts }: BlogDirectoryProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.category, post.excerpt].some((value) => value.toLowerCase().includes(term)),
    );
  }, [posts, query]);

  const featuredPost = filteredPosts[0];
  const streamPosts = filteredPosts.slice(1);
  const recentPosts = posts.slice(0, 5);
  const archives = Array.from(new Set(posts.map((post) => formatArchiveKey(post.publishedAt))));
  const categories = Array.from(new Set(posts.map((post) => post.category))).slice(0, 6);

  return (
    <div className="blog-layout">
      <div className="blog-stream">
        {featuredPost ? (
          <article className="blog-featured-card">
            <Link
              className="blog-featured-media"
              href={`/blog/${featuredPost.slug}`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(18, 28, 42, 0.08), rgba(18, 28, 42, 0.28)), url(${featuredPost.coverImageUrl})`,
              }}
              aria-label={featuredPost.title}
            />

            <div className="blog-featured-copy">
              <div className="blog-meta-row">
                <span className="eyebrow">{featuredPost.category}</span>
                <span className="blog-date">{formatDate(featuredPost.publishedAt)}</span>
              </div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <Link className="button blog-read-button" href={`/blog/${featuredPost.slug}`}>
                Read article
              </Link>
            </div>
          </article>
        ) : null}

        {streamPosts.length ? (
          <div className="blog-list-grid">
            {streamPosts.map((post) => (
              <article key={post.id} className="blog-list-card">
                <Link
                  className="blog-list-image"
                  href={`/blog/${post.slug}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(18, 28, 42, 0.04), rgba(18, 28, 42, 0.16)), url(${post.coverImageUrl})`,
                  }}
                  aria-label={post.title}
                />

                <div className="blog-list-copy">
                  <div className="blog-meta-row">
                    <span className="eyebrow">{post.category}</span>
                    <span className="blog-date">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <Link className="text-link blog-inline-link" href={`/blog/${post.slug}`}>
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!filteredPosts.length ? (
          <div className="blog-empty-card">
            <p className="eyebrow">No matches</p>
            <h3>Try a simpler search.</h3>
            <p>Search by topic such as first visit, emergency, diagnostics, or health plan.</p>
          </div>
        ) : null}
      </div>

      <aside className="blog-sidebar">
        <div className="blog-sidebar-card">
          <p className="eyebrow">Search</p>
          <h3>Find an article</h3>
          <label className="blog-search-box">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blog articles"
              aria-label="Search blog articles"
            />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>

        <div className="blog-sidebar-card">
          <p className="eyebrow">Recent posts</p>
          <div className="blog-sidebar-list">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="blog-sidebar-card">
          <p className="eyebrow">Topics</p>
          <div className="blog-topic-pills">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
        </div>

        <div className="blog-sidebar-card">
          <p className="eyebrow">Archives</p>
          <div className="blog-sidebar-list blog-sidebar-list-compact">
            {archives.map((archive) => (
              <span key={archive}>{archive}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
