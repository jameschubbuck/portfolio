{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        go
        gotools
        gopls
        entr
      ];
      shellHook = ''
        echo "Go development environment"
        echo "  Run './dev.sh' for live-reload server on :8080"
        echo "  Run 'go run .' to start once"
      '';
    };
  };
}
