import React, {useEffect, useRef, useState} from 'react';
import s from './Dog.module.css'
import Lottie, {LottieComponentProps, LottieRefCurrentProps} from "lottie-react";
import stay from "@/public/lotties/dog-captcha/stay.json";
import run from "@/public/lotties/dog-captcha/run.json";
import dig from "@/public/lotties/dog-captcha/digging.json";
import blink from "@/public/lotties/dog-captcha/blink.json";
import stay_run from "@/public/lotties/dog-captcha/stay_run.json";
import stay_dig from "@/public/lotties/dog-captcha/stay_dig.json";
import run_stay from "@/public/lotties/dog-captcha/run_stay.json";
import dig_stay from "@/public/lotties/dog-captcha/dig_stay.json";
import {State} from "@/state/captcha";
import {onLottieComplete, playAnimationWithPromise} from "@/utils/captcha";

interface DogProps {
  position: { x: number; y: number };
  state: State;
  direction: boolean;
  width: number;
  onAnimationComplete: () => void;
}

const Dog: React.FC<DogProps> = ({ position, state, direction = true, width = 50, onAnimationComplete }) => {
  const [currentAnimation, setCurrentAnimation] = useState<LottieComponentProps['animationData']>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    switch (state) {
      case "IDLE":
        setCurrentAnimation(stay);
        break;
      case "MOVING":
        setCurrentAnimation(run);
        break;
      case "DIGGING":
        setCurrentAnimation(dig);
        break;
      case "SITTING_DIG":
        setCurrentAnimation(stay_dig);
        break;
      case "SITTING_DOWN":
        setCurrentAnimation(stay_run);
        break;
      case "STANDING_UP":
        setCurrentAnimation(run_stay);
        break;
      case "STANDING_DIG":
        setCurrentAnimation(dig_stay);
        break;
      case "COMPLETED":
        setCurrentAnimation(blink);
        break;
    }
  }, [state]);

  useEffect(() => {
    if (lottieRef.current && currentAnimation) {
      handlePlayAnimation();
    }
  }, [currentAnimation]);

  const handlePlayAnimation = async () => {
    try {
      console.log('start')
      await playAnimationWithPromise(lottieRef, rootRef);
      console.log('end')
      onAnimationComplete();
    } catch (error) {
      console.error("Ошибка анимации:", error);
    }
  };

  return (
    <div
      ref={rootRef}
      className={s.root}
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: !direction ? `scaleX(-1)` : `scaleX(1)`, width: `${width}%` }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={currentAnimation}
        loop={false}
        className={s[state]}
        onComplete={() => onLottieComplete(rootRef)}
      />
    </div>
  );
};

export default Dog;