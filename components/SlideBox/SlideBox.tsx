export const SlideBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    className="
      px-4 py-4
      w-full
      bg-[#D8CDCD]
      rounded-l-2xl
      overflow-x-auto
      whitespace-nowrap
      snap-x snap-mandatory
      scrollbar-hide
    "
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {children}
  </div>
);
