import { ReactNode, useEffect, useRef } from "react";
import { cn } from "../utils/cn";

export function CommandRow(props: {
  type: "request" | "response";
  isError?: boolean;
  children: ReactNode;
  shouldScroll?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!props.shouldScroll || !ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [props.shouldScroll]);
  return (
    <span
      ref={ref}
      className={cn("rounded px-1.5 py-0.5", {
        "bg-gray-700": props.type === "request",
        "text-red-300": props.isError,
      })}
    >
      {props.type === "request" && "> "}
      {props.children}
    </span>
  );
}
