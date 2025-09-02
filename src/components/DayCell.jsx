import StarRating from "./StarRating";

function DayCell({ date, entries, onClick, isOtherMonth }) {
  if (!date) return <div className="day-cell empty"></div>;

  const entry = entries[0]; // show only first entry thumbnail in cell
  const stars = entry ? entry.rating : null;

  const hasEntries = entries.length > 0;
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div
      className={`day-cell ${isOtherMonth ? "other-month" : ""} ${hasEntries ? "has-entries" : ""}`}
      onClick={() => hasEntries && onClick()}
      role={hasEntries ? "button" : "gridcell"}
      tabIndex={hasEntries ? 0 : -1}
      aria-label={hasEntries ? `${formattedDate}, ${entries.length} journal entry${entries.length > 1 ? 'ies' : ''}` : formattedDate}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hasEntries) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Date */}
      <div className="date" aria-hidden="true">{date.getDate()}</div>

      {/* Star rating (small) */}
      {stars && (
        <div className="mini-stars" aria-label={`Rating: ${stars} out of 5 stars`}>
          <StarRating rating={stars} />
        </div>
      )}

      {/* Thumbnail */}
      {entry && (
        <img
          src={entry.imgUrl}
          alt={`Journal entry from ${formattedDate}`}
          className="entry-thumb"
          loading="lazy"
        />
      )}

      {/* First category */}
      {entry && entry.categories.length > 0 && (
        <div className="mini-category" aria-label={`Category: ${entry.categories[0]}`}>
          {entry.categories[0][0]}
        </div>
      )}
    </div>
  );
}

export default DayCell;
