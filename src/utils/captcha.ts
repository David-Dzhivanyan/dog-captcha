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
