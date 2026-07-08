type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function PageIntro({ eyebrow, title, description, align = "left" }: PageIntroProps) {
  return (
    <section className={`page-intro page-intro-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-copy">{description}</p>
    </section>
  );
}
