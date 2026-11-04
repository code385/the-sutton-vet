import { MAX_REGISTRATION_PETS, londonToday, registrationDate, registrationPet, registrationText } from "./registrationPet";

export function registrationPayload(input: Record<string, unknown>, now = new Date()) {
  const text = (key: string, label: string, max: number, required = false) => registrationText(input[key], label, max, required);
  const firstName = text("firstName", "your first name", 80, true);
  const lastName = text("lastName", "your last name", 80, true);
  const email = text("email", "your email address", 160, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
  const phone = text("phone", "your phone number", 40, true).replace(/[ ()-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Please include the country code in your phone number (for the UK, +44 without the leading 0).");
  const title = text("title", "your title", 20);
  if (title && !["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"].includes(title)) throw new Error("Please choose a valid title.");
  const address = {
    line_1: text("addressLine1", "your address", 150, true),
    line_2: text("addressLine2", "address line 2", 150),
    city: text("city", "your town / city", 80, true),
    postcode: text("postcode", "your postcode", 32, true),
    country: text("country", "your country", 80, true),
  };
  if (!Array.isArray(input.pets) || !input.pets.length || input.pets.length > MAX_REGISTRATION_PETS) throw new Error(`Please use the updated registration form to add 1-${MAX_REGISTRATION_PETS} pets. Refresh the page if needed.`);
  const newPets = input.pets.map((pet, index) => {
    if (!pet || typeof pet !== "object" || Array.isArray(pet)) throw new Error(`Please check pet ${index + 1}.`);
    if ("files" in pet || "attachments" in pet || "clinicalFile" in pet) throw new Error("File uploads are not enabled. Please contact the practice to transfer clinical documents.");
    try { return registrationPet(pet, now); }
    catch (error) { throw new Error(`Pet ${index + 1}: ${error instanceof Error ? error.message : "Please check the details."}`); }
  });
  const allowContact = input.contactConsent === true || input.contactConsent === "true";
  return {
    firstName, lastName, email, phone, ...(title ? { title } : {}),
    address: { ...address, formatted_address: Object.values(address).filter(Boolean).join(", ") },
    ...(input.ownerDateOfBirth ? { dob: registrationDate(input.ownerDateOfBirth, "your date of birth", londonToday(now)) } : {}),
    referralSource: text("referralSource", "how you heard about us", 200) || null,
    marketingCommsPreferences: [], essentialCommsPreferences: allowContact ? ["email", "sms"] : [], newPets,
  };
}

export async function readRegistrationInput(request: Request) {
  if (!(request.headers.get("content-type") || "").startsWith("application/json")) throw new Error("Please use the registration form. File uploads are not yet supported.");
  const limit = 64 * 1024;
  if (Number(request.headers.get("content-length")) > limit) throw new Error("Registration is too large. Please shorten the notes.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Please complete the form.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("Registration is too large. Please shorten the notes."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  let value: unknown;
  try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new Error("Please complete the form and try again."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Please complete the form and try again.");
  return value as Record<string, unknown>;
}
