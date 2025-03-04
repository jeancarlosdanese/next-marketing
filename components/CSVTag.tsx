// File: components/CSVTag.tsx

import React from "react";
import { useDrag } from "react-dnd";

export default function CSVTag({ name }: { name: string }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "CSV_TAG",
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={dragRef as (node: HTMLSpanElement | null) => void}
      className={`inline-flex border items-center bg-green-200 text-green-800 text-xs px-2 py-1 rounded lowercase cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      {name}
    </span>
  );
}
