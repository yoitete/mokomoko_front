export const SimpleBox = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`
      bg-[#D8CDCD]
      mt-5
      p-4
      rounded-lg
      shadow
      ${className ?? ""}
    `}
  >
    {children}
  </div>
);
