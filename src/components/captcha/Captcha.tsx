"use client";

import React, {useEffect, useRef, useState} from 'react';
import Lottie, {LottieRefCurrentProps} from 'lottie-react';
import { playAnimationWithPromise, onLottieComplete, setPosition, setDirection } from '@/utils/captcha';
import { getRandomNumber, getCoordsInParent } from '@/utils/support';
import cloud from '@/public/lotties/dog-captcha/cloud.json';
import gras from '@/public/lotties/dog-captcha/gras.json';
import digging from '@/public/lotties/dog-captcha/digging.json';
import blink from '@/public/lotties/dog-captcha/blink.json';
import stay from '@/public/lotties/dog-captcha/stay.json';
import run from '@/public/lotties/dog-captcha/run.json';
import run_stay from '@/public/lotties/dog-captcha/run_stay.json';
import stay_run from '@/public/lotties/dog-captcha/stay_run.json';
import dig_stay_smile from '@/public/lotties/dog-captcha/dig_stay_smile.json';
import dig_stay from '@/public/lotties/dog-captcha/dig_stay.json';
import stay_dig from '@/public/lotties/dog-captcha/stay_dig.json';
import coin100x100 from '@/public/images/dog-captcha/coin100x100.webp';
import coin150x150 from '@/public/images/dog-captcha/coin150x150.webp';
import coin200x200 from '@/public/images/dog-captcha/coin200x200.webp';
import bg500x250 from '@/public/images/dog-captcha/background500x250.webp';
import bg1000x500 from '@/public/images/dog-captcha/background1000x500.webp';
import bg1500x750 from '@/public/images/dog-captcha/background1500x750.webp';
import s from './Captcha.module.css';
import Pit from "@/components/svg/Pit";
import Hole from "@/components/svg/Hole";

interface CaptchaProps {
  clickCountToComplete: number;
  onReady: () => void;
  onComplete: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({clickCountToComplete, onReady, onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pitRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<HTMLDivElement>(null);
  const diggingRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLDivElement>(null);
  const runStayRef = useRef<HTMLDivElement>(null);
  const stayRunRef = useRef<HTMLDivElement>(null);
  const blinkRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLDivElement>(null);
  const moneyRef = useRef<HTMLDivElement>(null);
  const diggingStayRef = useRef<HTMLDivElement>(null);
  const diggingStaySmileRef = useRef<HTMLDivElement>(null);
  const stayDiggingRef = useRef<HTMLDivElement>(null);
  const diggingLottieRef = useRef<LottieRefCurrentProps>(null);
  const runLottieRef = useRef<LottieRefCurrentProps>(null);
  const runStayLottieRef = useRef<LottieRefCurrentProps>(null);
  const stayRunLottieRef = useRef<LottieRefCurrentProps>(null);
  const blinkLottieRef = useRef<LottieRefCurrentProps>(null);
  const stayDiggingLottieRef = useRef<LottieRefCurrentProps>(null);
  const diggingStaySmileLottieRef = useRef<LottieRefCurrentProps>(null);
  const diggingStayLottieRef = useRef<LottieRefCurrentProps>(null);
  const stayLottieRef = useRef<LottieRefCurrentProps>(null);
  const [awaitClick, setAwaitClick] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(1);

  useEffect(() => {
    const newOpacity = clickCount / (clickCountToComplete + 1);
    moneyRef.current!.style.opacity = `${newOpacity}`;
  }, [clickCount, clickCountToComplete]);

  useEffect(() => {
    //Рандомная генерация ямы
    if (pitRef.current) {
      const pitPositionX = getRandomNumber(35, 70);

      pitRef.current.style.bottom = '5%';
      holeRef.current!.style.bottom = '27%';

      if (pitPositionX < 12 || pitPositionX > 70) {
        pitRef.current.style.bottom = '7%';
      }

      pitRef.current.style.left = `${pitPositionX}%`;
      holeRef.current!.style.left = `${pitPositionX - 1.4}%`;
    }

    onReady();
  }, [onReady]);

  function onClick (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLImageElement;
    const parentRect = rootRef.current!.getBoundingClientRect();
    const pitPosition = getCoordsInParent(rootRef.current!, pitRef.current!);
    const stayPosition = getCoordsInParent(rootRef.current!, stayRef.current!);
    let xClick = e.clientX - parentRect.left;

    const direction = setDirection(stayPosition.xCenter, xClick);

    setPosition(diggingRef.current!, pitPosition.x - diggingRef.current!.offsetWidth * 0.15, rootRef);
    setPosition(blinkRef.current!, pitPosition.x - blinkRef.current!.offsetWidth * 0.20, rootRef);

    if (!awaitClick) {
      animationDirection(direction);

      if (target.id === 'money' && Math.abs(stayPosition.xCenter - pitPosition.xCenter) < 10) {
        digOnClick();
      } else {
        if (target.id === 'money') {
          xClick = pitPosition.xCenter;
        }
        runOnClick(xClick, direction);
      }
    }
  }

  async function digOnClick () {
    diggingRef.current!.style.transform = ('scaleX(-1)');
    blinkRef.current!.style.transform = ('scaleX(-1)');
    stayRunRef.current!.style.transform = ('scaleX(-1)');
    stayRef.current!.style.transform = ('scaleX(-1)');
    runStayRef.current!.style.transform = ('scaleX(-1)');
    stayDiggingRef.current!.style.transform = ('scaleX(-1)');
    diggingStayRef.current!.style.transform = ('scaleX(-1)');
    diggingStaySmileRef.current!.style.transform = ('scaleX(-1)');

    setAwaitClick(true);
    stayRef.current!.style.visibility = 'hidden';
    stayDiggingRef.current!.style.visibility = 'visible';
    diggingLottieRef.current!.goToAndStop(0, true);
    await playAnimationWithPromise(stayDiggingLottieRef, rootRef);
    stayDiggingRef.current!.style.visibility = 'hidden';
    diggingRef.current!.style.visibility = 'visible';
    diggingLottieRef.current!.play();
    holeRef.current!.style.visibility = 'visible';

    setTimeout(async () => {
      setClickCount(clickCount + 1);
      diggingRef.current!.style.visibility = 'hidden';
      if (clickCount === clickCountToComplete) {
        blinkRef.current!.style.visibility = 'visible';
        blinkLottieRef.current!.play();
        setAwaitClick(true);
        onComplete();
      } else {
        if (clickCount === Math.floor((clickCountToComplete + 1)/2)) {
          diggingStaySmileRef.current!.style.visibility = 'visible';
          await playAnimationWithPromise(diggingStaySmileLottieRef, diggingStaySmileRef);
          diggingStaySmileRef.current!.style.visibility = 'hidden';
        } else {
          diggingStayRef.current!.style.visibility = 'visible';
          await playAnimationWithPromise(diggingStayLottieRef, diggingStayRef);
          diggingStayRef.current!.style.visibility = 'hidden';
        }

        stayRef.current!.style.visibility = 'visible';
        setAwaitClick(false);
      }
    }, 1000);
  }

  async function runOnClick(xClick: number, direction: number) {
    let run = false;
    let runPosition = getCoordsInParent(rootRef.current!, runRef.current!);

    if (xClick < runRef.current!.offsetWidth / 2) {
      xClick = runRef.current!.offsetWidth / 2;
    } else if (xClick > rootRef.current!.offsetWidth - runRef.current!.offsetWidth / 2) {
      xClick = rootRef.current!.offsetWidth - runRef.current!.offsetWidth / 2;
    }

    if (Math.abs(xClick - runPosition.xCenter) > 1) {
      setAwaitClick(true);
      stayRunRef.current!.style.visibility = 'visible';
      stayRef.current!.style.visibility = 'hidden';
      await playAnimationWithPromise(stayRunLottieRef, rootRef);
    }

    const runInterval = setInterval(async () => {
      setAwaitClick(true);
      runPosition = getCoordsInParent(rootRef.current!, runRef.current!)

      if (Math.abs(xClick - runPosition.xCenter) > 1) {
        run = true;
        runRef.current!.style.visibility = 'visible';
        stayRunRef.current!.style.visibility = 'hidden';
        runLottieRef.current!.play()

        if (direction) {
          setPosition(runRef.current!, runPosition.x + 1, rootRef);
        } else {
          setPosition(runRef.current!, runPosition.x - 1, rootRef);
        }
      } else {
        clearInterval(runInterval);
        if (run) {
          setPosition(stayRef.current!, runPosition.xCenter - stayRef.current!.offsetWidth / 1.95, rootRef);
          setPosition(stayRunRef.current!, runPosition.xCenter - stayRunRef.current!.offsetWidth / 1.95, rootRef);
          setPosition(runStayRef.current!, runPosition.xCenter - stayRunRef.current!.offsetWidth / 1.95, rootRef);
          setPosition(stayDiggingRef.current!, runPosition.xCenter - stayRunRef.current!.offsetWidth / 1.95, rootRef);
          setPosition(diggingStaySmileRef.current!, runPosition.xCenter - stayRunRef.current!.offsetWidth / 1.95, rootRef);
          setPosition(diggingStayRef.current!, runPosition.xCenter - stayRunRef.current!.offsetWidth / 1.95, rootRef);

          runStayRef.current!.style.visibility = 'visible';
          runRef.current!.style.visibility = 'hidden';
          await playAnimationWithPromise(runStayLottieRef, rootRef);
          runLottieRef.current!.goToAndStop(0, true);
          stayLottieRef.current!.goToAndPlay(0, true);
          stayRef.current!.style.visibility = 'visible';
          runStayRef.current!.style.visibility = 'hidden';
        }
        run = false;
        setAwaitClick(false);
      }
    }, 10);
  }

  function animationDirection(direction: number) {
    if (direction) {
      runRef.current!.style.transform = 'scaleX(1)';
      stayRef.current!.style.transform = 'scaleX(1)';
      stayRunRef.current!.style.transform = 'scaleX(1)';
      runStayRef.current!.style.transform = 'scaleX(1)';
      runStayRef.current!.style.transform = 'scaleX(1)';
    } else {
      runRef.current!.style.transform = 'scaleX(-1)';
      stayRef.current!.style.transform = 'scaleX(-1)';
      stayRunRef.current!.style.transform = 'scaleX(-1)';
      runStayRef.current!.style.transform = 'scaleX(-1)';
    }
  }

  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={rootRef} className={s.root} onClick={onClick}>
      <Lottie className={s.cloud} animationData={cloud}/>
      <Lottie className={s.gras} animationData={gras}/>
      <div ref={holeRef} className={s.hole}>
        <Hole/>
      </div>
      <div ref={diggingRef} className={s.digging}>
        <Lottie
          lottieRef={diggingLottieRef}
          className={s.lottie}
          animationData={digging}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(diggingRef)}
        />
      </div>
      <div ref={runStayRef} className={s.runStay}>
        <Lottie
          lottieRef={runStayLottieRef}
          className={s.lottie}
          animationData={run_stay}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(runStayRef)}
        />
      </div>
      <div ref={stayRunRef} className={s.stayRun}>
        <Lottie
          lottieRef={stayRunLottieRef}
          className={s.lottie}
          animationData={stay_run}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(stayRunRef)}
        />
      </div>
      <div ref={diggingStayRef} className={s.diggingStay}>
        <Lottie
          lottieRef={diggingStayLottieRef}
          className={s.lottie}
          animationData={dig_stay}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(diggingStayRef)}
        />
      </div>
      <div ref={diggingStaySmileRef} className={s.diggingStaySmile}>
        <Lottie
          lottieRef={diggingStaySmileLottieRef}
          className={s.lottie}
          animationData={dig_stay_smile}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(diggingStaySmileRef)}
        />
      </div>
      <div ref={stayDiggingRef} className={s.stayDigging}>
        <Lottie
          lottieRef={stayDiggingLottieRef}
          className={s.lottie}
          animationData={stay_dig}
          loop={false}
          autoplay={false}
          onComplete={() => onLottieComplete(stayDiggingRef)}
        />
      </div>
      <div ref={blinkRef} className={s.blink}>
        <Lottie
          lottieRef={blinkLottieRef}
          className={s.lottie}
          animationData={blink}
          loop={false}
          autoplay={false}
        />
      </div>
      <div ref={runRef} className={s.run}>
        <Lottie
          lottieRef={runLottieRef}
          className={s.lottie}
          animationData={run}
          loop={true}
          autoplay={false}
        />
      </div>
      <div ref={stayRef} className={s.stay}>
        <Lottie lottieRef={stayLottieRef} className={s.lottie} animationData={stay}/>
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
};

export default Captcha;