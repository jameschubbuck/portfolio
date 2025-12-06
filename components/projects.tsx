import SocialButton from "@/components/social-button";
import { SiNixos } from "react-icons/si";
import { SwishIcon } from "@/components/icons/swish";
import { Drone } from "lucide-react";

export default function Projects() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl underline text-center">PROJECTS</h2>
      <div className="flex flex-col gap-4 items-center">
        <SocialButton
          href="https://tailwing.co"
          label="Tailwing"
          icon={(props) => (
            <SwishIcon {...props} style={{ width: "1.5em", height: "1.5em" }} />
          )}
        />
        <SocialButton
          href="https://github.com/jameschubbuck/nixos-config"
          label="NixOS Config"
          icon={SiNixos}
        />
        <SocialButton
          href="https://www.instagram.com/stanforduav/"
          label="Sky2"
          icon={Drone}
        />
      </div>
    </div>
  );
}
