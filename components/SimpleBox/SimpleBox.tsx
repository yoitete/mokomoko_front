export const SimpleBox = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`
      bg-white
      mt-5
      p-4
      pl-12
      rounded-lg
      shadow
      ${className ?? ""}
    `}
  >
    {children}
  </div>
);
