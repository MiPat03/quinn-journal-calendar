import { format } from "date-fns";
import { generateMonth } from "../utils/calendarUtils";
import DayCell from "./DayCell";

function MonthGrid({ year, month, entriesByDate, onEntryClick, hideWeekdays = false }) {
  const cells = generateMonth(year, month);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="month-section" data-label={format(new Date(year, month), "MMMM yyyy")}>
      {/* Month title (optional, since header shows current month) */}
      {/* <h3 className="month-title">{format(new Date(year, month), "MMMM yyyy")}</h3> */}

      {/* Weekday labels - conditionally rendered */}
      {!hideWeekdays && (
        <div className="weekday-row">
          {weekdays.map((day, i) => (
            <div key={`${day}-${i}`} className="weekday-cell">
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Days grid */}
      <div className="month-grid">
        {cells.map(({ date, key, isOtherMonth }) => {
          const dateKey = date ? format(date, "yyyy-MM-dd") : null;
          const entries = dateKey ? entriesByDate[dateKey] || [] : [];
          return (
            <DayCell
              key={key}
              date={date}
              entries={entries}
              isOtherMonth={isOtherMonth}
              onClick={() => onEntryClick(dateKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MonthGrid;