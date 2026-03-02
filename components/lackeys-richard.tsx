import fs from "fs";
import path from "path";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LackeysRichard() {
  const lackeysPath = path.join(process.cwd(), "public", "lackeys.txt");
  const richardPath = path.join(process.cwd(), "public", "richard.txt");

  let lackeys = "";
  let richard = "";

  try {
    lackeys = fs.readFileSync(lackeysPath, "utf-8");
    richard = fs.readFileSync(richardPath, "utf-8");
  } catch (error) {
    console.error("Error reading ascii files:", error);
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 w-full h-0 overflow-visible">
      <AsciiLink content={lackeys} side="left" label="Lackeys" />
      <AsciiLink content={richard} side="right" label="Richard" />
    </div>
  );
}

function AsciiLink({
  content,
  side,
  label,
}: {
  content: string;
  side: "left" | "right";
  label: string;
}) {
  const isLeft = side === "left";
  
  return (
    <Link
      href="https://xkcd.com/344/"
      target="_blank"
      className={cn(
        "absolute bottom-0 m-2 pointer-events-auto hidden min-[1260px]:block no-underline",
        "transition-transform duration-300 ease-out",
        "translate-y-4 hover:translate-x-0 hover:translate-y-0 hover:rotate-0",
        isLeft 
          ? "left-0 -translate-x-8 rotate-12 origin-top-left" 
          : "right-0 translate-x-8 -rotate-12 origin-top-right"
      )}
      aria-label={`XKCD 344 Reference - ${label}`}
    >
      <pre 
        className={cn(
          "text-[10px] leading-[10px] font-mono whitespace-pre text-muted-foreground/30 select-none",
          !isLeft && "text-right"
        )}
      >
        {content}
      </pre>
    </Link>
  );
}
