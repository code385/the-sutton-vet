"use client";

import { calendarDays, groupSlotsByDate, londonDateKey, shiftMonth } from "@/lib/bookingCalendar";
import type { BookingSlot } from "@/lib/bookingCalendar";
import styles from "./VerifiedClientBooking.module.css";

type Props = {
  month: string;
  slots: BookingSlot[];
  selectedDate: string;
  choice: string;
  checked: boolean;
  disabled: boolean;
  canCheck: boolean;
  onMonthChange: (month: string) => void;
  onDateChange: (date: string) => void;
  onChoiceChange: (choice: string) => void;
  onCheck: () => void;
};

const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
  timeZone: "Europe/London", weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export function AppointmentCalendar({
  month, slots, selectedDate, choice, checked, disabled, canCheck,
  onMonthChange, onDateChange, onChoiceChange, onCheck,
}: Props) {
  const today = londonDateKey(new Date());
  const firstMonth = today.slice(0, 7);
  const lastMonth = shiftMonth(firstMonth, 12);
  const grouped = groupSlotsByDate(slots, month);
  const days = calendarDays(month);
  const daySlots = grouped.get(selectedDate) || [];
  const monthLabel = new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "Europe/London", month: "long", year: "numeric",
  });

  return (
    <div className={styles.datePicker}>
      <div className={styles.calendarHeading}>
        <h3 id="booking-calendar-heading">Choose your date</h3>
        <p id="booking-timezone">All dates and times are in London time.</p>
      </div>
      <div className={styles.monthNavigation}>
        <button type="button" aria-label="Previous month" disabled={disabled || month <= firstMonth}
          onClick={() => onMonthChange(shiftMonth(month, -1))}>&lt;</button>
        <strong aria-live="polite">{monthLabel}</strong>
        <button type="button" aria-label="Next month" disabled={disabled || month >= lastMonth}
          onClick={() => onMonthChange(shiftMonth(month, 1))}>&gt;</button>
      </div>
      <button type="button" className="button button-muted" disabled={disabled || !canCheck} onClick={onCheck}>
        Check available times
      </button>
      <p className={styles.calendarHint} role="status">
        {!checked ? "Choose your pet and appointment type, then check availability for this month."
          : grouped.size ? "Select a highlighted date to see available times."
          : "No available times for this month. Try another month or call the practice."}
      </p>
      <table className={styles.calendar} aria-labelledby="booking-calendar-heading" aria-describedby="booking-timezone">
        <caption className={styles.calendarCaption}>{monthLabel}</caption>
        <thead><tr>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <th key={day} scope="col"><abbr title={day}>{day.slice(0, 3)}</abbr></th>
        ))}</tr></thead>
        <tbody>{Array.from({ length: days.length / 7 }, (_, week) => (
          <tr key={week}>{days.slice(week * 7, week * 7 + 7).map((date, index) => (
            <td key={date || `blank-${index}`}>
              {date && <button type="button" disabled={disabled || date < today || !grouped.has(date)}
                aria-label={`${dateLabel(date)}${grouped.has(date) && date >= today ? ", available" : ", unavailable"}`}
                aria-pressed={selectedDate === date} aria-current={date === today ? "date" : undefined}
                onClick={() => onDateChange(date)}>
                {Number(date.slice(-2))}
              </button>}
            </td>
          ))}</tr>
        ))}</tbody>
      </table>
      {!!daySlots.length && <fieldset className={styles.timeFieldset} disabled={disabled}>
        <legend>Available times for {dateLabel(selectedDate)}</legend>
        <div className={styles.timeSlots}>
          {daySlots.map((slot) => (
            <label className={styles.timeSlot} key={slot.choice}>
              <input type="radio" name="appointment-time" value={slot.choice} checked={choice === slot.choice}
                required onChange={() => onChoiceChange(slot.choice)} />
              <span>{new Date(slot.start).toLocaleTimeString("en-GB", {
                timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", timeZoneName: "short",
              })}</span>
            </label>
          ))}
        </div>
      </fieldset>}
    </div>
  );
}
