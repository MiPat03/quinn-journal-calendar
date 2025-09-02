import {
  getDaysInMonth,
  startOfMonth,
  getDay,
  format,
  subMonths,
  addMonths,
} from "date-fns";

export function generateMonth(year, month) {
  const firstDay = startOfMonth(new Date(year, month));
  const startOffset = getDay(firstDay); // Sunday=0
  const daysInMonth = getDaysInMonth(new Date(year, month));

  const cells = [];

  // Previous month days
  if (startOffset > 0) {
    const prevMonth = subMonths(new Date(year, month), 1);
    const prevDays = getDaysInMonth(prevMonth);
    for (let i = prevDays - startOffset + 1; i <= prevDays; i++) {
      const d = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i);
      cells.push({ date: d, key: format(d, "yyyy-MM-dd"), isOtherMonth: true });
    }
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    cells.push({ date: d, key: format(d, "yyyy-MM-dd"), isOtherMonth: false });
  }

  // Next month days (fill until multiple of 7)
  const nextMonth = addMonths(new Date(year, month), 1);
  let extra = 7 - (cells.length % 7);
  if (extra < 7) {
    for (let i = 1; i <= extra; i++) {
      const d = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      cells.push({ date: d, key: format(d, "yyyy-MM-dd"), isOtherMonth: true });
    }
  }

  return cells;
}
