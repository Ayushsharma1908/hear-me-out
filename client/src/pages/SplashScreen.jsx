import { useEffect, useState } from "react";
import BotIcon from "../assets/bot-icon.svg";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start fade out after 1.2s
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    // End splash after 1.8s
    const endTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black
        transition-opacity duration-500
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <img
        src={BotIcon}
        alt="Bot Icon"
        className="
          w-20 h-20
          invert
        "
      />
    </div>
  );
}
