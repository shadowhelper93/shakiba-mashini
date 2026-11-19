/**
 * Pure carousel math for circular index wrapping, 3D perspective card offsets,
 * and pointer/touch swipe resolution.
 */

export function wrapCarouselIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

/**
 * Computes the shortest signed circular distance from activeIndex to itemIndex
 * so adjacent cards flank the active card symmetrically in 3D space.
 */
export function getCircularOffset(
  itemIndex: number,
  activeIndex: number,
  length: number,
): number {
  if (length <= 1) return 0;
  const normalizedActive = wrapCarouselIndex(activeIndex, length);
  const normalizedItem = wrapCarouselIndex(itemIndex, length);
  let diff = normalizedItem - normalizedActive;
  const half = length / 2;
  if (diff > half) diff -= length;
  if (diff < -half) diff += length;
  return diff;
}

export function resolveSwipeStep(deltaX: number, threshold = 48): -1 | 0 | 1 {
  if (deltaX <= -threshold) return 1;
  if (deltaX >= threshold) return -1;
  return 0;
}
