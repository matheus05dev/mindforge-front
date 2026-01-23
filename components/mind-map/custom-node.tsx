"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

const CustomNode = ({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label as string);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.label = label; // Update data reference
  };

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter") {
      setIsEditing(false);
      data.label = label;
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-2 shadow-lg rounded-md border-2",
        // Base styles
        "bg-card text-card-foreground",
        // Selected state - brighter purple border
        selected ? "border-purple-500 shadow-purple-500/20" : "border-border hover:border-purple-500/50",
        "min-w-[150px] transition-all duration-200"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <NodeResizer minWidth={100} minHeight={30} isVisible={selected} lineClassName="border-primary" handleClassName="h-3 w-3 bg-primary border-2 border-background" />
      
      {/* Top Handle for connecting from parents */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-muted-foreground"
      />

      <div className="flex items-center justify-center text-center">
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(evt) => setLabel(evt.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full text-center bg-transparent border-none focus:outline-none text-sm font-medium"
          />
        ) : (
          <div className="text-sm font-medium">{label}</div>
        )}
      </div>

      {/* Bottom Handle for connecting to children */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-muted-foreground"
      />
    </div>
  );
};

export default memo(CustomNode);
