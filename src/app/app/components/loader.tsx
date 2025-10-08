export const Loader = ({ className }: React.SVGProps<SVGSVGElement>) => {
  // Unique orbiting-dots loader using pure SVG animations (no CSS keyframes required)
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </radialGradient>
      </defs>

      {/* soft glow background */}
      <circle cx="60" cy="60" r="36" fill="url(#glow)" opacity="0.25" />

      {/* core */}
      <circle cx="60" cy="60" r="16" fill="currentColor" opacity="0.85" />

      {/* orbit path (subtle) */}
      <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeOpacity="0.15" />

      {/* orbiting dots */}
      <g>
        <circle r="4" fill="currentColor">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M60,28 A32,32 0 1,1 59.999,28" />
        </circle>
        <circle r="3.5" fill="currentColor" opacity="0.8">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin="-0.8s" path="M60,28 A32,32 0 1,1 59.999,28" />
        </circle>
        <circle r="3" fill="currentColor" opacity="0.65">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin="-1.6s" path="M60,28 A32,32 0 1,1 59.999,28" />
        </circle>
      </g>

      {/* pulse */}
      <circle cx="60" cy="60" r="16" fill="currentColor" opacity="0.1">
        <animate attributeName="r" values="16;26;16" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export const GlobalLoader = ({ className = "w-16 h-16 text-[color:var(--accent-secondary)]" }: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className={className} />
    </div>
  );
};
