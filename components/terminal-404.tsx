"use client";

import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Terminal404 = () => {
  const [splashText, setSplashText] = useState<string>("Loading...");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSplashTexts = async () => {
      try {
        const response = await fetch("/splashes.txt");
        const text = await response.text();
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        if (lines.length > 0) {
          setSplashText(lines[Math.floor(Math.random() * lines.length)]);
        } else {
          setSplashText("404 Not Found");
        }
      } catch (error) {
        console.error("Error fetching splash texts:", error);
        setSplashText("404 Not Found");
      }
    };

    fetchSplashTexts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(3);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (countdown === null || cancelled) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router, cancelled]);

  const handleCancel = () => {
    setCancelled(true);
    setCountdown(null);
  };

  return (
    <Terminal className="min-h-[200px]">
      <TypingAnimation delay={0} duration={10}>
        $ http_status
      </TypingAnimation>
      <AnimatedSpan delay={100} className="text-red-500">
        <Link href="https://xkcd.com/1024/" target="_blank">
          Error: -41 Not Found
        </Link>
      </AnimatedSpan>
      <div className="flex items-center gap-2">
        <TypingAnimation delay={200} duration={10}>
          $ cat
        </TypingAnimation>
        <TypingAnimation
          delay={250}
          duration={10}
          as={Link}
          href="/splashes.txt"
          target="_blank"
          className="text-blue-500 underline"
        >
          splashes.txt
        </TypingAnimation>
      </div>
      <AnimatedSpan delay={300} className="text-muted-foreground">
        &quot;{splashText}&quot;
      </AnimatedSpan>
      <TypingAnimation delay={400} duration={10}>
        $ cd ~
      </TypingAnimation>

      {!cancelled && countdown !== null && (
        <AnimatedSpan delay={0} className="text-muted-foreground">
          Redirecting{" "}
          <Link href="/" className="underline text-blue-500">
            home
          </Link>{" "}
          in {countdown}... [
          <span
            onClick={handleCancel}
            className="cursor-pointer underline text-blue-500"
          >
            cancel
          </span>
          ]
        </AnimatedSpan>
      )}
      {cancelled && (
        <AnimatedSpan delay={0} className="text-muted-foreground">
          E.T. phone{" "}
          <Link href="/" className="underline text-blue-500">
            home
          </Link>
          ?
        </AnimatedSpan>
      )}
    </Terminal>
  );
};

export default Terminal404;
