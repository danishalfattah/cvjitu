// components/dashboard/CVFilters.tsx

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

interface CVFiltersProps {
  filters: {
    status: string;
    year: string;
    scoreRange: number[];
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  hideStatusFilter?: boolean; // New prop to control status filter visibility
}

const years = ["Semua Tahun", "2022", "2023", "2024", "2025", "2026"];

export function CVFilters({
  filters,
  onFiltersChange,
  onReset,
  hideStatusFilter = false, // Default to false
}: CVFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const activeFiltersCount = [
    !hideStatusFilter && filters.status !== "Semua Status",
    filters.year !== "Semua Tahun",
    filters.scoreRange[0] !== 1 || filters.scoreRange[1] !== 100,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Mobile: Stacked Layout */}
      <div className="block sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {!hideStatusFilter && (
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue>
                  {filters.status === "Semua Status"
                    ? "Status"
                    : filters.status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Status">Semua Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select
            value={filters.year}
            onValueChange={(value) => updateFilter("year", value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue>
                {filters.year === "Semua Tahun" ? "Tahun" : filters.year}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-3">
          <span className="text-sm text-gray-600">
            Skor: {filters.scoreRange[0]} - {filters.scoreRange[1]}
          </span>
          <div className="pt-2">
            <Slider
              value={filters.scoreRange}
              onValueChange={(value) => updateFilter("scoreRange", value)}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onReset}
            size="sm"
            className="w-full text-gray-600 hover:text-[var(--red-normal)]"
          >
            Reset ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden sm:flex sm:flex-wrap gap-3 items-center">
        {!hideStatusFilter && (
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                {filters.status === "Semua Status" ? "Status" : filters.status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.year}
          onValueChange={(value) => updateFilter("year", value)}
        >
          <SelectTrigger className="w-28">
            <SelectValue>
              {filters.year === "Semua Tahun" ? "Tahun" : filters.year}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2 min-w-64">
          <span className="text-sm text-gray-600 ">Skor:</span>
          <div className="flex-1 ">
            <Slider
              value={filters.scoreRange}
              onValueChange={(value) => updateFilter("scoreRange", value)}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{filters.scoreRange[0]}</span>
              <span>{filters.scoreRange[1]}</span>
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onReset}
            size="sm"
            className="text-gray-600 hover:text-[var(--red-normal)]"
          >
            Reset ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
}
