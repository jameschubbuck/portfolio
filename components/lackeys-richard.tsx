import fs from "fs";
import path from "path";
import Link from "next/link";

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
      <Link 
        href="https://xkcd.com/344/" 
        target="_blank" 
        className="absolute bottom-0 left-0 m-2 pointer-events-auto hidden min-[1260px]:block no-underline"
        aria-label="XKCD 344 Reference - Lackeys"
      >
        <pre className="text-[10px] leading-[10px] font-mono whitespace-pre text-muted-foreground/30 select-none">
          {lackeys}
        </pre>
      </Link>
      <Link 
        href="https://xkcd.com/344/" 
        target="_blank" 
        className="absolute bottom-0 right-0 m-2 pointer-events-auto hidden min-[1260px]:block no-underline"
        aria-label="XKCD 344 Reference - Richard"
      >
        <pre className="text-[10px] leading-[10px] font-mono whitespace-pre text-muted-foreground/30 select-none text-right">
          {richard}
        </pre>
      </Link>
    </div>
  );
}
