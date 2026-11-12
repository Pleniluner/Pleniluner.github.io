type StationMarkProps = { className?: string; animated?: boolean };

export function StationMark({ className, animated = false }: StationMarkProps) {
  return <svg className={className} viewBox="0 0 190 190" fill="none" aria-hidden="true" focusable="false">
    <path className={animated ? "intro-loader__mark-path" : undefined} pathLength={animated ? 1 : undefined}
      d="M145.15 39.85A78 78 0 1 0 114.10 169.18" stroke="currentColor" strokeWidth="16" />
    <path className={animated ? "intro-loader__mark-path" : undefined} pathLength={animated ? 1 : undefined}
      d="M48.62 110.52A60 60 0 0 0 161.38 69.48" stroke="currentColor" strokeWidth="15" />
    <path className={animated ? "intro-loader__mark-accent" : undefined}
      d="M151 53L169 37" stroke="#d7eb65" strokeWidth="7" />
  </svg>;
}
