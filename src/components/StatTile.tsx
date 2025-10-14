import { Card, CardContent } from "./ui/card";

interface StatTileProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    value: string;
    type: "increase" | "decrease" | "warning" | "neutral";
  };
}

export function StatTile({ title, value, icon: Icon, change }: StatTileProps) {
  const getChangeColor = (
    type: "increase" | "decrease" | "warning" | "neutral"
  ) => {
    switch (type) {
      case "increase":
        return "text-[var(--success)]"; // Hijau
      case "warning":
        return "text-[var(--warn)]"; // Kuning/Oranye
      case "decrease":
        return "text-[var(--error)]"; // Merah
      case "neutral": // <-- Tambahan di sini
        return "text-gray-500"; // Abu-abu untuk netral
      default:
        return "";
    }
  };

  return (
    <Card className="border border-[var(--border-color)] hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--neutral-ink)] mb-1">
              {value}
            </p>
            {change && (
              <p
                className={`text-xs sm:text-sm ${getChangeColor(change.type)}`}
              >
                {/* Menghilangkan ikon panah untuk tipe 'warning' */}
                {change.type === "increase" && "↗ "}
                {change.type === "decrease" && "↘ "}
                {change.value}
              </p>
            )}
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--red-light)] rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--red-normal)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
