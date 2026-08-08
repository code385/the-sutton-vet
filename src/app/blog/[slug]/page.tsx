import { redirect } from "next/navigation";

type BlogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogSlugPage(_props: BlogSlugPageProps) {
  redirect("/contact");
}
