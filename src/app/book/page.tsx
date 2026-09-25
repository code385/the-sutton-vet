import { LupaJourney } from "@/components/pms/LupaJourney";
import { siteConfig } from "@/lib/site";

export default function BookPage() {
  return (
    <main className="page-shell">
      <LupaJourney
        mode="book"
        clinicPhone={siteConfig.phone}
        clientPortalUrl={process.env.NEXT_PUBLIC_LUPA_CLIENT_PORTAL_URL || ""}
      />
    </main>
  );
}
