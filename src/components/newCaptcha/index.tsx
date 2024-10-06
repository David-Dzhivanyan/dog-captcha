import React, {useEffect, useRef, useState} from 'react';
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
  const [dogDirection, setDogDirection] = useState(true);
  const [dogWidth] = useState(50);
  const [coinPosition] = useState({ y: 42, x: 50 });
  const [pitPosition, setPitPosition] = useState({ x: 0, y: 0 });
  const [pitWidth] = useState(20);
  const [holePosition, setHolePosition] = useState({ x: 0, y: 0 });
  const [currentState, setCurrentState] = useState<State>(stateCaptcha.currentState);
  const [isNearCoin, setIsNearCoin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickCoord, setClickCoord] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  let handleAnimationComplete = () => {
    console.log("Анимация завершена!");
  };

  useEffect(() => {
    stateCaptcha.maxClicks = clickCountToComplete;
  }, [clickCountToComplete]);

  useEffect(() => {
    const pitPos = {y: 5, x: getRandomNumber(25, 70)} ;
    const holePos = {y: 27, x: pitPos.x - 1.7} ;

    setPitPosition({...pitPos});
    setHolePosition({...holePos});
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (clickCoord.x < dogPosition.x + dogWidth/2) {
      setDogDirection(false);
    } else {
      setDogDirection(true);
    }

    setIsNearCoin(checkIsNearCoin());
    setIsNearCoin(checkIsNearCoin());
  }, [clickCoord, dogPosition]);

  useEffect(() => {
    if (currentState === 'MOVING') {
      // Симуляция движения собаки к монете
      setTimeout(() => {
        stateCaptcha.transition('reachCoin');
        setCurrentState('STANDING_UP');
        setDogPosition({...dogPosition, x: clickCoord.x - dogWidth/2}); // Собака подошла к монете
        handleAnimationComplete = () => {
          stateCaptcha.transition('animationEnd');
          setCurrentState('IDLE');
        };
        // setTimeout(() => {
        //   stateCaptcha.transition('animationEnd');
        //   setCurrentState('IDLE');
        // }, 1000);
      }, 1000); // Время, за которое собака "дойдет" до монеты
    }
  }, [currentState, coinPosition]);

  const handleCoinClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = event.target as HTMLElement;
    const parentRect = rootRef.current!.getBoundingClientRect();
    setClickCoord({y: ((event.clientY - parentRect.top) / rootRef.current!.offsetWidth) * 100, x: ((event.clientX - parentRect.left) / rootRef.current!.offsetWidth) * 100}) ;

    if(target.id === 'coin') {
      stateCaptcha.transition('clickCoin');
    } else {
      stateCaptcha.transition('clickPlace');
    }

    if (currentState === 'IDLE' && (!isNearCoin || (isNearCoin && target.id !== 'coin'))) {
      setCurrentState('SITTING_DOWN');
      handleAnimationComplete = () => {
        stateCaptcha.transition('animationEnd');
        setCurrentState('MOVING');
      };
      // setTimeout(() => {
      //   stateCaptcha.transition('animationEnd');
      //   setCurrentState('MOVING');
      // }, 1000);
    } else if (currentState === 'IDLE' && isNearCoin && target.id === 'coin') {
      setCurrentState('SITTING_DIG');
      setTimeout(() => {
        stateCaptcha.transition('animationEnd');
        setCurrentState('DIGGING');
        setTimeout(() => {
          if (clickCount < clickCountToComplete - 1) {
            setClickCount(prev => prev + 1);
            setCurrentState('STANDING_DIG');
            handleAnimationComplete = () => {
              stateCaptcha.transition('animationEnd');
              setCurrentState('IDLE');
            };
            // setTimeout(() => {
            //   stateCaptcha.transition('animationEnd');
            //   setCurrentState('IDLE');
            // }, 1000);
          } else {
            setCurrentState('COMPLETED');
          }
        }, 1000); // Копаем 1 секунду
      }, 1000);
    }
  };

  function checkIsNearCoin(): boolean {
    return Math.abs((pitPosition.x + pitWidth/2) - (dogPosition.x + dogWidth/2)) < 5;
  }

  return (
    <div ref={rootRef} className={s.root} onClick={handleCoinClick}>
      <Lottie className={s.cloud} animationData={cloud}/>
      <Lottie className={s.gras} animationData={gras}/>
      <Dog
        position={dogPosition}
        state={currentState}
        direction={dogDirection}
        width={dogWidth}
        onAnimationComplete={handleAnimationComplete}
      />
      <div className={s.hole} style={{left: `${holePosition.x}%`, bottom: `${holePosition.y}%`}}>
        <Hole/>
      </div>
      <img
        className={s.background}
        src={bg500x250.src}
        alt={'background'}
        srcSet={`${bg500x250.src} 500w, ${bg1000x500.src} 1000w, ${bg1500x750.src} 1500w`}
      />
      <div className={s.pit} style={{left: `${pitPosition.x}%`, bottom: `${pitPosition.y}%`, width: `${pitWidth}%`}}>
        <Pit/>
        <Coin position={coinPosition} id='coin'/>
      </div>
    </div>
  );
};

export default NewCaptcha;
