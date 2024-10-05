export function getRandomNumber (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCoordsInParent(parent: HTMLElement, child: HTMLElement): { xCenter: number; x: number; y: number, right: number } {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return {
    xCenter: childRect.left - parentRect.left + (child.offsetWidth / 2),
    right: parentRect.right - childRect.right,
    x: childRect.left - parentRect.left,
    y: childRect.top - parentRect.top,
  };
}