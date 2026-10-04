import type { Metadata } from "next";
import { HostedLupaBooking } from "@/components/pms/HostedLupaBooking";
import { getLupaHostedBookingUrl } from "@/lib/lupa";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Online | The Sutton Vet",
  description: "Sign in or register and request an appointment securely through The Sutton Vet's Lupa booking journey.",
};

export default function BookPage() {
  const bookingUrl = getLupaHostedBookingUrl();

  return (
    <main className="page-shell">
      {bookingUrl ? (
        <HostedLupaBooking bookingUrl={bookingUrl} clinicPhone={siteConfig.phone} />
      ) : (
        <section className="hosted-booking hosted-booking-unavailable" aria-labelledby="hosted-booking-title">
          <p className="eyebrow">Online booking</p>
          <h1 id="hosted-booking-title">Booking is being connected.</h1>
          <p>Please call the practice and the team will arrange your appointment.</p>
          <a className="button button-primary" href={siteConfig.ctas.call}>Call {siteConfig.phone}</a>
        </section>
      )}
    </main>
  );
}
