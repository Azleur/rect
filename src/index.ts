import { Vec2 } from 'vec2';

/** Axis-aligned rectangle (sides parallel to x, y axes). */
export class Rect {
    min: Vec2;
    max: Vec2;

    /** Create a new axis-aligned rectangle with opposite corners (min, max). */
    constructor(min: Vec2, max: Vec2);
    constructor(x0: number, y0: number, x1: number, y1: number);
    constructor(a: Vec2 | number, b: Vec2 | number, c?: number, d?: number) {
        if (c !== undefined && d !== undefined) {
            this.min = new Vec2(a as number, b as number);
            this.max = new Vec2(c, d);
        } else {
            this.min = a as Vec2;
            this.max = b as Vec2;
        }
    }

    /** Returns the center of this rect. */
    Center(): Vec2 {
        return this.min.Add(this.max).Times(0.5);
    }

    /** Returns the diagonal of this rect (vector from min to max). */
    Diagonal(): Vec2 {
        return this.max.Sub(this.min);
    }

    /** Returns true if point is contained in this rect (including boundary). */
    Test(point: Vec2): boolean {
        return this.min.x <= point.x && this.max.x >= point.x && this.min.y <= point.y && this.max.y >= point.y;
    }
};

/**
 *  Returns a Rect with the given center, whose distance to its (min, max) corners is span.
 *
 * Example: FromCenterSpan(center: {x: 1, y: 2}, span: {x: 3, y: 4}) returns {min: {x: -2, y: -2}, max: {x: 4, y: 6}}.
 */
export function FromCenterSpan(center: Vec2, span: Vec2): Rect {
    return new Rect(center.Sub(span), center.Add(span));
}

/** Returns a square Rect with the given center and inner radius. */
export function FromCenterRadius(center: Vec2, radius: number): Rect {
    const span = new Vec2(radius, radius);
    return FromCenterSpan(center, span);
}

/** Given a collection of rects, return the smallest rect that contains them all. */
export function CommonBounds(...rects: Array<Rect>): Rect {
    let x0 = Number.POSITIVE_INFINITY;
    let y0 = Number.POSITIVE_INFINITY;
    let x1 = Number.NEGATIVE_INFINITY;
    let y1 = Number.NEGATIVE_INFINITY;
    for (let rect of rects) {
        x0 = Math.min(x0, rect.min.x);
        y0 = Math.min(y0, rect.min.y);
        x1 = Math.max(x1, rect.max.x);
        y1 = Math.max(y1, rect.max.y);
    }
    return new Rect(x0, y0, x1, y1);
}
