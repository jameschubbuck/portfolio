export default function Header() {
  return (
    <h1
      className="text-4xl w-full grid grid-flow-col auto-cols-max justify-between justify-items-center gap-4
                   max-[490px]:grid-flow-row max-[490px]:justify-center max-[490px]:text-center pb-10"
    >
      <span>ABOUT:JAMES</span>
      <span className="max-[490px]:hidden">CHUBBUCK</span>
    </h1>
  );
}
