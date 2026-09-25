import type { Vacancy } from "@/sanity/lib/careers";

export const careersPageDefaults = {
  eyebrow: "Careers at The Sutton Vet",
  title: "Build your career with us.",
  description: "Help us deliver thoughtful veterinary care at our independent practice in Hackbridge, Sutton.",
};

export const defaultVacancy: Vacancy = {
  title: "Veterinary Nurse",
  location: "Hackbridge, Sutton",
  employmentType: "Full-time / part-time considered",
  salary: "Salary to be confirmed",
  summary: "We're looking for a caring veterinary nurse to join our growing team.",
  responsibilities: ["Support consultations, procedures and patient recovery.", "Help pets and their owners feel at ease."],
  requirements: ["A compassionate approach to patient care.", "Clear communication and a collaborative attitude."],
  benefits: ["Be part of a growing independent practice.", "Help shape a personal approach to veterinary care."],
  applicationEmail: "info@thesuttonvet.co.uk",
  applicationLabel: "Apply by email",
  active: true,
  displayOrder: 10,
};
