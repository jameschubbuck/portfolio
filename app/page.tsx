import Header from "@/components/header";
import Footer from "@/components/footer";
import Socials from "@/components/socials";
import Projects from "@/components/projects";
import TerminalAnimation from "@/components/terminal-animation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-black bg-zinc-50 items-center">
      <main className="flex-1 flex flex-col items-center justify-center max-w-[520px] w-full mx-auto p-8 gap-8">
        <Header />
        <div className="w-full flex flex-col gap-4">
          <TerminalAnimation />
          <div className="flex justify-between pt-10 w-full">
            <Socials />
            <Projects />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
