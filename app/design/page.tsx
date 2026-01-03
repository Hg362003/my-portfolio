"use client";

import { useEffect, useRef } from "react";

export default function DesignPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Create fresh audio instance on page load
    const audio = new Audio("/song.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    audioRef.current = audio;

    const startAudio = () => {
      if (!hasStartedRef.current && audioRef.current) {
        audioRef.current.currentTime = 0; // always start from beginning
        audioRef.current.play().catch(() => {});
        hasStartedRef.current = true;

        window.removeEventListener("scroll", startAudio);
        window.removeEventListener("click", startAudio);
      }
    };

    // Start on first interaction
    window.addEventListener("scroll", startAudio);
    window.addEventListener("click", startAudio);

    // STOP audio when leaving page
    return () => {
      window.removeEventListener("scroll", startAudio);
      window.removeEventListener("click", startAudio);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      hasStartedRef.current = false;
    };
  }, []);

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <img
        src="/design.png"
        alt="Design Portfolio"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </main>
  );
}
