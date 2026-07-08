import { groq } from "next-sanity";

import { safeSanityFetch } from "./client";

export type SanityTeamMember = {
  _id: string;
  name?: string;
  role?: string;
  category?: "Veterinary Surgeon" | "RVN" | "Client Care" | "Reception" | "Leadership";
  qualifications?: string;
  shortBio?: string;
  bio?: string;
  displayOrder?: number;
  imageUrl?: string;
  image?: {
    asset?: {
      url?: string;
    };
  };
};

const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(category asc, displayOrder asc, name asc){
    _id,
    name,
    role,
    category,
    qualifications,
    shortBio,
    bio,
    displayOrder,
    imageUrl,
    image{
      asset->{
        url
      }
    }
  }
`;

export async function getTeamMembers() {
  return safeSanityFetch<SanityTeamMember[]>(teamMembersQuery, undefined, []);
}
