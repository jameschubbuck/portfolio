import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";

const TerminalAnimation = () => (
  <Terminal className="min-h-[200px]">
    <TypingAnimation delay={1} duration={80}>
      $ whoami
    </TypingAnimation>
    <AnimatedSpan delay={1000}>james.chubbuck</AnimatedSpan>
    <TypingAnimation delay={1200} duration={40}>
      $ !$ --verbose
    </TypingAnimation>
    <AnimatedSpan delay={1900}>
      Inspiring engineer @ Stanford University. Reputedly competent programmer
      and avid open source enthusiast.
    </AnimatedSpan>
  </Terminal>
);

export default TerminalAnimation;
