// File: components/CSVTag.tsx

import React from "react";
import { useDrag } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CSVTag({ name }: { name: string }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "CSV_TAG",
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <span ref={dragRef as (node: HTMLSpanElement | null) => void}>
      <Badge
        variant="secondary"
        className={cn(
          "cursor-move px-2 py-1 text-xs font-semibold shadow-md transition flex items-center space-x-2 border",
          "ddark:bg-teal-700 ark:border-teal-800 dark:text-white dark:hover:bg-teal-800 dark:hover:border-teal-900",
          "bg-teal-700 border-teal-800 text-white hover:bg-teal-800 hover:border-teal-900",
          isDragging && "opacity-50"
        )}
      >
        {name}
      </Badge>
    </span>
  );
}
