interface RadialScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RadialScore({
  score,
  size = "md",
  showLabel = true,
}: RadialScoreProps) {
  const sizeMap = {
    sm: { width: 60, height: 60, strokeWidth: 4, fontSize: "text-sm" },
    md: { width: 80, height: 80, strokeWidth: 6, fontSize: "text-base" },
    lg: { width: 120, height: 120, strokeWidth: 8, fontSize: "text-xl" },
  };

  const { width, height, strokeWidth, fontSize } = sizeMap[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warn)";
    return "var(--error)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Sangat Baik";
    if (score >= 60) return "Baik";
    if (score >= 40) return "Cukup";
    return "Poor";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width={width} height={height} className="transform -rotate-90">
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-semibold text-[var(--neutral-ink)] ${fontSize}`}
          >
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium">
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}
