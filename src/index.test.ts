import { Rect, FromCenterSpan, FromCenterRadius, CommonBounds, BoundingBox } from './index';
import { Vec2 } from '@azleur/vec2';

test("Rect constructors return expected values", () => {
    const rect1 = new Rect(new Vec2(0, 1), new Vec2(2, 3));
    const rect2 = new Rect(0, 1, 2, 3);

    expect(rect1).toEqual(rect2);
    expect(rect1).toEqual({ min: new Vec2(0, 1), max: new Vec2(2, 3) });
});

test("Rect.Center(): Vec2 returns the center of the rect", () => {
    const zero  = new Rect( 0,  0,  0,  0);
    const unit  = new Rect( 0,  0,  1,  1);
    const rect1 = new Rect( 0,  1,  2,  3);
    const rect2 = new Rect(-8, -7, -2, -1);

    expect(zero .Center()).toEqual(new Vec2(0  , 0  ));
    expect(unit .Center()).toEqual(new Vec2(0.5, 0.5));
    expect(rect1.Center()).toEqual(new Vec2(1  , 2  ));
    expect(rect2.Center()).toEqual(new Vec2(-5 , -4 ));
});

test("Rect.Diagonal(): Vec2 returns the diagonal of a vector (max - min)", () => {
    const zero  = new Rect( 0,  0,  0,  0);
    const unit  = new Rect( 0,  0,  1,  1);
    const rect1 = new Rect( 0,  1,  2,  3);
    const rect2 = new Rect(-8, -7, -2, -1);

    expect(zero .Diagonal()).toEqual(new Vec2(0, 0));
    expect(unit .Diagonal()).toEqual(new Vec2(1, 1));
    expect(rect1.Diagonal()).toEqual(new Vec2(2, 2));
    expect(rect2.Diagonal()).toEqual(new Vec2(6, 6));
});

test("Rect.Test(Vec2): boolean detects if the provided point is within the rect's limits (boundaries included)", () => {
    const zero  = new Rect( 0,  0,    0,    0);
    const unit  = new Rect( 0,  0,    1,    1);
    const rect1 = new Rect( 0,  1,    2,    3);
    const rect2 = new Rect(-8, -7, -0.5, -0.5);

    const vecHalf   = new Vec2(0.5, 0.5);
    const vecMinOne = new Vec2( -1,  -1);

    expect(zero.Test(Vec2.Zero)).toBe(true );
    expect(zero.Test(Vec2.One )).toBe(false);
    expect(zero.Test(vecHalf  )).toBe(false);
    expect(zero.Test(vecMinOne)).toBe(false);

    expect(unit.Test(Vec2.Zero)).toBe(true );
    expect(unit.Test(Vec2.One )).toBe(true );
    expect(unit.Test(vecHalf  )).toBe(true );
    expect(unit.Test(vecMinOne)).toBe(false);

    expect(rect1.Test(Vec2.Zero)).toBe(false);
    expect(rect1.Test(Vec2.One )).toBe(true );
    expect(rect1.Test(vecHalf  )).toBe(false);
    expect(rect1.Test(vecMinOne)).toBe(false);

    expect(rect2.Test(Vec2.Zero)).toBe(false);
    expect(rect2.Test(Vec2.One )).toBe(false);
    expect(rect2.Test(vecHalf  )).toBe(false);
    expect(rect2.Test(vecMinOne)).toBe(true );
});

test("Rect.Expand(number): Rect returns a copy of this rect, expanded by the provided factor", () => {
    const in1 = new Rect(0, 0, 2, 2);

    const out1 = in1.Expand(2);
    expect(out1).toEqual(new Rect(-1, -1, 3, 3)); // Center (1, 1), old diagonal (2, 2).
    expect(in1).toEqual(new Rect(0, 0, 2, 2)); // in1 not modified.

    const out2 = in1.Expand(1);
    expect(out2).toEqual(in1); // Factor 1 does nothing.

    const out3 = in1.Expand(0);
    expect(out3).toEqual(new Rect(1, 1, 1, 1)); // Factor 0 reduces to a point.

});

test("Rect.Grow(Vec2): Rect returns a copy of this rect, with padding added based on the provided amount", () => {
    const unitRect = new Rect( 0,  0, 1, 1);
    const bigRect  = new Rect(-1, -2, 3, 4);

    const vecDiag = new Vec2(2, 3);

    const out1 = unitRect.Grow(Vec2.X);
    expect(out1).toEqual(new Rect(-1, 0, 2, 1)); // Horizontal padding.
    expect(unitRect).toEqual(new Rect(0, 0, 1, 1)); // in1 not modified.

    const out2 = unitRect.Grow(Vec2.Y);
    expect(out2).toEqual(new Rect(0, -1, 1, 2)); // Vertical padding.

    const out3 = bigRect.Grow(vecDiag);
    expect(out3).toEqual(new Rect(-3, -5, 5, 7)); // Negatives work fine.

});

test("Rect.Translate(displacement) returns a copy of this rect, moved by the provided Vec2", () => {
    const zero  = new Rect( 0,  0,  0,  0);
    const unit  = new Rect( 0,  0,  1,  1);
    const rect1 = new Rect( 0,  1,  2,  3);
    const rect2 = new Rect(-8, -7, -2, -1);

    // Translation by zero is identity.
    expect(zero .Translate(Vec2.Zero)).toEqual(zero );
    expect(unit .Translate(Vec2.Zero)).toEqual(unit );
    expect(rect1.Translate(Vec2.Zero)).toEqual(rect1);
    expect(rect2.Translate(Vec2.Zero)).toEqual(rect2);

    // Ones adds 1 to everything.
    expect(zero .Translate(Vec2.One)).toEqual(new Rect( 1,  1,  1, 1));
    expect(unit .Translate(Vec2.One)).toEqual(new Rect( 1,  1,  2, 2));
    expect(rect1.Translate(Vec2.One)).toEqual(new Rect( 1,  2,  3, 4));
    expect(rect2.Translate(Vec2.One)).toEqual(new Rect(-7, -6, -1, 0));

    // west only modifies Xs.
    expect(zero .Translate(Vec2.Left)).toEqual(new Rect(-1,  0, -1,  0));
    expect(unit .Translate(Vec2.Left)).toEqual(new Rect(-1,  0,  0,  1));
    expect(rect1.Translate(Vec2.Left)).toEqual(new Rect(-1,  1,  1,  3));
    expect(rect2.Translate(Vec2.Left)).toEqual(new Rect(-9, -7, -3, -1));
});

test("FromCenterSpan(Vec2, Vec2): Rect creates a rect from a given center and distance to the extremes", () => {
    const rect1 = FromCenterSpan(new Vec2(1, 2), new Vec2(3, 4));

    expect(rect1).toEqual(new Rect(-2, -2, 4, 6));
});


test("FromCenterRadius(Vec2, number): Rect creates a square from a given center and inner radius", () => {
    const rect1 = FromCenterRadius(new Vec2(1, 2), 3);

    expect(rect1).toEqual(new Rect(-2, -1, 4, 5));
});

test("CommonBounds(...Rect): Rect returns the envelope of a collection of rects", () => {
    const zero  = new Rect( 0,  0,  0,  0);
    const unit  = new Rect( 0,  0,  1,  1);
    const rect1 = new Rect( 0,  1,  2,  3);
    const rect2 = new Rect(-8, -7, -2, -1);

    const bound1 = new Rect( 0,  0, 2, 3);
    const bound2 = new Rect(-8, -7, 0, 0);
    const bound3 = new Rect(-8, -7, 2, 3);

    expect(CommonBounds(zero )).toEqual(zero );
    expect(CommonBounds(unit )).toEqual(unit );
    expect(CommonBounds(rect1)).toEqual(rect1);
    expect(CommonBounds(rect2)).toEqual(rect2);

    expect(CommonBounds(zero, unit )).toEqual(unit  );
    expect(CommonBounds(zero, rect1)).toEqual(bound1);
    expect(CommonBounds(unit, rect1)).toEqual(bound1);
    expect(CommonBounds(zero, unit, rect1)).toEqual(bound1);

    expect(CommonBounds(zero, rect2)).toEqual(bound2);
    expect(CommonBounds(zero, unit, rect1, rect2)).toEqual(bound3);
});

test("BoundingBox(...Vec2): Rect returns the envelope of a collection of points", () => {
    const p1 = new Vec2( 0,  0);
    const p2 = new Vec2( 1,  2);
    const p3 = new Vec2(-3, -4);
    const p4 = new Vec2( 1,  1);

    expect(BoundingBox(p1)).toEqual(new Rect(0, 0, 0, 0));
    expect(BoundingBox(p2)).toEqual(new Rect(1, 2, 1, 2));

    expect(BoundingBox(p1, p2)).toEqual(new Rect(0, 0, 1, 2));
    expect(BoundingBox(p1, p2, p4)).toEqual(new Rect(0, 0, 1, 2));
    expect(BoundingBox(p2, p4)).toEqual(new Rect(1, 1, 1, 2));

    expect(BoundingBox(p1, p2, p3, p4)).toEqual(new Rect(-3, -4, 1, 2));
});
