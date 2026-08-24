import { LupaJourney } from "@/components/pms/LupaJourney";
import { siteConfig } from "@/lib/site";

export default function RegisterPage() {
  return <main className="page-shell"><LupaJourney mode="register" clinicPhone={siteConfig.phone} /></main>;
}
