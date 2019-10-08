import { Rect, FromCenterSpan, FromCenterRadius } from './index';
import { Vec2 } from 'vec2';

test("Rect constructors return expected values", () => {
    const rect1 = new Rect(new Vec2(0, 1), new Vec2(2, 3));
    const rect2 = new Rect(0, 1, 2, 3);

    expect(rect1).toEqual(rect2);
    expect(rect1).toEqual({ min: { x: 0, y: 1 }, max: { x: 2, y: 3 } });
});

test("Rect.Center(): Vec2 returns the center of the rect", () => {
    const zero = new Rect(0, 0, 0, 0);
    const unit = new Rect(0, 0, 1, 1);
    const rect1 = new Rect(0, 1, 2, 3);
    const rect2 = new Rect(-8, -7, -2, -1);

    expect(zero.Center()).toEqual({ x: 0, y: 0 });
    expect(unit.Center()).toEqual({ x: 0.5, y: 0.5 });
    expect(rect1.Center()).toEqual({ x: 1, y: 2 });
    expect(rect2.Center()).toEqual({ x: -5, y: -4 });
});

test("Rect.Diagonal(): Vec2 returns the diagonal of a vector (max - min)", () => {
    const zero = new Rect(0, 0, 0, 0);
    const unit = new Rect(0, 0, 1, 1);
    const rect1 = new Rect(0, 1, 2, 3);
    const rect2 = new Rect(-8, -7, -2, -1);

    expect(zero.Diagonal()).toEqual({ x: 0, y: 0 });
    expect(unit.Diagonal()).toEqual({ x: 1, y: 1 });
    expect(rect1.Diagonal()).toEqual({ x: 2, y: 2 });
    expect(rect2.Diagonal()).toEqual({ x: 6, y: 6 });
});

test("Rect.Test(Vec2): boolean detects if the provided point is within the rect's limits (boundaries included)", () => {
    const zero = new Rect(0, 0, 0, 0);
    const unit = new Rect(0, 0, 1, 1);
    const rect1 = new Rect(0, 1, 2, 3);
    const rect2 = new Rect(-8, -7, -0.5, -0.5);

    const vecZero = new Vec2(0, 0);
    const vecOne = new Vec2(1, 1);
    const vecHalf = new Vec2(0.5, 0.5);
    const vecMinOne = new Vec2(-1, -1);

    expect(zero.Test(vecZero)).toBe(true);
    expect(zero.Test(vecOne)).toBe(false);
    expect(zero.Test(vecHalf)).toBe(false);
    expect(zero.Test(vecMinOne)).toBe(false);

    expect(unit.Test(vecZero)).toBe(true);
    expect(unit.Test(vecOne)).toBe(true);
    expect(unit.Test(vecHalf)).toBe(true);
    expect(unit.Test(vecMinOne)).toBe(false);

    expect(rect1.Test(vecZero)).toBe(false);
    expect(rect1.Test(vecOne)).toBe(true);
    expect(rect1.Test(vecHalf)).toBe(false);
    expect(rect1.Test(vecMinOne)).toBe(false);

    expect(rect2.Test(vecZero)).toBe(false);
    expect(rect2.Test(vecOne)).toBe(false);
    expect(rect2.Test(vecHalf)).toBe(false);
    expect(rect2.Test(vecMinOne)).toBe(true);
});

test("FromCenterSpan(Vec2, Vec2): Rect creates a rect from a given center and distance to the extremes", () => {
    const rect1 = FromCenterSpan(new Vec2(1, 2), new Vec2(3, 4));

    expect(rect1).toEqual({ min: { x: -2, y: -2 }, max: { x: 4, y: 6 } });
});


test("FromCenterRadius(Vec2, number): Rect creates a square from a given center and inner radius", () => {
    const rect1 = FromCenterRadius(new Vec2(1, 2), 3);

    expect(rect1).toEqual({ min: { x: -2, y: -1 }, max: { x: 4, y: 5 } });
});
