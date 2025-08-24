export const SlideBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      background: "#fff",
      margin: "20px 0px 0px 10px",
      padding: "16px",
      width: "100%",
      borderRadius: "8px 0px 0px 8px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      overflowX: "auto",
      whiteSpace: "nowrap",
      height: "auto",
    }}
  >
    {children}
  </div>
);
