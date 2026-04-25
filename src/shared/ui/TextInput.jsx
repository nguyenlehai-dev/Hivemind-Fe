import { forwardRef } from "react";

const TextInput = forwardRef(function TextInput(
  { className = "", type = "text", ...props },
  ref,
) {
  return <input ref={ref} type={type} className={className} {...props} />;
});

export default TextInput;
