import { createLucideIcon } from "lucide-react";

// A simple Lucide-style Google glyph (monochrome).
export const GoogleIcon = createLucideIcon("Google", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "c" }],
  [
    "path",
    {
      d: "M14.8 12.2h-2.7v-1.9h4.8c.1.4.1.8.1 1.2 0 3.2-2.1 5.3-5.2 5.3-3.1 0-5.6-2.5-5.6-5.6S8.7 6.6 11.8 6.6c1.7 0 2.9.7 3.8 1.5l-1.3 1.3c-.5-.5-1.3-1-2.5-1-2 0-3.7 1.7-3.7 3.8 0 2.2 1.7 3.8 3.7 3.8 1.8 0 2.9-1 3.2-2.1Z",
      fill: "currentColor",
      stroke: "none",
      key: "g",
    },
  ],
]);
