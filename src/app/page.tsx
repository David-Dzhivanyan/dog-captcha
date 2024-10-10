"use client";

import styles from "./page.module.css";
import NewCaptcha from "@/components/newCaptcha/NewCaptcha";

export default function Home() {
  const onReady = () => {
    console.log('onReady');
  };

  const onComplete = () => {
    console.log('onComplete');
  };

  return (
    <div className={styles.page}>
      <div style={{maxWidth:500, maxHeight: 250, margin: '0 auto'}}>
        <NewCaptcha clickCountToComplete={3} onReady={onReady} onComplete={onComplete} />
      </div>
    </div>
  );
}
