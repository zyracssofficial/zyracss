/**
 * Layout Components - Build-Time Example
 *
 * ✅ All classes are static and perfect for build-time scanning
 * ✅ Provides flexible layout system with pre-defined options
 * ✅ Responsive design patterns work great with static classes
 */

export function Container({ children, maxWidth = "lg", className = "" }) {
  const maxWidthClasses = {
    sm: "max-width-[640px]",
    md: "max-width-[768px]",
    lg: "max-width-[1024px]",
    xl: "max-width-[1280px]",
    full: "max-width-[100%]",
  };

  return (
    <div
      className={`margin-[0,auto] p-[0,16px] ${maxWidthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
}

export function Grid({ children, cols = 3, gap = 4, className = "" }) {
  const colClasses = {
    1: "grid-template-columns-[1fr]",
    2: "grid-template-columns-[1fr,1fr]",
    3: "grid-template-columns-[1fr,1fr,1fr]",
    4: "grid-template-columns-[1fr,1fr,1fr,1fr]",
    6: "grid-template-columns-[repeat(6,1fr)]",
  };

  const gapClasses = {
    2: "gap-[8px]",
    4: "gap-[16px]",
    6: "gap-[24px]",
    8: "gap-[32px]",
  };

  return (
    <div
      className={`d-[grid] ${colClasses[cols]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

export function Flex({
  children,
  direction = "row",
  justify = "start",
  align = "stretch",
  gap = 0,
  className = "",
}) {
  const directionClasses = {
    row: "flex-direction-[row]",
    column: "flex-direction-[column]",
    "row-reverse": "flex-direction-[row-reverse]",
    "column-reverse": "flex-direction-[column-reverse]",
  };

  const justifyClasses = {
    start: "justify-content-[flex-start]",
    end: "justify-content-[flex-end]",
    center: "justify-content-[center]",
    between: "justify-content-[space-between]",
    around: "justify-content-[space-around]",
    evenly: "justify-content-[space-evenly]",
  };

  const alignClasses = {
    start: "align-items-[flex-start]",
    end: "align-items-[flex-end]",
    center: "align-items-[center]",
    stretch: "align-items-[stretch]",
    baseline: "align-items-[baseline]",
  };

  const gapClasses = {
    0: "",
    2: "gap-[8px]",
    4: "gap-[16px]",
    6: "gap-[24px]",
    8: "gap-[32px]",
  };

  return (
    <div
      className={`d-[flex] ${directionClasses[direction]} ${justifyClasses[justify]} ${alignClasses[align]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

export function Header({ children, sticky = false, className = "" }) {
  const stickyClasses = sticky ? "position-[sticky] top-[0] z-index-[50]" : "";

  return (
    <header
      className={`bg-[white] border-bottom-[1px,solid,#e5e7eb] ${stickyClasses} ${className}`}
    >
      <Container>
        <div className="d-[flex] justify-content-[space-between] align-items-[center] p-[16px,0]">
          {children}
        </div>
      </Container>
    </header>
  );
}

export function Main({ children, className = "" }) {
  return (
    <main className={`flex-[1] p-[32px,0] ${className}`}>
      <Container>{children}</Container>
    </main>
  );
}

export function Footer({ children, className = "" }) {
  return (
    <footer className={`bg-[#1f2937] c-[white] p-[32px,0] ${className}`}>
      <Container>{children}</Container>
    </footer>
  );
}
