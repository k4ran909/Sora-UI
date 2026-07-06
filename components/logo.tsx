import React from "react";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Premium Red Flame (Vibrant crimson gradient/solid fill) */}
      <path
        d="M 50 3 C 58 14 58 25 50 33 C 42 25 42 14 50 3 Z"
        fill="#ff3b30"
      />
      {/* Melting Black Wax Body (Dripping bottom shape) */}
      <path
        d="M 28 65 C 28 48 34 38 50 38 C 66 38 72 48 72 65 C 72 75 73 85 71 90 C 70 92 68 93 66 91 C 61 87 59 80 57 80 C 55 80 53 88 49 90 C 47 91 44 90 43 87 C 39 78 37 74 34 74 C 31 74 27 72 26 68 Z"
        fill="currentColor"
      />
      {/* Two Cute Vertical Oval White Eyes on the left side */}
      <ellipse cx="37" cy="59" rx="2.2" ry="4.2" fill="white" />
      <ellipse cx="46" cy="59" rx="2.2" ry="4.2" fill="white" />
    </svg>
  );
}
