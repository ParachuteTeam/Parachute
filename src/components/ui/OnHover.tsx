import React, { useState, useRef } from "react";
import type { ReactNode } from "react";

interface OnHoverProps {
  children: ReactNode;
  content: ReactNode;
}

const OnHover: React.FC<OnHoverProps> = ({ children, content }) => {
  const [containerHovered, setContainerHovered] = useState(false);
  const [contentHovered, setContentHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleContainerMouseEnter = () => {
    setContainerHovered(true);
  };

  const handleContainerMouseLeave = () => {
    setContainerHovered(false);
  };

  const handleContentMouseEnter = () => {
    setContentHovered(true);
  };

  const handleContentMouseLeave = () => {
    setContentHovered(false);
  };

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {children}
      {(containerHovered || contentHovered) && (
        <div
          className="absolute right-0 bottom-2 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:divide-gray-600 dark:bg-gray-700"
          ref={contentRef}
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default OnHover;
