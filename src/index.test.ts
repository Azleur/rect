import { Rect, FromCenterSpan, FromCenterRadius, CommonBounds, BoundingBox } from './index';
import { Vec2 } from '@azleur/vec2';

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

test("Rect.Expand(number): Rect returns a copy of this rect, expanded by the provided factor", () => {
    const in1 = new Rect(0, 0, 2, 2);

    const out1 = in1.Expand(2);
    expect(out1).toEqual({ min: { x: -1, y: -1 }, max: { x: 3, y: 3 } }); // Center (1, 1), old diagonal (2, 2).
    expect(in1).toEqual({ min: { x: 0, y: 0 }, max: { x: 2, y: 2 } }); // in1 not modified.

    const out2 = in1.Expand(1);
    expect(out2).toEqual(in1); // Factor 1 does nothing.

    const out3 = in1.Expand(0);
    expect(out3).toEqual({ min: { x: 1, y: 1 }, max: { x: 1, y: 1 } }); // Factor 0 reduces to a point.

});

test("Rect.Translate(displacement) returns a copy of this rect, moved by the provided Vec2", () => {
    const zero  = new Rect( 0,  0,  0,  0);
    const unit  = new Rect( 0,  0,  1,  1);
    const rect1 = new Rect( 0,  1,  2,  3);
    const rect2 = new Rect(-8, -7, -2, -1);

    const zilch = new Vec2( 0, 0);
    const ones  = new Vec2( 1, 1);
    const west  = new Vec2(-1, 0);

    // Translation by zero is identity.
    expect(zero .Translate(zilch)).toEqual(zero );
    expect(unit .Translate(zilch)).toEqual(unit );
    expect(rect1.Translate(zilch)).toEqual(rect1);
    expect(rect2.Translate(zilch)).toEqual(rect2);

    // Ones adds 1 to everything.
    expect(zero .Translate(ones)).toEqual({ min: { x:  1, y:  1 }, max: { x:  1, y: 1 } });
    expect(unit .Translate(ones)).toEqual({ min: { x:  1, y:  1 }, max: { x:  2, y: 2 } });
    expect(rect1.Translate(ones)).toEqual({ min: { x:  1, y:  2 }, max: { x:  3, y: 4 } });
    expect(rect2.Translate(ones)).toEqual({ min: { x: -7, y: -6 }, max: { x: -1, y: 0 } });

    // west only modifies Xs.
    expect(zero .Translate(west)).toEqual({ min: { x: -1, y:  0 }, max: { x: -1, y:  0 } });
    expect(unit .Translate(west)).toEqual({ min: { x: -1, y:  0 }, max: { x:  0, y:  1 } });
    expect(rect1.Translate(west)).toEqual({ min: { x: -1, y:  1 }, max: { x:  1, y:  3 } });
    expect(rect2.Translate(west)).toEqual({ min: { x: -9, y: -7 }, max: { x: -3, y: -1 } });
});

test("FromCenterSpan(Vec2, Vec2): Rect creates a rect from a given center and distance to the extremes", () => {
    const rect1 = FromCenterSpan(new Vec2(1, 2), new Vec2(3, 4));

    expect(rect1).toEqual({ min: { x: -2, y: -2 }, max: { x: 4, y: 6 } });
});


test("FromCenterRadius(Vec2, number): Rect creates a square from a given center and inner radius", () => {
    const rect1 = FromCenterRadius(new Vec2(1, 2), 3);

    expect(rect1).toEqual({ min: { x: -2, y: -1 }, max: { x: 4, y: 5 } });
});

test("CommonBounds(...Rect): Rect returns the envelope of a collection of rects", () => {
    const zero = new Rect(0, 0, 0, 0);
    const unit = new Rect(0, 0, 1, 1);
    const rect1 = new Rect(0, 1, 2, 3);
    const rect2 = new Rect(-8, -7, -2, -1);

    const bound1 = new Rect(0, 0, 2, 3);
    const bound2 = new Rect(-8, -7, 0, 0);
    const bound3 = new Rect(-8, -7, 2, 3);

    expect(CommonBounds(zero)).toEqual(zero);
    expect(CommonBounds(unit)).toEqual(unit);
    expect(CommonBounds(rect1)).toEqual(rect1);
    expect(CommonBounds(rect2)).toEqual(rect2);

    expect(CommonBounds(zero, unit)).toEqual(unit);
    expect(CommonBounds(zero, rect1)).toEqual(bound1);
    expect(CommonBounds(unit, rect1)).toEqual(bound1);
    expect(CommonBounds(zero, unit, rect1)).toEqual(bound1);

    expect(CommonBounds(zero, rect2)).toEqual(bound2);
    expect(CommonBounds(zero, unit, rect1, rect2)).toEqual(bound3);
});

test("BoundingBox(...Vec2): Rect returns the envelope of a collection of points", () => {
    const p1 = new Vec2(0, 0);
    const p2 = new Vec2(1, 2);
    const p3 = new Vec2(-3, -4);
    const p4 = new Vec2(1, 1);

    expect(BoundingBox(p1)).toEqual({ min: { x: 0, y: 0 }, max: { x: 0, y: 0 } });
    expect(BoundingBox(p2)).toEqual({ min: { x: 1, y: 2 }, max: { x: 1, y: 2 } });

    expect(BoundingBox(p1, p2)).toEqual({ min: { x: 0, y: 0 }, max: { x: 1, y: 2 } });
    expect(BoundingBox(p1, p2, p4)).toEqual({ min: { x: 0, y: 0 }, max: { x: 1, y: 2 } });
    expect(BoundingBox(p2, p4)).toEqual({ min: { x: 1, y: 1 }, max: { x: 1, y: 2 } });

    expect(BoundingBox(p1, p2, p3, p4)).toEqual({ min: { x: -3, y: -4 }, max: { x: 1, y: 2 } });
});
