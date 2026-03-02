import Terminal404 from "@/components/terminal-404";
import LackeysRichard from "@/components/lackeys-richard";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-black bg-zinc-50 items-center justify-center p-8">
      <LackeysRichard />
      <main className="flex flex-col items-center justify-center max-w-[520px] w-full mx-auto gap-8">
        <div className="w-full flex flex-col gap-4">
          <Terminal404 />
        </div>
      </main>
    </div>
  );
}
