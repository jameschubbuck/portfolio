"use client";

import { useEasterEgg } from "@/components/easter-egg-provider";
import Link from "next/link";

const Footer = () => {
  const { lastEvent, konamiCount } = useEasterEgg();

  if (lastEvent === "konami") {
    if (konamiCount % 2 === 0) {
      return (
        <footer className="w-full text-center text-sm grid grid-flow-col auto-cols-max justify-between max-w-[490] py-4">
          <span className="px-4">&lt;!--</span>
          <span>
            <Link
              href="https://youtu.be/QsWFbMc5t84?si=GmVHbdXDLbuYNtBJ"
              target="_blank"
              className="underline"
            >
              Using cheats doesn&apos;t mean we&apos;re not smart.
            </Link>
          </span>
          <span className="px-4">--&gt;</span>
        </footer>
      );
    }
    return (
      <footer className="w-full text-center text-sm grid grid-flow-col auto-cols-max justify-between max-w-[490] py-4">
        <span className="px-4">&lt;!--</span>
        <span>
          <Link
            href="https://xkcd.com/391/"
            target="_blank"
            className="underline"
          >
            You won the game!
          </Link>
        </span>
        <span className="px-4">--&gt;</span>
      </footer>
    );
  }

  return (
    <footer className="w-full text-center text-sm grid grid-flow-col auto-cols-max justify-between max-w-[490] py-4">
      <span className="px-4">&lt;!--</span>
      {lastEvent === "reboot" ? (
        <span>
          When one door closes,{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Special:Random"
            target="_blank"
            className="underline"
          >
            another opens
          </Link>
        </span>
      ) : (
        "Made with ❤️ in California"
      )}
      <span className="px-4">--&gt;</span>
    </footer>
  );
};

export default Footer;
