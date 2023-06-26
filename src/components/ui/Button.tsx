import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface LoadableButtonProps extends React.PropsWithChildren {
  className?: string;
  loadingClassName?: string;
  loading?: boolean;
  disabledClassName?: string;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
}

export const ButtonWithState: React.FC<LoadableButtonProps> = ({
  className,
  loadingClassName,
  loading,
  disabledClassName,
  disabled,
  onClick,
  children,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  return (
    <button
      disabled={disabled || loading}
      className={`flex flex-row items-center justify-center gap-2 ${
        (loading || internalLoading
          ? loadingClassName
          : disabled
          ? disabledClassName
          : className) ?? ""
      } ${loading || disabled ? "cursor-not-allowed" : ""}`}
      onClick={() => {
        const result = onClick?.();
        if (result instanceof Promise) {
          setInternalLoading(true);
          result.finally(() => setInternalLoading(false));
        }
      }}
    >
      {(loading || internalLoading) && (
        <AiOutlineLoading className="animate-spin" />
      )}
      {children}
    </button>
  );
};
