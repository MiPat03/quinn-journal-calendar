import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { format, addMonths } from "date-fns";
import MonthGrid from "./MonthGrid";
import Header from "./Header";
import JournalModal from "./JournalModal";

function Calendar({ entriesByDate }) {
  const [months, setMonths] = useState(() => {
    const now = new Date();
    return [
      { year: now.getFullYear(), month: now.getMonth() - 1 },
      { year: now.getFullYear(), month: now.getMonth() },
      { year: now.getFullYear(), month: now.getMonth() + 1 },
    ];
  });

  const [currentMonth, setCurrentMonth] = useState(format(new Date(), "MMMM yyyy"));
  const [modalState, setModalState] = useState(null); // { entries, startIndex }
  
  // Constants for performance optimization
  const MAX_MONTHS = 9; // Maximum number of months to keep in memory
  const SCROLL_THRESHOLD = 200; // Distance from edge to trigger loading

  const { allEntries, dateKeyToFirstIndex } = useMemo(() => {
    const keys = Object.keys(entriesByDate).sort();
    const flattened = [];
    const indexMap = {};
    let runningIndex = 0;
    keys.forEach((k) => {
      const arr = entriesByDate[k] || [];
      if (arr.length > 0) {
        indexMap[k] = runningIndex;
        arr.forEach((e) => {
          flattened.push(e);
          runningIndex += 1;
        });
      }
    });
    return { allEntries: flattened, dateKeyToFirstIndex: indexMap };
  }, [entriesByDate]);

  const containerRef = useRef();
  const lastScrollTime = useRef(0);
  
  // Throttle scroll events for better performance
  const throttle = useCallback((func, delay) => {
    return (...args) => {
      const now = Date.now();
      if (now - lastScrollTime.current >= delay) {
        lastScrollTime.current = now;
        func(...args);
      }
    };
  }, []);

  const prependMonth = useCallback(() => {
    setMonths(prevMonths => {
      const first = prevMonths[0];
      const prev = addMonths(new Date(first.year, first.month), -1);
      const newMonths = [{ year: prev.getFullYear(), month: prev.getMonth() }, ...prevMonths];
      
      // Memory management: remove months from the end if we have too many
      if (newMonths.length > MAX_MONTHS) {
        return newMonths.slice(0, MAX_MONTHS);
      }
      return newMonths;
    });
  }, [MAX_MONTHS]);

  const appendMonth = useCallback(() => {
    setMonths(prevMonths => {
      const last = prevMonths[prevMonths.length - 1];
      const next = addMonths(new Date(last.year, last.month), 1);
      const newMonths = [...prevMonths, { year: next.getFullYear(), month: next.getMonth() }];
      
      // Memory management: remove months from the beginning if we have too many
      if (newMonths.length > MAX_MONTHS) {
        return newMonths.slice(-MAX_MONTHS);
      }
      return newMonths;
    });
  }, [MAX_MONTHS]);

  const updateHeader = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const monthDivs = el.querySelectorAll(".month-section");
    let best = null;
    let bestArea = 0;
    
    monthDivs.forEach((div) => {
      const rect = div.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visibleHeight > bestArea) {
        bestArea = visibleHeight;
        best = div.getAttribute("data-label");
      }
    });
    
    if (best) setCurrentMonth(best);
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(throttle(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if we need to load more months
    if (el.scrollTop < SCROLL_THRESHOLD) {
      prependMonth();
    } else if (el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD) {
      appendMonth();
    }
    
    updateHeader();
  }, 16), [throttle, prependMonth, appendMonth, updateHeader, SCROLL_THRESHOLD]); // 16ms = ~60fps

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard navigation when modal is not open
      if (modalState) return;
      
      const el = containerRef.current;
      if (!el) return;
      
      switch (e.key) {
        case 'Home':
          e.preventDefault();
          el.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
          break;
        case 'PageUp':
          e.preventDefault();
          el.scrollBy({ top: -el.clientHeight * 0.8, behavior: 'smooth' });
          break;
        case 'PageDown':
          e.preventDefault();
          el.scrollBy({ top: el.clientHeight * 0.8, behavior: 'smooth' });
          break;
        case 'ArrowUp':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            el.scrollBy({ top: -200, behavior: 'smooth' });
          }
          break;
        case 'ArrowDown':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            el.scrollBy({ top: 200, behavior: 'smooth' });
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // Now only depends on handleScroll, not months

  return (
    <div className="calendar-wrapper">
      <Header currentMonth={currentMonth} />
      
      {/* Sticky weekday header */}
      <div className="weekday-header-sticky">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={`${day}-${i}`} className="weekday-cell-sticky">
            {day}
          </div>
        ))}
      </div>
      
      <div 
        className="calendar-container" 
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-label="Infinite scroll calendar with journal entries"
        aria-describedby="calendar-instructions"
      >
        <div 
          id="calendar-instructions" 
          className="sr-only"
          aria-hidden="true"
        >
          Use arrow keys with Ctrl/Cmd to scroll. Home/End to go to top/bottom. PageUp/PageDown to navigate months. Click on entries to view details.
        </div>
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            entriesByDate={entriesByDate}
            hideWeekdays={true} // Hide individual month weekday rows
            onEntryClick={(dateKey) => {
              const startIndex = dateKeyToFirstIndex[dateKey];
              if (allEntries.length > 0 && startIndex !== undefined) {
                setModalState({ entries: allEntries, startIndex });
              }
            }}
          />
        ))}
      </div>
      {modalState && (
        <JournalModal
          entries={modalState.entries}
          startIndex={modalState.startIndex}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}

export default Calendar;
