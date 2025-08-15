import React from 'react';
import ChromaDots from '../../src/ChromaDots';

const items = Array.from({ length: 10 }, (_, i) => (
  <div
    key={i}
    style={{
      minWidth: '200px',
      minHeight: '200px',
      backgroundColor: `hsl(${(i * 36) % 360}, 80%, 70%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      marginRight: '1rem',
    }}
  >
    {i + 1}
  </div>
));

export default function App() {
  return (
    <div className="p-4 max-w-56">
      <h1 className="mb-4">ChromaDots Demo</h1>
      <ChromaDots
        direction="horizontal"
        dotColor="bg-gray-400"
        activeColor="bg-red-500"
        dotSize="w-3 h-3"
        dotSpacing="gap-3"
        scrollSnap
        onDotClick={(index) => console.log('clicked dot', index)}
        className="max-w-56"
      >
        {items}
      </ChromaDots>
    </div>
  );
}
