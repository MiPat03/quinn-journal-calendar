import Calendar from "./components/Calendar";
import entries from "./data/journal.json";
import { parse, parseISO, isValid } from "date-fns";

function App() {
  const entriesByDate = {};

  entries.forEach((e) => {
    let parsedDate;

    // Try dd/MM/yyyy first (your current dataset)
    parsedDate = parse(e.date, "dd/MM/yyyy", new Date());

    // If that fails, try ISO yyyy-MM-dd
    if (!isValid(parsedDate)) {
      parsedDate = parseISO(e.date);
    }

    if (!isValid(parsedDate)) {
      console.error("Invalid date skipped:", e.date);
      return;
    }

    const isoKey = parsedDate.toISOString().split("T")[0]; // yyyy-MM-dd

    if (!entriesByDate[isoKey]) entriesByDate[isoKey] = [];
    entriesByDate[isoKey].push({
      ...e,
      date: isoKey,
    });
  });

  return <Calendar entriesByDate={entriesByDate} />;
}

export default App;
