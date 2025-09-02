import { useEffect, useMemo, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import StarRating from "./StarRating";
import CategoryBadge from "./CategoryBadge";
import { format, parseISO } from "date-fns";

function JournalModal({ entries, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const wrapperRef = useRef(null);
  const [cardWidthPx, setCardWidthPx] = useState(null);
  const [peekPx, setPeekPx] = useState(24);
  const gapPx = 12;
  const maxIndex = entries ? entries.length - 1 : 0;

  if (!entries || entries.length === 0) return null;

  // Sync when startIndex changes (e.g., open on a different day)
  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  // Measure wrapper and set card width for peeking neighbors
  useEffect(() => {
    const updateSizes = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const width = wrapper.clientWidth;
      // Increase peek size for better visibility of neighboring cards
      const computedPeek = Math.max(32, Math.min(80, Math.round(width * 0.15)));
      const desired = Math.max(280, width - 2 * computedPeek);
      setPeekPx(computedPeek);
      setCardWidthPx(desired);
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const trackTransform = useMemo(() => {
    if (!cardWidthPx) return `translateX(0px)`;
    
    // Always center the active card regardless of its position
    // Calculate the position to center the active card in the wrapper
    const wrapperWidth = wrapperRef.current?.clientWidth || 400;
    const cardWithGap = cardWidthPx + gapPx;
    
    // Position of the active card's center relative to the track start
    const activeCenterPosition = index * cardWithGap + cardWidthPx / 2;
    
    // How much to move the track to center the active card in the wrapper
    const offsetToCenter = activeCenterPosition - wrapperWidth / 2;
    
    return `translateX(-${offsetToCenter}px)`;
  }, [index, cardWidthPx, gapPx]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < maxIndex) setIndex(index + 1);
    },
    onSwipedRight: () => {
      if (index > 0) setIndex(index - 1);
    },
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    preventDefaultTouchmoveEvent: false,
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && index < maxIndex) setIndex(index + 1);
      if (e.key === "ArrowLeft" && index > 0) setIndex(index - 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, maxIndex, onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="carousel-wrapper"
        onClick={(e) => e.stopPropagation()}
        {...handlers}
        style={{ touchAction: "pan-y" }}
        ref={wrapperRef}
      >
        <div
          className="carousel-track"
          style={{
            transform: trackTransform,
            gap: `${gapPx}px`,
          }}
        >
          {entries.map((entry, i) => (
            <div
              className={`carousel-card ${i === index ? "active" : "inactive"}`}
              key={i}
              style={{ width: cardWidthPx ? `${cardWidthPx}px` : undefined }}
              onClick={() => {
                if (i !== index) setIndex(i);
              }}
            >
              <img src={entry.imgUrl} alt="" className="card-img" />
              <div className="card-body">
                <div className="meta-row">
                  <CategoryBadge text={entry.categories && entry.categories.length > 0 ? entry.categories[0] : ""} />
                  <div className="rating"><StarRating rating={entry.rating} /></div>
                </div>
                <h3 className="entry-date">{(() => {
                  try {
                    const d = parseISO(entry.date);
                    return format(d, "d LLLL");
                  } catch {
                    return entry.date;
                  }
                })()}</h3>
                <p className="entry-desc">{entry.description}</p>
                <hr />
                <button className="view-post">View full Post</button>
              </div>
            </div>
          ))}
        </div>

        {index > 0 && (
          <button
            className="nav-arrow left"
            onClick={() => setIndex((v) => Math.max(0, v - 1))}
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        {index < maxIndex && (
          <button
            className="nav-arrow right"
            onClick={() => setIndex((v) => Math.min(maxIndex, v + 1))}
            aria-label="Next"
          >
            ›
          </button>
        )}

        <button className="close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default JournalModal;
