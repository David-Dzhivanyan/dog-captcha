"use client";

import styles from "./page.module.css";
import NewCaptcha from "@/components/newCaptcha/index";

export default function Home() {
  const onReady = () => {
    console.log('onReady');
  };

  const onComplete = () => {
    console.log('onReady');
  };

  return (
    <div className={styles.page}>
      <NewCaptcha clickCountToComplete={3} onReady={onReady} onComplete={onComplete} />
    </div>
  );
}
