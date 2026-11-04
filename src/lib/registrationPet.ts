export const MAX_REGISTRATION_PETS = 6;
export const breedOptions: Record<string, string[]> = {
  Dog: ["Unknown", "Crossbreed / mixed breed", "Labrador Retriever", "Golden Retriever", "German Shepherd", "French Bulldog", "Bulldog", "Cocker Spaniel", "Cockapoo", "Cavapoo", "Poodle", "Border Collie", "Dachshund", "Chihuahua", "Shih Tzu", "Staffordshire Bull Terrier", "Jack Russell Terrier", "Greyhound", "Whippet"],
  Cat: ["Unknown", "Crossbreed / mixed breed", "Domestic Shorthair", "Domestic Longhair", "British Shorthair", "Ragdoll", "Maine Coon", "Bengal", "Siamese", "Persian", "Sphynx"],
  Rabbit: ["Unknown", "Crossbreed / mixed breed", "Mini Lop", "Holland Lop", "Lionhead", "Netherland Dwarf", "Rex", "Dutch", "English Lop"],
  Other: ["Unknown", "Other"],
};

export function londonToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find(part => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function registrationText(value: unknown, label: string, max: number, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(`Please enter ${label}.`);
    return "";
  }
  if (typeof value !== "string" || value.trim().length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error(`Please check ${label} (maximum ${max} characters).`);
  const result = value.trim();
  if (required && !result) throw new Error(`Please enter ${label}.`);
  return result;
}

export function registrationDate(value: unknown, label: string, today: string) {
  const day = registrationText(value, label, 10, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < "1900-01-01" || day > today) throw new Error(`Please enter a valid ${label} that is not in the future.`);
  const parsed = new Date(`${day}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new Error(`Please enter a valid ${label}.`);
  return parsed.toISOString();
}

function integer(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || !/^\d{1,3}$/.test(value) || Number(value) > max) throw new Error(`Please enter a valid ${label}.`);
  return Number(value);
}

export function registrationPet(input: Record<string, unknown>, now = new Date()) {
  const name = registrationText(input.petName, "your pet's name", 80, true);
  const species = registrationText(input.species, "species", 50, true);
  if (!Object.hasOwn(breedOptions, species)) throw new Error("Please choose a species.");
  const breed = registrationText(input.breed, "breed", 100) || "Unknown";
  const sex = registrationText(input.sex, "sex", 20) || "Unknown";
  if (!["Male", "Female", "Unknown"].includes(sex)) throw new Error("Please choose a valid sex.");
  const neuterStatus = registrationText(input.neuterStatus, "neuter status", 20);
  if (!["", "unknown", "yes", "no"].includes(neuterStatus)) throw new Error("Please choose a valid neuter status.");
  const today = londonToday(now);
  let dob: string;
  const notes = ["Owner-reported information from website registration; please review with the owner."];
  if (input.ageMode === "date") {
    dob = registrationDate(input.dateOfBirth, "pet date of birth", today);
  } else if (input.ageMode === "age") {
    if ((input.ageYears === "" || input.ageYears === undefined) && (input.ageMonths === "" || input.ageMonths === undefined)) throw new Error("Please enter your pet's age in years or months.");
    const years = integer(input.ageYears === "" || input.ageYears === undefined ? "0" : input.ageYears, "age in years (0-100)", 100);
    const months = integer(input.ageMonths === "" || input.ageMonths === undefined ? "0" : input.ageMonths, "age in months (0-11)", 11);
    const [year, month, day] = today.split("-").map(Number);
    const target = new Date(Date.UTC(year - years, month - 1 - months, 1, 12));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    dob = target.toISOString();
    notes.push(`Approximate age: ${years} year(s), ${months} month(s) on ${today}. Date of birth estimated from this age, not confirmed.`);
  } else throw new Error("Please provide your pet's age or date of birth.");
  const neuteredDate = input.neuteredDate ? registrationDate(input.neuteredDate, "neutering date", today) : undefined;
  if (neuteredDate && neuterStatus !== "yes") throw new Error("Only enter a neutering date for a neutered pet.");
  if (neuteredDate && input.ageMode === "date" && neuteredDate < dob) throw new Error("Neutering date cannot be before the date of birth.");
  const temperament = registrationText(input.temperament, "your pet's temperament", 500, true);
  const reason = registrationText(input.reason, "the reason for an appointment", 1000, true);
  const previousPractice = registrationText(input.previousPractice, "previous daytime practice", 200);
  const clinicalNotes = registrationText(input.clinicalNotes, "previous clinical notes", 4000);
  notes.push(`Temperament / handling: ${temperament}`, `Reason for appointment: ${reason}`);
  if (previousPractice) notes.push(`Previous daytime practice: ${previousPractice}`);
  if (clinicalNotes) notes.push(`Previous vet clinical notes (text supplied by owner, not verified):\n${clinicalNotes}`);
  for (const [key, label] of [["lastVaccinationDate", "Last vaccination"], ["lastDewormingDate", "Last deworming"], ["lastFleaTickDate", "Last flea/tick prevention"]]) {
    if (!input[key]) continue;
    const value = registrationDate(input[key], label.toLowerCase() + " date", today);
    if (input.ageMode === "date" && value < dob) throw new Error(`${label} date cannot be before the date of birth.`);
    notes.push(`${label} (owner reported): ${value.slice(0, 10)}`);
  }
  const weightText = registrationText(input.weight, "weight in kg", 12);
  const weight = weightText ? Number(weightText) : undefined;
  if (weight !== undefined && (!/^\d+(\.\d{1,3})?$/.test(weightText) || !Number.isFinite(weight) || weight <= 0 || weight > 2000)) throw new Error("Please enter a weight above 0 and no more than 2,000 kg.");
  const microchip = registrationText(input.microchip, "microchip number", 50);
  if (microchip && !/^[a-zA-Z0-9 -]{5,50}$/.test(microchip)) throw new Error("Please check the microchip number (letters, numbers, spaces or hyphens).");
  return {
    name, species, breed, sex, dob,
    ...(neuterStatus === "yes" || neuterStatus === "no" ? { neutered: neuterStatus === "yes" } : {}),
    ...(neuteredDate ? { neuteredDate } : {}),
    ...(weight !== undefined ? { weight } : {}),
    ...(microchip ? { microchip, microchipped: true } : {}),
    notes: notes.join("\n\n"),
  };
}
