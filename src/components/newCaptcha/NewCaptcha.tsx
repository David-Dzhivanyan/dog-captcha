"use client";

import s from "./NewCaptcha.module.css";
import bg500x250 from "@/public/images/dog-captcha/background500x250.webp";
import bg1000x500 from "@/public/images/dog-captcha/background1000x500.webp";
import bg1500x750 from "@/public/images/dog-captcha/background1500x750.webp";
import Pit from "@/components/svg/Pit";
import coin100x100 from "@/public/images/dog-captcha/coin100x100.webp";
import coin150x150 from "@/public/images/dog-captcha/coin150x150.webp";
import coin200x200 from "@/public/images/dog-captcha/coin200x200.webp";
import React, {useEffect, useRef, useState} from "react";
import {getRandomNumber} from "@/utils/support";
import Hole from "@/components/svg/Hole";

interface CaptchaProps {
  clickCountToComplete: number;
  onReady: () => void;
  onComplete: () => void;
}

const NewCaptcha: React.FC<CaptchaProps> = ({clickCountToComplete, onReady, onComplete }) => {
  const pitRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<HTMLDivElement>(null);
  const moneyRef = useRef<HTMLDivElement>(null);
  const [pitPosition, setPitPosition] = useState<number>(0);
  // const [awaitClick, setAwaitClick] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(1);

  useEffect(() => {
    const newOpacity = clickCount / (clickCountToComplete + 1);
    moneyRef.current!.style.opacity = `${newOpacity}`;
  }, [clickCount, clickCountToComplete]);

  useEffect(() => {
    pitRef.current!.style.bottom = '5%';
    holeRef.current!.style.bottom = '27%';

    if (pitPosition < 12 || pitPosition > 70) {
      pitRef.current!.style.bottom = '7%';
    }

    pitRef.current!.style.left = `${pitPosition}%`;
    holeRef.current!.style.left = `${pitPosition - 1.4}%`;
  }, [pitPosition]);

  useEffect(() => {
    setPitPosition(getRandomNumber(69, 70));
    onReady();
  }, [onReady]);

  function handleClick() {
    setClickCount(clickCount + 1);
  }

  return (
    <div className={s.root} onClick={handleClick}>
      <div ref={holeRef} className={s.hole}>
        <Hole/>
      </div>
      <img
        className={s.background}
        src={bg500x250.src}
        alt={'background'}
        srcSet={`${bg500x250.src} 500w, ${bg1000x500.src} 1000w, ${bg1500x750.src} 1500w`}
      />
      <div ref={pitRef} className={s.pit}>
        <Pit/>
        <div ref={moneyRef} className={s.money}>
          <img
            src={coin100x100.src}
            alt={'money'}
            id={'money'}
            srcSet={`${coin100x100.src} 500w, ${coin150x150.src} 1000w, ${coin200x200.src} 1500w`}
          />
        </div>
      </div>
    </div>
  );
}

export default NewCaptcha;