import React from "react";

interface VedicPatternProps {
  opacity?: number;
  className?: string;
  type?: "dots" | "mandala";
}

export default function VedicPattern({ opacity = 0.04, className = "", type = "dots" }: VedicPatternProps) {
  if (type === "mandala") {
    return (
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 l5 35 L100 20 L85 60 L120 65 L85 70 L100 100 L65 85 L60 120 L55 85 L20 100 L35 70 L0 65 L35 60 L20 20 L55 35 Z M60 40 L80 60 L60 80 L40 60 Z' fill='%23622B14' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "240px 240px",
        }}
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `radial-gradient(#622B14 0.75px, transparent 0.75px)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}
