import React from "react";

export const EventTypeTag: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="rounded-sm border border-orange-200 bg-orange-100 px-2 py-0.5 text-center text-xs text-orange-400">
      {children}
    </div>
  );
};
