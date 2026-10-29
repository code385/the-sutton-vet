export type BookingSlot = { start: string; end: string; choice: string };

export function londonTime(value: string): { time: string; zone: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "shortOffset",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return { time: `${part("hour")}:${part("minute")}`, zone: part("timeZoneName") === "GMT+1" ? "BST" : "GMT", hour: Number(part("hour")) };
}

export function groupSlotsByPeriod(slots: BookingSlot[]) {
  const groups = [
    { label: "Morning", slots: [] as BookingSlot[] },
    { label: "Afternoon", slots: [] as BookingSlot[] },
    { label: "Evening", slots: [] as BookingSlot[] },
  ];
  for (const slot of slots) {
    const { hour } = londonTime(slot.start);
    groups[hour < 12 ? 0 : hour < 17 ? 1 : 2].slots.push(slot);
  }
  return groups.filter((group) => group.slots.length);
}

export function londonDateKey(value: Date | string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function shiftMonth(month: string, offset: number): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber - 1 + offset, 1)).toISOString().slice(0, 7);
}

export function calendarDays(month: string): (string | null)[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstWeekday = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const cells: (string | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${month}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function groupSlotsByDate(slots: BookingSlot[], month: string): Map<string, BookingSlot[]> {
  const grouped = new Map<string, BookingSlot[]>();
  const seen = new Set<string>();
  const sorted = slots.filter((slot) => Number.isFinite(Date.parse(slot.start)))
    .slice().sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

  for (const slot of sorted) {
    const date = londonDateKey(slot.start);
    const timeKey = `${Date.parse(slot.start)}:${Date.parse(slot.end)}`;
    if (!date.startsWith(`${month}-`) || seen.has(timeKey)) continue;
    // A time can have multiple staff/room choices. Keep one original signed choice.
    seen.add(timeKey);
    grouped.set(date, [...(grouped.get(date) || []), slot]);
  }
  return grouped;
}
