# ChromaScroll
Custom scroll bar for React development

# ScrollDots

A responsive, animated scroll indicator component for React.

## Features

- Vertical or horizontal scroll tracking
- Clickable dots to scroll to sections
- Customizable colors, size, spacing
- Responsive layout switching
- Scroll snapping support

## Usage

```jsx
<ScrollDots
  direction="horizontal"
  responsiveDirection={{ base: "horizontal", md: "vertical" }}
  dotColor="bg-gray-400"
  activeColor="bg-purple-600"
  dotSize="w-3 h-3"
  dotSpacing="gap-3"
  animateActive={true}
  scrollSnap={true}
  onDotClick={(i) => console.log("Scrolled to", i)}
>
  {/* Scrollable content */}
</ScrollDots>
