"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, MotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

interface AnimatedSpanProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSpanProps) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: delay / 1000 }}
    className={cn("text-sm font-normal tracking-tight", className)}
    {...props}
  >
    {children}
  </motion.div>
);

interface TypingAnimationProps extends MotionProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string. Received:");
  }

  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [children, duration, started]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-sm font-bold tracking-tight", className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {displayedText}
    </MotionComponent>
  );
};

interface TerminalProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Terminal = ({ children, className, onClose, ...props }: TerminalProps) => {
  return (
    <motion.div
      className={cn(
        "z-0 h-full  w-full max-w-lg border border-border bg-background mb-2",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-y-2 border-b border-border p-2">
        <div className="flex flex-row justify-between items-center gap-x-2">
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close terminal"
          >
            <X className="h-4 w-4" />
          </button>
          <ThemeToggle />
        </div>
      </div>
      <pre className="p-2 flex-1">
        <code className="whitespace-pre-wrap break-words gap-y-1 overflow-auto">
          {children}
        </code>
      </pre>
    </motion.div>
  );
};
