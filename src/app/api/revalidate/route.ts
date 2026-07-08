import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidatePayload = {
  _type?: string;
  slug?: string | { current?: string };
  pageType?: string;
};

const allSitePaths = [
  "/",
  "/services",
  "/health-plan",
  "/fees",
  "/meet-the-team",
  "/contact",
  "/first-visit",
  "/faq",
  "/blog",
  "/privacy-policy",
  "/cookie-policy",
  "/accessibility",
  "/terms",
];

function normalizeSlug(slug: RevalidatePayload["slug"]) {
  if (!slug) {
    return "";
  }

  if (typeof slug === "string") {
    return slug;
  }

  return slug.current || "";
}

function getLegalPath(pageType?: string, slug?: string) {
  if (slug) {
    const cleanSlug = slug.replace(/^\/+/, "");
    return cleanSlug.startsWith("/") ? cleanSlug : `/${cleanSlug}`;
  }

  switch (pageType) {
    case "Privacy Policy":
      return "/privacy-policy";
    case "Cookie Policy":
      return "/cookie-policy";
    case "Accessibility Statement":
      return "/accessibility";
    case "Terms of Business":
      return "/terms";
    default:
      return "";
  }
}

function resolvePaths(payload: RevalidatePayload) {
  const type = payload._type;
  const slug = normalizeSlug(payload.slug);
  const paths = new Set<string>();

  switch (type) {
    case "siteSettings":
    case "emergencySettings":
      allSitePaths.forEach((path) => paths.add(path));
      break;
    case "homePage":
      paths.add("/");
      break;
    case "servicesPage":
    case "service":
      paths.add("/");
      paths.add("/services");
      break;
    case "teamPage":
    case "teamMember":
      paths.add("/");
      paths.add("/meet-the-team");
      break;
    case "pricingPage":
    case "feeCategory":
      paths.add("/fees");
      paths.add("/health-plan");
      break;
    case "healthPlan":
      paths.add("/");
      paths.add("/health-plan");
      paths.add("/fees");
      break;
    case "firstVisitPage":
      paths.add("/");
      paths.add("/first-visit");
      break;
    case "faqPage":
    case "faq":
      paths.add("/");
      paths.add("/faq");
      paths.add("/health-plan");
      break;
    case "blogPage":
      paths.add("/");
      paths.add("/blog");
      break;
    case "blogPost":
      paths.add("/");
      paths.add("/blog");
      if (slug) {
        paths.add(`/blog/${slug}`);
      }
      break;
    case "contactPage":
      paths.add("/");
      paths.add("/contact");
      break;
    case "legalPage": {
      const legalPath = getLegalPath(payload.pageType, slug);
      if (legalPath) {
        paths.add(legalPath);
      }
      break;
    }
    default:
      allSitePaths.forEach((path) => paths.add(path));
      break;
  }

  return Array.from(paths);
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("x-sanity-revalidate-secret");

  if (!secret) {
    return {
      ok: false,
      status: 500,
      message: "Missing SANITY_REVALIDATE_SECRET on the server.",
    };
  }

  if (!provided || provided !== secret) {
    return {
      ok: false,
      status: 401,
      message: "Invalid revalidation secret.",
    };
  }

  return { ok: true as const };
}

async function runRevalidation(request: NextRequest) {
  const auth = isAuthorized(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  let payload: RevalidatePayload = {};

  if (request.method === "POST") {
    try {
      payload = (await request.json()) as RevalidatePayload;
    } catch {
      payload = {};
    }
  }

  const paths = resolvePaths(payload);
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    ok: true,
    revalidated: true,
    type: payload._type || "manual",
    paths,
  });
}

export async function POST(request: NextRequest) {
  return runRevalidation(request);
}

export async function GET(request: NextRequest) {
  return runRevalidation(request);
}
