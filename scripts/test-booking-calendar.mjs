import assert from "node:assert/strict";
import { test } from "node:test";
import { calendarDays, groupSlotsByDate, groupSlotsByPeriod, londonDateKey, londonTime, shiftMonth } from "../src/lib/bookingCalendar.ts";

test("London dates remain correct around midnight and DST changes", () => {
  assert.equal(londonDateKey("2026-06-30T23:30:00Z"), "2026-07-01");
  assert.equal(londonDateKey("2026-12-31T23:30:00Z"), "2026-12-31");
  assert.equal(londonDateKey("2026-03-29T01:30:00Z"), "2026-03-29");
});

test("calendar weeks start on Monday and include leap days", () => {
  const leap = calendarDays("2028-02");
  assert.equal(leap[0], null);
  assert.equal(leap[1], "2028-02-01");
  assert.equal(leap.filter(Boolean).length, 29);
  assert.equal(leap.length % 7, 0);
  assert.equal(calendarDays("2026-06")[0], "2026-06-01");
  assert.equal(calendarDays("2026-02").filter(Boolean).length, 28);
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2027-01", -1), "2026-12");
});

test("slots use London days, preserve signed choices, and collapse duplicate staff times", () => {
  const slot = { start: "2026-06-30T23:30:00Z", end: "2026-07-01T00:00:00Z", choice: "signed-original" };
  const grouped = groupSlotsByDate([
    { start: "2026-07-01T10:00:00Z", end: "2026-07-01T10:30:00Z", choice: "later" },
    slot, { ...slot, choice: "different-staff" },
    { start: "2026-06-29T10:00:00Z", end: "2026-06-29T10:30:00Z", choice: "outside-month" },
    { start: "invalid", end: "invalid", choice: "invalid" },
  ], "2026-07");
  assert.deepEqual([...grouped.keys()], ["2026-07-01"]);
  assert.deepEqual(grouped.get("2026-07-01").map((item) => item.choice), ["signed-original", "later"]);
});

test("the two 01:30 times at the autumn clock change remain distinct slots", () => {
  const slots = [
    { start: "2026-10-25T00:30:00Z", end: "2026-10-25T01:00:00Z", choice: "bst" },
    { start: "2026-10-25T01:30:00Z", end: "2026-10-25T02:00:00Z", choice: "gmt" },
  ];
  assert.deepEqual(groupSlotsByDate(slots, "2026-10").get("2026-10-25"), slots);
  assert.deepEqual(londonTime(slots[0].start), { time: "01:30", zone: "BST", hour: 1 });
  assert.deepEqual(londonTime(slots[1].start), { time: "01:30", zone: "GMT", hour: 1 });
});

test("time groups follow London local noon and evening, not the visitor timezone", () => {
  const slots = [10, 11, 15, 16].map((hour) => ({ start: `2026-07-01T${hour}:00:00Z`, end: `2026-07-01T${hour}:30:00Z`, choice: String(hour) }));
  assert.deepEqual(groupSlotsByPeriod(slots).map((group) => [group.label, group.slots.map((slot) => slot.choice)]), [
    ["Morning", ["10"]], ["Afternoon", ["11", "15"]], ["Evening", ["16"]],
  ]);
  assert.deepEqual(groupSlotsByPeriod([]), []);
});
