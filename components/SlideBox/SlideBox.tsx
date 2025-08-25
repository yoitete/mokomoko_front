export const SlideBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    className="
    bg-white
    mt-5 ml-2
    p-4
    w-full
    rounded-l-lg
    shadow
    overflow-x-auto
    whitespace-nowrap
  "
  >
    {children}
  </div>
);
