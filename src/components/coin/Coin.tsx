import React from 'react';
import coin100x100 from "@/public/images/dog-captcha/coin100x100.webp";
import coin150x150 from "@/public/images/dog-captcha/coin150x150.webp";
import coin200x200 from "@/public/images/dog-captcha/coin200x200.webp";
import s from "./Coin.module.css";

interface CoinProps {
  onClick?: () => void;
  position: { x: number; y: number };
  id: string;
  style: Record<string, string>;
}

const Coin: React.FC<CoinProps> = ({ onClick = () => {}, position, id, style }) => {
  return (
    <img
      id={id}
      className={s.root}
      src={coin100x100.src}
      alt="Coin"
      style={{ left: `${position.x}%`, top: `${position.y}%`, ...style}}
      srcSet={`${coin100x100.src} 500w, ${coin150x150.src} 1000w, ${coin200x200.src} 1500w`}
      onClick={onClick}
    />
  );
};

export default Coin;
