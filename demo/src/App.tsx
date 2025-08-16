/*import React from 'react'
import ChromaDots from '../../src/ChromaDots'
import './index.css'

const items = Array.from({ length: 10 }, (_, i) => (
  <div
    key={i}
    className="flex-shrink-0 w-[100px] h-[100px]"
    style={{ backgroundColor: `hsl(${(i * 36) % 360}, 80%, 70%)` }}
  >
    {i + 1}
  </div>
))

export default function App() {
  return (
    <div className="p-4 border-black">
      <h1 className="mb-4 text-xl">ChromaDots Demo:</h1>
      <ChromaDots
        direction="horizontal"
        scrollSnap
        className="w-[300px] h-40 overflow-x-hidden flex snap-x snap-mandatory"
        dotColor="bg-gray-300"
        activeColor="bg-purple-600"
        dotSize="w-3 h-3"
        dotSpacing="gap-3"
        animateActive
      >
        {items}
      </ChromaDots>
    </div>
  )
}*/


/*import React from 'react';
import ChromaDots from '../../src/ChromaDots'
import './index.css';

const items = Array.from({ length: 10 }, (_, i) => (
  <div
    key={i}
    className="w-[100px] h-[100px] rounded-lg"
    style={{ backgroundColor: `hsl(${(i * 36) % 360}, 80%, 70%)` }}
  >
    {i + 1}
  </div>
));

export default function App() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">ChromaDots Demo</h1>

      <ChromaDots direction="horizontal" className="w-24 h-24">
        {items}
      </ChromaDots>
    </div>
  );
}*/


// src/App.tsx
/*import React from 'react'
import ChromaDots from '../../src/ChromaDots'

export default function App() {
  // Generate 500 items for virtualization demo
  const items = Array.from({ length: 500 }, (_, i) => (
    <div
      key={i}
      className="w-[100px] h-[100px] rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `hsl(${(i * 36) % 360}, 80%, 70%)` }}
    >
      {i + 1}
    </div>
  ))

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        ChromaDots Demo with Virtualization
      </h1>

      <ChromaDots
        direction="horizontal"
        containerHeight="120px"
        virtualize      // enable virtualization
        itemSize={110}  // match your item width + any gap
        overscanCount={3}
        scrollSnap
        snapAlign="start"
        wrapperElement="span"  // renders each child in <span> for inline flow
        showArrows
        showDots
      >
        {items}
      </ChromaDots>
    </div>
  )
}*/



// src/App.tsx
import React from 'react';
import ChromaDots from '../../src/ChromaDots'

export default function App() {
  const items = Array.from({ length: 7 }, (_, i) => (
    <div
      key={i}
      className="w-[100px] h-[100px] rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `hsl(${(i * 36) % 360}, 80%, 70%)` }}
    >
      {i + 1}
    </div>
  ));

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        ChromaDots Demo with Virtualization
      </h1>

      <ChromaDots
        direction="horizontal"
        virtualize
        virtualWidth={400}     // pixels, not string
        virtualHeight={120}    // pixels, not string
        itemSize={110}         // matches item width + gap
        overscanCount={4}
        scrollSnap
        arrowSize='text-3xl'
        arrowColor='text-green-200'
        snapAlign="start"
        wrapperElement="span"  // inline wrapper for each item
        showArrows
      >
        {items}
      </ChromaDots>
    </div>
  );
}
