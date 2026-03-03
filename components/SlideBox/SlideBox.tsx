export const SlideBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    className="
      ml-2 py-4
      bg-[#D8CDCD]
      rounded-l-2xl
      overflow-x-auto
      overscroll-x-contain
      whitespace-nowrap
      snap-x snap-mandatory
      scroll-pl-4
      scrollbar-hide
    "
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    <div className="inline-block px-4">
      {children}
    </div>
  </div>
);
