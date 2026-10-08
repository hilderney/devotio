import type { ComponentProps } from "react";

type ButtonAppearance = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "regular" | "compact";
  className?: string;
};

/** Shared appearance for actions and navigation links, without changing their semantics. */
export function buttonClassName({
  variant = "primary",
  size = "regular",
  className,
}: ButtonAppearance = {}) {
  return [
    "button",
    `button--${variant}`,
    size === "compact" && "button--compact",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export type ButtonProps = ComponentProps<"button"> & ButtonAppearance;

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClassName({ variant, size, className })}
    />
  );
}

type IconButtonProps = ButtonProps & { "aria-label": string };

export function IconButton({
  className,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      className={["button--icon", className].filter(Boolean).join(" ")}
    />
  );
}
