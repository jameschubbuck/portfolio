"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface EasterEggContextType {
  lastEvent: "none" | "reboot" | "konami";
  konamiCount: number;
  triggerReboot: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<"none" | "reboot" | "konami">("none");
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [konamiCount, setKonamiCount] = useState(0);

  const triggerReboot = () => {
    setLastEvent("reboot");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setLastEvent("konami");
          setKonamiCount((prev) => prev + 1);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [konamiIndex]);

  return (
    <EasterEggContext.Provider value={{ lastEvent, konamiCount, triggerReboot }}>
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext);
  if (context === undefined) {
    throw new Error("useEasterEgg must be used within a EasterEggProvider");
  }
  return context;
}
