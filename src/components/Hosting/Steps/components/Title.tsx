import React from "react";

export default function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-3xl font-bold ${className}`}>{children}</div>;
}
