interface ShakibaLogoProps {
  className?: string;
  size?: number;
  decorative?: boolean;
}

/**
 * Minimalist personal monogram for Shakiba Mashini.
 * Combines an architectural "S" spline and geometric "M" peaks anchored by
 * three graph-topology vertices referencing Applied Mathematics & Graph ML.
 */
export function ShakibaLogo({
  className = '',
  size = 34,
  decorative = true,
}: ShakibaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Shakiba Mashini monogram'}
    >
      {/* Architectural outer frame */}
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="8"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />
      {/* Refined S-curve flowing across left axis */}
      <path
        d="M17.5 13.5C13.8 13.5 11.5 15.4 11.5 18C11.5 20.8 14 21.6 16.8 22.3C19.6 23 21.5 24 21.5 26.8C21.5 29.6 19.1 31.5 15.2 31.5C13.3 31.5 11.8 30.9 10.8 30"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Precision M graph-bridge peaks on right axis */}
      <path
        d="M22.5 31V14L27.8 23.2L33.2 14V31"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Three subtle graph vertices anchoring the monogram */}
      <circle cx="17.5" cy="13.5" r="1.75" fill="currentColor" />
      <circle cx="27.8" cy="23.2" r="1.75" fill="currentColor" />
      <circle cx="33.2" cy="14" r="1.75" fill="currentColor" />
    </svg>
  );
}
