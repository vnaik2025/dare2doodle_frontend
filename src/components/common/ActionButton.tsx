import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  count,
  active,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={!!active}
      aria-label={ariaLabel}
      className={
        "flex items-center justify-center gap-1 text-sm transition-colors " +
        (active ? "text-blue-500" : "text-gray-400 hover:text-blue-500") +
        (disabled ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      {/* icon */}
      <span className="flex items-center justify-center">{icon}</span>

      {/* count inline with icon */}
      {typeof count === "number" && count > 0 ? (
        <span className="text-xs text-gray-300">{count}</span>
      ) : null}
    </button>
  );
};

export default React.memo(ActionButton);
