import { visualAssets } from "./visualAssets";

export type SeededBlogPost = {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  coverImageUrl: string;
  publishedAt: string;
  content: { _type: "block"; children: { _type: "span"; text: string }[] }[];
};

export const blogPageSeed = {
  eyebrow: "Blog & Pet Advice",
  title: "Pet advice",
  description:
    "Clear, practical articles for new clients and routine pet care questions, presented in a calmer editorial layout.",
  introEyebrow: "Latest Advice",
  introTitle: "Latest reads",
  introDescription:
    "Short, practical reads should help owners find the next useful answer quickly, without turning the page into a crowded news feed.",
  ctaTitle: "Need guidance sooner?",
  ctaText:
    "If the question feels urgent, contact the practice directly rather than waiting to read further.",
  ctaPrimaryLabel: "Book Online",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
  feedbackEyebrow: "Feedback",
  feedbackTitle: "Was this helpful?",
  feedbackDescription:
    "Quick feedback can later connect to a fuller CMS-backed workflow without changing the page design.",
  feedbackHelpfulLabel: "Yes",
  feedbackMoreLabel: "Need more",
  feedbackContactLabel: "Contact us",
  feedbackHelpfulResponse: "Thanks. More practical guidance can be added here through the CMS.",
  feedbackMoreResponse: "The next version can surface related posts, FAQs, or direct booking routes here.",
  feedbackContactResponse: "For anything specific, use the direct contact route rather than waiting on content.",
  browseMoreLabel: "Browse articles",
  browseMoreHref: "/blog",
  askDirectLabel: "Contact the practice",
  askDirectHref: "/contact",
};

export const seededBlogPosts: SeededBlogPost[] = [
  {
    _id: "blog-first-visit-guide",
    _type: "blogPost",
    title: "What to expect at your first visit",
    slug: { current: "what-to-expect-at-your-first-visit" },
    category: "New Clients",
    excerpt: "Registration, consultation flow, and what to bring before your first appointment.",
    coverImageUrl:
      visualAssets.gingerSpanielHero,
    publishedAt: "2026-07-01T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "A first visit should feel straightforward. If possible, register in advance, bring any previous records or medication details, and note any recent changes you want to mention during the appointment.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The aim is to make early conversations calm and clear. A first consultation should help owners understand the immediate plan, any follow-up recommendations, and what happens next.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-preventative-care-plans",
    _type: "blogPost",
    title: "Understanding preventative care plans",
    slug: { current: "understanding-preventative-care-plans" },
    category: "Health Plan",
    excerpt: "How a monthly plan can support routine care costs without replacing insurance.",
    coverImageUrl:
      visualAssets.gingerCatHero,
    publishedAt: "2026-07-03T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "A preventative care plan is built around routine needs such as boosters, parasite treatment, and health checks. It is useful for spreading predictable care costs across the year.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "It is different from insurance. Insurance helps with unexpected illness or accidents, while a health plan usually supports the regular, everyday aspects of keeping care on track.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-when-to-call-urgently",
    _type: "blogPost",
    title: "When to call urgently",
    slug: { current: "when-to-call-urgently" },
    category: "Emergency",
    excerpt: "Urgent contact triggers, in-hours calls, and out-of-hours direction.",
    coverImageUrl:
      visualAssets.goldenDogWarm,
    publishedAt: "2026-07-05T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "If your pet has a sudden collapse, breathing difficulty, significant bleeding, or a rapidly worsening condition, it is better to call urgently rather than wait for an online response.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The website should always make in-hours and out-of-hours routes obvious. Owners should not need to guess which number to use when time matters.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-puppy-kitten-checks",
    _type: "blogPost",
    title: "Puppy & kitten health checks explained",
    slug: { current: "puppy-kitten-health-checks-explained" },
    category: "Routine Care",
    excerpt: "A quick overview of what these early appointments usually cover.",
    coverImageUrl:
      visualAssets.gingerCatCare,
    publishedAt: "2026-06-28T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Early health checks help build confidence from the beginning. They usually cover general wellbeing, weight, vaccination planning, parasite guidance, and any practical questions about settling a new pet at home.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "For owners, the most useful part is often clarity: what is normal, what to keep an eye on, and when to book again if something changes.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-early-diagnosis-matters",
    _type: "blogPost",
    title: "Why early diagnosis matters for pets",
    slug: { current: "why-early-diagnosis-matters-for-pets" },
    category: "Diagnostics",
    excerpt: "Small changes spotted early can make treatment planning clearer and calmer.",
    coverImageUrl:
      visualAssets.goldenDogCare,
    publishedAt: "2026-06-24T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Early diagnosis does not always mean something serious is happening. Very often, it simply means a problem is identified before it becomes more uncomfortable, more complicated, or harder to explain.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "For owners, acting early usually leads to clearer decision-making. It can reduce uncertainty, speed up practical next steps, and make treatment conversations feel less overwhelming.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-registering-before-visit",
    _type: "blogPost",
    title: "Registering before your first appointment",
    slug: { current: "registering-before-your-first-appointment" },
    category: "Registration",
    excerpt: "A simple checklist for records, medication notes, and smoother booking steps.",
    coverImageUrl:
      visualAssets.warmPetOwner,
    publishedAt: "2026-06-20T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Registering ahead of time usually makes the first visit calmer. It gives the team a better starting point and reduces last-minute form filling on arrival.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "If you have recent notes, medication details, or previous vaccination records, sending them early can help the first consultation focus on the pet rather than admin.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-routine-health-checks",
    _type: "blogPost",
    title: "Why routine health checks still matter",
    slug: { current: "why-routine-health-checks-still-matter" },
    category: "Routine Care",
    excerpt: "Preventative appointments often catch smaller issues before they become disruptive.",
    coverImageUrl:
      visualAssets.warmClinicDog,
    publishedAt: "2026-06-17T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Routine checks are not only about vaccinations. They create space to notice subtle changes in weight, skin, mobility, appetite, or behaviour before those changes feel more urgent.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "For owners, this often means clearer decision-making and fewer surprises, especially when a pet has started to change gradually rather than suddenly.",
          },
        ],
      },
    ],
  },
  {
    _id: "blog-local-first-visit-planning",
    _type: "blogPost",
    title: "Planning a calmer first visit in Sutton",
    slug: { current: "planning-a-calmer-first-visit-in-sutton" },
    category: "Local Guide",
    excerpt: "A local-first guide to timing, arrival, and practical reassurance before the appointment.",
    coverImageUrl:
      visualAssets.softVetCare,
    publishedAt: "2026-06-12T09:00:00.000Z",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Often the hardest part of a first visit is not the consultation itself, but the uncertainty beforehand. Travel timing, parking, carrier stress, and what to bring can all add pressure.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Clear practical guidance before the visit helps reduce that pressure. A good local practice website should answer those small questions early, not leave them buried on a contact page.",
          },
        ],
      },
    ],
  },
];
