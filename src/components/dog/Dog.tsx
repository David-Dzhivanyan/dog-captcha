import React from 'react';
import s from './Dog.module.css'
import Lottie from "lottie-react";
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
}

const Dog: React.FC<DogProps> = ({ position, state, direction = true }) => {
  return (
    <div
      className={s.root}
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: !direction ? `scaleX(-1)` : `scaleX(1)` }}
    >
      {state === 'IDLE' && <Lottie animationData={stay} className={s.stay}/>}
      {state === 'SITTING_DOWN' && <Lottie animationData={stay_run} className={s.stay_run} loop={false}/>}
      {state === 'SITTING_DIG' && <Lottie animationData={stay_dig} className={s.stay_dig} loop={false}/>}
      {state === 'MOVING' && <Lottie animationData={run} className={s.run}/>}
      {state === 'STANDING_UP' && <Lottie animationData={run_stay} className={s.run_stay} loop={false}/>}
      {state === 'STANDING_DIG' && <Lottie animationData={dig_stay} className={s.dig_stay} loop={false}/>}
      {state === 'DIGGING' && <Lottie animationData={dig} className={s.dig}/>}
      {state === 'COMPLETED' && <Lottie animationData={blink} className={s.blink} loop={false}/>}
    </div>
  );
};

export default Dog;