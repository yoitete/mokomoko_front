import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function InputLong(props: Props) {
  return (
    <input
      {...props}
      className={`border w-full p-2 rounded-lg ${props.className ?? ""}`}
    />
  );
}
