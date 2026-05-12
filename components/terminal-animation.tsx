"use client";

import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { useEasterEgg } from "@/components/easter-egg-provider";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GlitchText = ({
  lines,
  onComplete,
}: {
  lines: { text: string; className?: string }[];
  onComplete: () => void;
}) => {
  const [currentLines, setCurrentLines] = useState(lines);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&?";
    const interval = setInterval(() => {
      let allEmpty = true;
      const nextLines = currentLines.map((lineObj) => {
        if (!lineObj.text.trim()) return lineObj;
        const newText = lineObj.text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            if (Math.random() < 0.01 + iteration * 0.015) return " ";
            if (Math.random() < 0.5) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
          })
          .join("");

        if (newText.trim()) allEmpty = false;
        return { ...lineObj, text: newText };
      });

      setCurrentLines(nextLines);
      setIteration((prev) => prev + 1);

      if (allEmpty) {
        clearInterval(interval);
        setTimeout(onComplete, 100);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentLines, iteration, onComplete]);

  return (
    <div className="flex flex-col font-mono">
      {currentLines.map((line, i) => (
        <div
          key={i}
          className={cn(
            "text-sm font-normal tracking-tight break-words min-h-[20px]",
            line.className,
          )}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

const TerminalAnimation = () => {
  const { triggerReboot } = useEasterEgg();
  const [sequence, setSequence] = useState<
    "initial" | "rebooting" | "shutdown" | "booted"
  >("initial");
  const [countdown, setCountdown] = useState(3);

  const handleClose = () => {
    triggerReboot();
    setSequence("rebooting");
    setCountdown(3);
  };

  useEffect(() => {
    if (sequence === "rebooting") {
      const startCountdown = setTimeout(() => {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setSequence("shutdown");
              return 1;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, 3800);

      return () => clearTimeout(startCountdown);
    }

    // Shutdown is handled by GlitchText component now
  }, [sequence]);

  if (sequence === "shutdown") {
    return (
      <Terminal className="min-h-[200px]" onClose={handleClose}>
        <GlitchText
          lines={[
            { text: "$ sudo reboot", className: "font-bold" },
            { text: "Rebooting system...", className: "text-yellow-500" },
            {
              text: "[OK] Stopped user process.",
              className: "text-muted-foreground",
            },
            {
              text: "[OK] Saved system state.",
              className: "text-muted-foreground",
            },
            {
              text: "[OK] Restarted kernel.",
              className: "text-muted-foreground",
            },
            {
              text: `Rebooting in ${countdown}...`,
              className: "text-green-500",
            },
          ]}
          onComplete={() => setSequence("booted")}
        />
      </Terminal>
    );
  }

  if (sequence === "rebooting") {
    return (
      <Terminal className="min-h-[200px]" onClose={handleClose}>
        <TypingAnimation delay={0} duration={30}>
          $ sudo reboot
        </TypingAnimation>
        <AnimatedSpan delay={1000} className="text-yellow-500">
          Rebooting system...
        </AnimatedSpan>
        <AnimatedSpan delay={1500} className="text-muted-foreground">
          [OK] Stopping user processes...
        </AnimatedSpan>
        <AnimatedSpan delay={2200} className="text-muted-foreground">
          [OK] Saving system state...
        </AnimatedSpan>
        <AnimatedSpan delay={3000} className="text-muted-foreground">
          [OK] Restarting kernel...
        </AnimatedSpan>
        <AnimatedSpan delay={3800} className="text-green-500">
          Rebooting in {countdown}...
        </AnimatedSpan>
      </Terminal>
    );
  }

  // After reboot, show the initial animation again (or a variant)
  // The 'key' prop forces a re-mount to restart animations
  return (
    <Terminal
      className="min-h-[200px]"
      onClose={handleClose}
      key={sequence === "booted" ? "booted" : "initial"}
    >
      <TypingAnimation delay={1} duration={80}>
        $ whoami
      </TypingAnimation>
      <AnimatedSpan delay={1000}>james.chubbuck</AnimatedSpan>
      <TypingAnimation delay={1200} duration={40}>
        $ !$ --verbose
      </TypingAnimation>
      <AnimatedSpan delay={1900}>
        Inspiring engineer @ Stanford University. Reputedly competent programmer
        and avid{" "}
        <a
          href="https://www.gnu.org/gnu/manifesto.en.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline cursor-pointer"
        >
          open source
        </a>{" "}
        enthusiast.
      </AnimatedSpan>
    </Terminal>
  );
};

export default TerminalAnimation;
