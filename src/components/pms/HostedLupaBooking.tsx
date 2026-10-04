"use client";

import { useEffect, useState } from "react";

type HostedLupaBookingProps = {
  bookingUrl: string;
  clinicPhone: string;
};

export function HostedLupaBooking({ bookingUrl, clinicPhone }: HostedLupaBookingProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    function handleBookingMessage(event: MessageEvent) {
      if (event.origin !== "https://store.lupapets.com") return;

      const messageType = typeof event.data === "string" ? event.data : event.data?.type;
      if (messageType === "lupa:booking-completed") setIsComplete(true);
    }

    window.addEventListener("message", handleBookingMessage);
    return () => window.removeEventListener("message", handleBookingMessage);
  }, []);

  return (
    <section className="hosted-booking" aria-labelledby="hosted-booking-title">
      <header className="hosted-booking-header">
        <div>
          <p className="eyebrow">Secure online booking</p>
          <h1 id="hosted-booking-title">Book your visit through Lupa.</h1>
          <p>
            Existing clients can sign in and choose a registered pet. New clients can create their account and
            continue to an available appointment.
          </p>
        </div>
        <div className="hosted-booking-summary" aria-label="Booking journey benefits">
          <p><strong>One secure journey</strong><span>Client login, pet details, available times, and confirmation.</span></p>
          <p><strong>Managed by Lupa</strong><span>Your booking details are handled within the clinic&apos;s practice system.</span></p>
        </div>
      </header>

      {isComplete ? (
        <div className="hosted-booking-success" role="status">
          Your booking has been submitted through Lupa. Please follow any confirmation instructions shown below.
        </div>
      ) : null}

      <div className="hosted-booking-frame-shell">
        <div className="hosted-booking-toolbar">
          <div>
            <span className="hosted-booking-status" aria-hidden="true" />
            <strong>Lupa secure booking</strong>
          </div>
          <a href={bookingUrl} target="_blank" rel="noreferrer">
            Open in a new tab
          </a>
        </div>
        <div className="hosted-booking-frame-wrap">
          {!isLoaded ? <p className="hosted-booking-loading">Loading secure booking...</p> : null}
          <iframe
            className={isLoaded ? "is-loaded" : ""}
            src={bookingUrl}
            title="The Sutton Vet secure online booking powered by Lupa"
            loading="eager"
            allow="payment"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>

      <footer className="hosted-booking-help">
        <p>
          If the booking window does not load, open it in a new tab or call the practice on{" "}
          <a href={`tel:${clinicPhone.replace(/\D/g, "")}`}>{clinicPhone}</a>.
        </p>
        <a className="button button-muted" href={bookingUrl} target="_blank" rel="noreferrer">
          Open Lupa Booking
        </a>
      </footer>
    </section>
  );
}
