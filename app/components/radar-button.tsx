import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-2xl font-mono font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-green-500 text-slate-900 hover:bg-green-400 focus-visible:outline-green-200",
  secondary:
    "border border-green-700 text-green-100 hover:border-green-500 hover:text-green-50 focus-visible:outline-green-400",
  ghost:
    "border border-transparent bg-slate-900/40 text-green-200 hover:border-green-700 focus-visible:outline-green-300",
};

const sizeStyles: Record<Size, string> = {
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

function computeClassName({
  variant = "primary",
  size = "md",
  className = "",
}: Pick<BaseProps, "variant" | "size" | "className">) {
  return [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type RadarButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: false;
  };

export function RadarButton({
  children,
  variant,
  size,
  className,
  ...props
}: RadarButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={computeClassName({ variant, size, className })}
    >
      {children}
    </button>
  );
}

type RadarLinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export function RadarLinkButton({
  children,
  href,
  variant,
  size,
  className,
  ...props
}: RadarLinkButtonProps) {
  return (
    <Link
      {...props}
      href={href}
      className={computeClassName({ variant, size, className })}
    >
      {children}
    </Link>
  );
}
