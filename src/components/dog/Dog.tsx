import React, {useEffect, useRef, useState} from 'react';
import s from './Dog.module.css'
import Lottie, {LottieRefCurrentProps} from "lottie-react";
import stay from "@/public/lotties/dog-captcha/stay.json";
import run from "@/public/lotties/dog-captcha/run.json";
import dig from "@/public/lotties/dog-captcha/digging.json";
import blink from "@/public/lotties/dog-captcha/blink.json";
import stay_run from "@/public/lotties/dog-captcha/stay_run.json";
import stay_dig from "@/public/lotties/dog-captcha/stay_dig.json";
import run_stay from "@/public/lotties/dog-captcha/run_stay.json";
import dig_stay from "@/public/lotties/dog-captcha/dig_stay.json";
import {State} from "@/state/captcha";

interface DogProps {
  position: { x: number; y: number };
  state: State;
  direction: boolean;
  width: number;
}

const Dog: React.FC<DogProps> = ({ position, state, direction = true, width = 50 }) => {
  const [currentAnimation, setCurrentAnimation] = useState<any>();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

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

    if (lottieRef.current) {
      lottieRef.current.goToAndPlay(0, false);
    }
  }, [state, currentAnimation]);

  return (
    <div
      className={s.root}
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: !direction ? `scaleX(-1)` : `scaleX(1)`, width: `${width}%` }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={currentAnimation}
        loop={true} // или false, если не нужна зацикленная анимация
      />
      {/*<Lottie animationData={stay} className={`${s.stay} ${state === 'IDLE' && s.visible}`}/>*/}
      {/*<Lottie animationData={stay_run} className={`${s.stay_run} ${state === 'SITTING_DOWN' && s.visible}` } loop={false}/>*/}
      {/*<Lottie animationData={stay_dig} className={`${s.stay_dig} ${state === 'SITTING_DIG' && s.visible}` } loop={false}/>*/}
      {/*<Lottie animationData={run} className={`${s.run} ${state === 'MOVING' && s.visible}`}/>*/}
      {/*<Lottie animationData={dig} className={`${s.dig} ${state === 'DIGGING' && s.visible}`}/>*/}
      {/*<Lottie animationData={run_stay} className={`${s.run_stay} ${state === 'STANDING_UP' && s.visible}`} loop={false}/>*/}
      {/*<Lottie animationData={dig_stay} className={`${s.dig_stay} ${state === 'STANDING_DIG' && s.visible}`} loop={false}/>*/}
      {/*<Lottie animationData={blink} className={`${s.blink} ${state === 'COMPLETED' && s.visible}`} loop={false}/>*/}
    </div>
  );
};

export default Dog;