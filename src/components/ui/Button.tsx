import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  isLoading,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={`w-full px-4 py-3 text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 disabled:opacity-70 transition-all font-medium shadow-lg shadow-emerald-800/20 flex justify-center cursor-pointer items-center ${className}`}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
}