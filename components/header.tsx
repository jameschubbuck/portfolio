export default function Header() {
  return (
    <h1
      className="text-4xl w-full flex justify-between items-center pb-10
                   max-[490px]:justify-center max-[490px]:gap-2"
    >
      <span>ABOUT:</span>
      <span>JAMES</span>
      <span className="max-[490px]:hidden">CHUBBUCK</span>
    </h1>
  );
}
