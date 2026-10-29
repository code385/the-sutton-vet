"use client";

import { useState } from "react";
import { calendarDays, groupSlotsByDate, groupSlotsByPeriod, londonDateKey, londonTime, shiftMonth } from "@/lib/bookingCalendar";
import type { BookingSlot } from "@/lib/bookingCalendar";
import styles from "./VerifiedClientBooking.module.css";

type Props = {
  month: string;
  slots: BookingSlot[];
  selectedDate: string;
  choice: string;
  checked: boolean;
  checking?: boolean;
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

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4m8-4v4M4 11h16m-12 4h2m4 0h2m-8 3h2" /></svg>;
}

function TimeChoices({ slots, choice, disabled, onChoiceChange }: {
  slots: BookingSlot[]; choice: string; disabled: boolean; onChoiceChange: (choice: string) => void;
}) {
  const groups = groupSlotsByPeriod(slots);
  const [period, setPeriod] = useState(groups[0]?.label);
  const activeGroup = groups.find((group) => group.label === period) || groups[0];
  const zones = [...new Set(slots.map((slot) => londonTime(slot.start).zone))].join(" / ");
  return <>
    <p className={styles.timezoneNote}>London time ({zones}) &middot; 24-hour clock</p>
    <div className={styles.periodFilters} role="group" aria-label="Filter times by time of day">
      {groups.map((group) => <button key={group.label} type="button" disabled={disabled}
        aria-pressed={activeGroup.label === group.label} onClick={() => setPeriod(group.label)}>
        {group.label} <span>{group.slots.length}</span>
      </button>)}
    </div>
    <div className={styles.timeSlots}>
      {activeGroup.slots.map((slot) => {
        const { time, zone } = londonTime(slot.start);
        // Clock changes can repeat a wall-clock time. Keep those options distinguishable.
        const repeatedTime = slots.filter((item) => londonTime(item.start).time === time).length > 1;
        return <label className={styles.timeSlot} key={slot.choice}>
          <input type="radio" name="appointment-time" value={slot.choice} checked={choice === slot.choice}
            aria-label={`${time} ${zone}, London time`} required={!choice} onChange={() => onChoiceChange(slot.choice)} />
          <span>{time}{repeatedTime && <small>{zone}</small>}</span>
        </label>;
      })}
    </div>
  </>;
}

export function AppointmentCalendar({
  month, slots, selectedDate, choice, checked, checking = false, disabled, canCheck,
  onMonthChange, onDateChange, onChoiceChange, onCheck,
}: Props) {
  const today = londonDateKey(new Date());
  const firstMonth = today.slice(0, 7);
  const lastMonth = shiftMonth(firstMonth, 12);
  const grouped = groupSlotsByDate(slots, month);
  const days = calendarDays(month);
  const daySlots = grouped.get(selectedDate) || [];
  const selectedSlot = daySlots.find((slot) => slot.choice === choice);
  const nextDate = [...grouped.keys()].find((date) => date >= today);
  const monthLabel = new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "Europe/London", month: "long", year: "numeric",
  });

  return <div className={styles.datePicker}>
    <div className={styles.calendarHeading}>
      <span className={styles.calendarIcon}><CalendarIcon /></span>
      <div><h3 id="booking-calendar-heading">Find a time that suits you</h3><p id="booking-timezone">Choose a date, then a time. All appointments use London time.</p></div>
    </div>
    <div className={styles.bookingPickerGrid}>
      <div className={styles.calendarCard}>
        <p className={styles.pickerStep}><span>1</span> Choose your date</p>
        <div className={styles.monthNavigation}>
          <button type="button" aria-label="Previous month" disabled={disabled || month <= firstMonth}
            onClick={() => onMonthChange(shiftMonth(month, -1))}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5" /></svg></button>
          <strong aria-live="polite">{monthLabel}</strong>
          <button type="button" aria-label="Next month" disabled={disabled || month >= lastMonth}
            onClick={() => onMonthChange(shiftMonth(month, 1))}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5" /></svg></button>
        </div>
        <button type="button" className={styles.checkAvailability} disabled={disabled || !canCheck} onClick={onCheck}>
          {checking ? "Checking availability..." : "Check available times"}
        </button>
        <p className={styles.calendarHint} role="status">
          {checking ? "Finding available appointments..." : !checked ? canCheck ? "Check availability to reveal bookable dates." : "Select your pet and appointment type above to get started."
            : nextDate ? "Select a highlighted date below."
            : "No available times for this month. Try another month or call the practice."}
        </p>
        <table className={styles.calendar} aria-labelledby="booking-calendar-heading" aria-describedby="booking-timezone" aria-busy={checking}>
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
                  onClick={() => onDateChange(date)}>{Number(date.slice(-2))}</button>}
              </td>
            ))}</tr>
          ))}</tbody>
        </table>
        <div className={styles.calendarLegend}><span><i /> Available</span><span><i /> Selected</span></div>
        {checked && nextDate && <button type="button" className={styles.nextAvailable} disabled={disabled} onClick={() => onDateChange(nextDate)}>
          Next available <strong>{new Date(`${nextDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/London" })}</strong><span aria-hidden="true">&rarr;</span>
        </button>}
      </div>
      <div className={styles.timesCard}>
        <p className={styles.pickerStep}><span>2</span> Choose your time</p>
        {daySlots.length ? <fieldset className={styles.timeFieldset} disabled={disabled}>
          <legend>Available times for {dateLabel(selectedDate)}</legend>
          <TimeChoices key={selectedDate} slots={daySlots} choice={choice} disabled={disabled} onChoiceChange={onChoiceChange} />
        </fieldset> : <div className={styles.timePlaceholder}><CalendarIcon /><strong>Your available times will appear here</strong><p>{checked && !nextDate ? "Try another month to find your next visit." : "Choose a highlighted date to explore morning, afternoon or evening appointments."}</p></div>}
      </div>
    </div>
    {selectedSlot && <div className={styles.selectionSummary} role="status">
      <span className={styles.selectionTick} aria-hidden="true">&#10003;</span>
      <div><span>Your selected time</span><strong>{dateLabel(selectedDate)} at {londonTime(selectedSlot.start).time} ({londonTime(selectedSlot.start).zone})</strong><p>Ready to send your request below. The practice will confirm your appointment.</p></div>
    </div>}
  </div>;
}
