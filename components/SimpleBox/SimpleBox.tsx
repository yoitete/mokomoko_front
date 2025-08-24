export const SimpleBox = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      background: "#fff",
      margin: "20px auto",
      padding: "16px",
      width: "90%",
      borderRadius: "8px",
      boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      height: "150px",
    }}
  >
    {children}
  </div>
);
