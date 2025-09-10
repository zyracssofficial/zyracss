/**
 * Button Component - Build-Time Example
 *
 * ✅ Uses static ZyraCSS classes that are perfect for build-time scanning
 * ✅ Includes conditional static classes for different variants and sizes
 * ✅ All styles are pre-defined and extracted during build process
 */

export function Button({
  children,
  variant = "primary",
  size = "medium",
  onClick,
}) {
  // ✅ Static classes work perfectly with build-time scanning
  const baseClasses =
    "font-weight-[600] cursor-[pointer] transition-[all,0.2s] border-[none] outline-[none] d-[inline-flex] align-items-[center] justify-content-[center]";

  // ✅ Conditional static classes also work
  const variantClasses = {
    primary: "bg-[#3b82f6] c-[white] hover:bg-[#2563eb]",
    secondary:
      "bg-[white] c-[#3b82f6] border-[1px,solid,#3b82f6] hover:bg-[#f1f5f9]",
    danger: "bg-[#ef4444] c-[white] hover:bg-[#dc2626]",
    success: "bg-[#10b981] c-[white] hover:bg-[#059669]",
  };

  const sizeClasses = {
    small: "p-[8px,16px] font-size-[14px] border-radius-[4px]",
    medium: "p-[12px,24px] font-size-[16px] border-radius-[6px]",
    large: "p-[16px,32px] font-size-[18px] border-radius-[8px]",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function IconButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      <span className="margin-[0,8px,0,0] d-[inline-flex] align-items-[center]">
        {icon}
      </span>
      {children}
    </Button>
  );
}
