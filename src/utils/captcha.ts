import {RefObject} from "react";
import {LottieRefCurrentProps} from "lottie-react";

export function onLottieComplete(lottieRef: RefObject<HTMLDivElement>) {
  const completeEvent = new CustomEvent('complete', {
    bubbles: true,
  });

  lottieRef.current!.dispatchEvent(completeEvent);
}

export function playAnimationWithPromise (lottieRef: LottieRefCurrentProps, parent: HTMLDivElement): Promise<void>  {
  return new Promise((resolve) => {
    if (lottieRef) {
      const handleAnimationComplete = () => {
        resolve();
        parent.removeEventListener('complete', handleAnimationComplete);
      };

      parent.removeEventListener('complete', handleAnimationComplete);

      parent.addEventListener('complete', handleAnimationComplete);

      lottieRef.goToAndPlay(0, false);
    }
  });
}

export function setDirection(xElem: number, xClick: number): number {
  if (xElem > xClick) {
    return 0
  } else {
    return 1;
  }
}


export function setPosition(elem: HTMLElement, x: number, container: RefObject<HTMLDivElement>) {
  if (x > container.current!.offsetWidth / 2) {
    const rightInPixels = container.current!.offsetWidth - x - elem.offsetWidth;
    const rightInPercent = (rightInPixels / container.current!.offsetWidth) * 100;
    elem.style.right = `${rightInPercent}%`;
    elem.style.left = 'initial';
  } else {
    const leftInPercent = (x / container.current!.offsetWidth) * 100; // вычисляем в процентах
    elem.style.right = 'initial';
    elem.style.left = `${leftInPercent}%`;
  }
}
