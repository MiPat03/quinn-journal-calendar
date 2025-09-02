# Quinn - Infinite Scrollable Calendar

A beautiful, infinite scrollable calendar with journal entry management. Features smooth scrolling, swipeable entry cards, and mobile optimization.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx       # Main calendar with infinite scroll
│   ├── MonthGrid.jsx      # Individual month display
│   ├── DayCell.jsx        # Individual day cell with entries
│   ├── JournalModal.jsx   # Swipeable journal entry modal
│   ├── Header.jsx         # Dynamic month header
│   └── StarRating.jsx     # Star rating component
├── data/
│   └── journal.json       # Sample journal entries
├── utils/
│   └── calendarUtils.js   # Calendar generation utilities
└── index.css              # Styles with mobile responsiveness

```
