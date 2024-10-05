"use client";

import styles from "./page.module.css";
import Captcha from "@/components/captcha/Captcha";

export default function Home() {
  const onReady = () => {
    console.log('onReady');
  };

  const onComplete = () => {
    console.log('onReady');
  };

  return (
    <div className={styles.page}>
      <Captcha
        clickCountToComplete={3}
        onReady={onReady}
        onComplete={onComplete}
      />
    </div>
  );
}
