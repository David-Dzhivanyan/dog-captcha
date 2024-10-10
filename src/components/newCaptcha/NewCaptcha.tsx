'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import stateCaptcha, {State} from '@/state/captcha';
import Dog from "@/components/dog/Dog";
import Coin from "@/components/coin/Coin";
import s from "@/components/newCaptcha/NewCaptcha.module.css";
import Hole from "@/components/svg/Hole";
import bg500x250 from "@/public/images/dog-captcha/background500x250.webp";
import bg1000x500 from "@/public/images/dog-captcha/background1000x500.webp";
import bg1500x750 from "@/public/images/dog-captcha/background1500x750.webp";
import Pit from "@/components/svg/Pit";
import {getRandomNumber} from "@/utils/support";
import Lottie from "lottie-react";
import cloud from "@/public/lotties/dog-captcha/cloud.json";
import gras from "@/public/lotties/dog-captcha/gras.json";

interface CaptchaProps {
  clickCountToComplete: number;
  onReady: () => void;
  onComplete: () => void;
}

const NewCaptcha: React.FC<CaptchaProps> = ({clickCountToComplete, onReady, onComplete }) => {
  const [dogPosition, setDogPosition] = useState({ x: 0, y: 16.5 });
  const [dogDirection, setDogDirection] = useState(false);
  const [dogWidth] = useState(50);
  const [coinPosition] = useState({ y: 42, x: 50 });
  const [pitPosition, setPitPosition] = useState({ x: -100, y: 0 });
  const [pitWidth] = useState(20);
  const [holePosition, setHolePosition] = useState({ x: 0, y: 0 });
  const [currentState, setCurrentState] = useState<State>(stateCaptcha.currentState);
  const [isNearCoin, setIsNearCoin] = useState(stateCaptcha.isNearCoin);
  const [clickCount, setClickCount] = useState(0);
  const [coinOpacity, setCoinOpacity] = useState((clickCount + 1) / clickCountToComplete);
  const [clickCoord, setClickCoord] = useState({ x: 0, y: 0 });
  const [isClickCoin, setIsClickCoin] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const handleAnimationCompleteRef = useRef(() => {});
  const checkIsNearCoin = useCallback((): boolean => {
    return Math.abs(((pitPosition.x + (pitWidth * coinPosition.x) / 100) - 1) - (dogPosition.x + dogWidth / 2)) < 2;
  }, [pitPosition.x, pitWidth, coinPosition.x, dogPosition.x, dogWidth]);

  useEffect(() => {
    stateCaptcha.maxClicks = clickCountToComplete;
  }, [clickCountToComplete]);

  useEffect(() => {
    setCoinOpacity((clickCount + 1) / (clickCountToComplete + 1));
  }, [clickCount, clickCountToComplete]);

  useEffect(() => {
    const pitPos = {y: 5, x: getRandomNumber(25, 70)} ;
    const holePos = {y: 26, x: pitPos.x - 1.7};
    setPitPosition({...pitPos});
    setHolePosition({...holePos});
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (clickCoord.x < dogPosition.x + dogWidth/2 || (checkIsNearCoin() && isClickCoin)) {
      if (clickCoord.x === 0 && clickCoord.y === 0) {
        setDogDirection(true);
      } else {
        setDogDirection(false);
      }
    } else {
      setDogDirection(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickCoord]);

  useEffect(() => {
    setIsNearCoin(checkIsNearCoin());
    stateCaptcha.isNearCoin = checkIsNearCoin();
  }, [checkIsNearCoin, dogPosition]);

  useEffect(() => {
    const performDogMove = async () => {
      if (isClickCoin) {
        await dogMoving({...dogPosition, x: (pitPosition.x + pitWidth * coinPosition.x / 100) - 1});
      } else {
        await dogMoving({...dogPosition, x: clickCoord.x});
      }

      stateCaptcha.transition('reachCoin');
      setCurrentState('STANDING_UP');
      handleAnimationCompleteRef.current = () => {
        stateCaptcha.transition('animationEnd');
        setCurrentState('IDLE');
      };
    }

    if (currentState === 'MOVING') {
      performDogMove();
    } else if (currentState === 'DIGGING') {
      handleAnimationCompleteRef.current = () => {
        if (clickCount < clickCountToComplete - 1) {
          setClickCount(prev => prev + 1);
          setCurrentState('STANDING_DIG');
          handleAnimationCompleteRef.current = () => {
            stateCaptcha.transition('animationEndDig');
            setCurrentState('IDLE');
          };
        } else {
          setCurrentState('COMPLETED');
          handleAnimationCompleteRef.current = () => {
            stateCaptcha.transition('animationEndComplete');
            onComplete();
          };
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState, coinPosition]);

  const handleCoinClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    const parentRect = rootRef.current!.getBoundingClientRect();
    const coords = {y: ((event.clientY - parentRect.top) / rootRef.current!.offsetWidth) * 100, x: ((event.clientX - parentRect.left) / rootRef.current!.offsetWidth) * 100};

    if(target.id === 'coin') {
      setIsClickCoin(true);
      stateCaptcha.transition('clickCoin');
    } else {
      setIsClickCoin(false);
      stateCaptcha.transition('clickPlace');
    }

    if (currentState === 'IDLE' && (!isNearCoin || target.id !== 'coin')) {
      setCurrentState('SITTING_DOWN');
      setClickCoord(coords) ;
      handleAnimationCompleteRef.current = () => {
        stateCaptcha.transition('animationEnd');
        setCurrentState('MOVING');
      };
    } else if (currentState === 'IDLE' && isNearCoin && target.id === 'coin') {
      setClickCoord(coords);
      setCurrentState('SITTING_DIG');
      handleAnimationCompleteRef.current = () => {
        stateCaptcha.transition('animationEnd');
        setCurrentState('DIGGING');
      };
    }
  };

  const dogMoving = (end: { x: number, y: number }): Promise<void>  => {
    return new Promise((resolve) => {
      const currentPos = {...dogPosition, x: dogPosition.x};
      const step = 0.4;

      if (end.x < dogWidth / 4) {
        end.x = dogWidth / 4;
      } else if (end.x > 100 - dogWidth / 4) {
        end.x = 100 - dogWidth / 4;
      }

      const moveDog = () => {
        if ((Math.floor(currentPos.x + dogWidth/2) === Math.floor(end.x))) {
          setDogPosition({...end, x: end.x - dogWidth/2});
          resolve();
        } else {
          if (dogDirection) {
            currentPos.x += step;
          } else {
            currentPos.x -= step;
          }
          setDogPosition({...dogPosition, x: currentPos.x}); // Обновляем позицию собаки
          setTimeout(moveDog, 10);
        }
      };

      moveDog();
    });
  };

  return (
    <div ref={rootRef} className={s.root} onClick={handleCoinClick}>
      <Lottie className={s.cloud} animationData={cloud}/>
      <Lottie className={s.gras} animationData={gras}/>
      <div className={s.hole} style={{left: `${holePosition.x}%`, bottom: `${holePosition.y}%`, visibility: `${clickCount > 0 ? 'visible' : 'hidden'}`}}>
        <Hole/>
      </div>
      <Dog
        position={dogPosition}
        state={currentState}
        direction={dogDirection}
        width={dogWidth}
        onAnimationComplete={() => handleAnimationCompleteRef.current()}
      />
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        className={s.background}
        src={bg500x250.src}
        alt={'background'}
        srcSet={`${bg500x250.src} 500w, ${bg1000x500.src} 1000w, ${bg1500x750.src} 1500w`}
      />
      <div className={s.pit} style={{left: `${pitPosition.x}%`, bottom: `${pitPosition.y}%`, width: `${pitWidth}%`}}>
        <Pit/>
        <Coin position={coinPosition} id='coin' style={{opacity: `${coinOpacity}`}}/>
      </div>
    </div>
  );
};

export default NewCaptcha;
