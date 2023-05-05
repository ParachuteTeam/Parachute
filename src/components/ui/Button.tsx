import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface LoadableButtonProps extends React.PropsWithChildren {
  className?: string;
  loadingClassName?: string;
  loading?: boolean;
  disabledClassName?: string;
  disabled?: boolean;
  onClick: () => void;
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
  return (
    <button
      disabled={disabled || loading}
      className={`flex flex-row items-center justify-center gap-2 ${
        (loading
          ? loadingClassName
          : disabled
          ? disabledClassName
          : className) ?? ""
      } ${loading || disabled ? "cursor-not-allowed" : ""}`}
      onClick={onClick}
    >
      {loading && <AiOutlineLoading className="animate-spin" />}
      {children}
    </button>
  );
};
