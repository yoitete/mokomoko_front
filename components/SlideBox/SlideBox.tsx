export const SlideBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    className="
      ml-2 px-4 py-4
      bg-[#D8CDCD]
      rounded-l-2xl
      overflow-x-auto
      overscroll-x-contain
      whitespace-nowrap
      snap-x snap-mandatory
      scrollbar-hide
    "
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {children}
  </div>
);
