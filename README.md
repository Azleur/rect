# Rectangle library

`@azleur/rect` is a TypeScript library that provides an axis-aligned rectangle class and helper functions.

It uses `@azleur/vec2` to represent 2D vectors.

## Creation and basic usage

```typescript
// Create by giving (minX, minY, maxX, maxY).
const rect = new Rect(0, 1, 2, 3);
const rect = new Rect(new Vec2(0, 1), new Vec2(2, 3)); // Same result.

// Internally stored as min and max corners.
const min: Vec2 = rect.min; // { x: 0, y: 1 }
const max: Vec2 = rect.max; // { x: 2, y: 3 }

// Can easily get center and diagonal.
const center: Vec2 = rect.Center(); // { x: 1, y: 2 }
const diagonal: Vec2 = rect.Diagonal(); // { x: 2, y: 2 }

// Resize your rect easily, keeping the same center.
const bigger: Rect = rect.Expand(1.5); // { min: { x: -0.5, y: 0.5 }, max: { x: 2.5, y: 3.5 } }

// Test if a point is inside the rectangle (borders included).
const point = new Vec2(0, 2);
if(rect.Test(point)) { ... }

// Move the rect around:
const displacement = new Vec2(1, 1);
const newRect = rect.Translate(displacement); // { min: { x: 1, y: 2 }, max: { x: 3, y: 4 } }
```

## Alternative ways to create a Rect

```typescript
const center = new Vec2(2, 2);
const span = new Vec(1, 2);

const rect1 = FromCenterSpan(center, span) // { min: { x: 1, y: 0 }, max: { x: 3, y: 4 } }
const rect2 = FromCenterRadius(center, 1) // { min: { x: 1, y: 1 }, max: { x: 3, y: 3 } }
```

## Rects from collections

`CommonBounds(...rects: Rect[]): Rect` returns the smallest rect containing all the input rects.

Similarly, `BoundingBox(...points: Vec2[]): Rect` returns the smallest rect containing all the input points.
