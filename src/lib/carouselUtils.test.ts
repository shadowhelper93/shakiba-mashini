import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCircularOffset,
  resolveSwipeStep,
  wrapCarouselIndex,
} from './carouselUtils';

test('wrapCarouselIndex wraps negative and overflowing indices cleanly', () => {
  assert.equal(wrapCarouselIndex(0, 4), 0);
  assert.equal(wrapCarouselIndex(-1, 4), 3);
  assert.equal(wrapCarouselIndex(4, 4), 0);
  assert.equal(wrapCarouselIndex(7, 4), 3);
  assert.equal(wrapCarouselIndex(2, 0), 0);
});

test('getCircularOffset computes shortest signed offset for 3D carousel depth', () => {
  assert.equal(getCircularOffset(0, 0, 4), 0);
  assert.equal(getCircularOffset(1, 0, 4), 1);
  assert.equal(getCircularOffset(3, 0, 4), -1);
  assert.equal(getCircularOffset(0, 3, 4), 1);
  assert.equal(getCircularOffset(2, 3, 4), -1);
});

test('resolveSwipeStep converts horizontal drag distance to directional step', () => {
  assert.equal(resolveSwipeStep(-60, 48), 1);
  assert.equal(resolveSwipeStep(60, 48), -1);
  assert.equal(resolveSwipeStep(20, 48), 0);
  assert.equal(resolveSwipeStep(-20, 48), 0);
});
