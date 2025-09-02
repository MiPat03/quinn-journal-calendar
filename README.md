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

## Key Optimizations

### Performance
- **Memory Management**: Automatically removes old months when scrolling extensively
- **Event Throttling**: Scroll events throttled to 16ms (60fps)
- **Efficient Re-renders**: useCallback and useMemo prevent unnecessary renders
- **Passive Events**: Non-blocking scroll event listeners

### User Experience
- **Sticky Weekday Header**: Always visible day labels while scrolling
- **Smooth Animations**: CSS transitions for hover states and focus
- **Touch Interactions**: Optimized for mobile with proper touch targets
- **Keyboard Accessible**: Full keyboard navigation support

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with modern JavaScript support

## Design Choices

1. **Pure CSS**: No UI framework dependency for smaller bundle size
2. **Memory Efficient**: Limits DOM nodes to prevent performance degradation
3. **Accessibility First**: Built with screen readers and keyboard navigation in mind
4. **Mobile Optimized**: Touch-first design with responsive breakpoints
5. **Performance Focused**: Every interaction is optimized for 60fps smoothness

## Contributing

This project was built as a demonstration of modern React performance optimization and accessibility practices.
