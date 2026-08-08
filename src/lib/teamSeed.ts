import { visualAssets } from "./visualAssets";

export type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  category: "Veterinary Surgeon" | "RVN" | "Client Care" | "Reception" | "Leadership";
  qualifications?: string;
  shortBio: string;
  bio: string;
  imageUrl: string;
  displayOrder: number;
};

export const teamPageSeed = {
  heroEyebrow: "Meet The Team",
  heroTitle: "A capable team you can trust.",
  heroDescription:
    "Clinicians, nurses, and client care support working together.",
  heroImageUrl:
    visualAssets.gingerSpanielHero,
  introEyebrow: "Our Team",
  introTitle: "People who make care feel personal.",
  introDescription:
    "The Sutton Vet team page should feel polished, human, and easy to browse. Hover for a quick introduction, then open the profile for fuller background and role detail.",
};

export const fallbackTeamMembers: TeamMemberRecord[] = [
  {
    id: "clinical-lead-amelia-ward",
    name: "Dr Amelia Ward",
    role: "Clinical Lead",
    category: "Veterinary Surgeon",
    qualifications: "BVetMed MRCVS",
    shortBio: "Founder-led clinical care with a calm, continuity-first style.",
    bio: "Amelia leads the clinical direction of the practice with a strong focus on continuity, transparent advice, and calmer decision-making for owners. Her approach is grounded in long-term patient relationships, evidence-based care, and making consultations feel clear rather than rushed.",
    imageUrl: visualAssets.gingerCatHero,
    displayOrder: 1,
  },
  {
    id: "vet-oliver-brooks",
    name: "Dr Oliver Brooks",
    role: "Veterinary Surgeon",
    category: "Veterinary Surgeon",
    qualifications: "BVSc MRCVS",
    shortBio: "General practice vet with a practical, reassuring communication style.",
    bio: "Oliver enjoys building clarity around diagnostics, treatment planning, and first-visit conversations. He has a particular interest in internal medicine and helping owners feel confident about next steps before treatment decisions are made.",
    imageUrl: visualAssets.goldenDogWarm,
    displayOrder: 2,
  },
  {
    id: "rvn-sophia-reed",
    name: "Sophia Reed",
    role: "Senior RVN",
    category: "RVN",
    qualifications: "RVN",
    shortBio: "Nurse-led preventative care and calmer in-practice support.",
    bio: "Sophia supports preventative care, inpatient comfort, and practical owner guidance across routine appointments. She is especially focused on keeping the client journey smooth, whether that means follow-up support, nurse clinics, or day-to-day patient reassurance.",
    imageUrl: visualAssets.gingerCatCare,
    displayOrder: 3,
  },
  {
    id: "rvn-ella-hart",
    name: "Ella Hart",
    role: "Registered Veterinary Nurse",
    category: "RVN",
    qualifications: "RVN",
    shortBio: "Warm clinical support with an eye for gentle handling and continuity.",
    bio: "Ella brings a calm, approachable presence to both patients and owners. Her work spans routine checks, preventative support, and making sure the practice experience feels thoughtful and well-organised from admission through discharge.",
    imageUrl: visualAssets.goldenDogCare,
    displayOrder: 4,
  },
  {
    id: "client-care-lucy-dale",
    name: "Lucy Dale",
    role: "Client Care Lead",
    category: "Client Care",
    qualifications: "Client Care",
    shortBio: "First-contact support that keeps registration and booking straightforward.",
    bio: "Lucy helps new and existing clients navigate appointments, registration, and practical next steps with clarity. Her role is to reduce friction around the administrative side of care so the whole journey feels calmer from the first enquiry.",
    imageUrl: visualAssets.warmPetOwner,
    displayOrder: 5,
  },
  {
    id: "reception-max-turner",
    name: "Max Turner",
    role: "Reception & Support",
    category: "Reception",
    qualifications: "Reception",
    shortBio: "Friendly operational support with practical guidance for owners.",
    bio: "Max supports the front-of-house experience by helping owners with bookings, updates, and visit logistics. He focuses on making the practice feel organised, approachable, and easy to navigate, especially for first-time clients.",
    imageUrl: visualAssets.warmClinicDog,
    displayOrder: 6,
  },
];

export const teamCategoryLabels: Array<{
  key: TeamMemberRecord["category"];
  title: string;
  summary: string;
}> = [
  {
    key: "Veterinary Surgeon",
    title: "Veterinary Surgeons",
    summary: "Clinical leadership, diagnosis, treatment planning, and continuity-led care.",
  },
  {
    key: "RVN",
    title: "Nursing Team",
    summary: "Preventative support, inpatient care, and practical nurse-led guidance.",
  },
  {
    key: "Client Care",
    title: "Client Care",
    summary: "Warm first-contact communication and registration support.",
  },
  {
    key: "Reception",
    title: "Reception",
    summary: "Friendly front-of-house support and smoother visit logistics.",
  },
  {
    key: "Leadership",
    title: "Leadership",
    summary: "Practice direction, standards, and long-term service shaping.",
  },
];
