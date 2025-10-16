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
    sortBy: "newest" | "oldest"; // Tambahkan sortBy
  };
  years: string[]; // Tambahkan prop untuk tahun dinamis
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  hideStatusFilter?: boolean;
}

export function CVFilters({
  filters,
  years, // Terima prop tahun
  onFiltersChange,
  onReset,
  hideStatusFilter = false,
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
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-3 sm:p-4 mb-4 sm:mb-6">
      {/* --- UI TIDAK BERUBAH, HANYA LOGIKA DAN PENAMBAHAN KOMPONEN --- */}
      <div className="hidden sm:flex sm:flex-wrap gap-3 items-center">
        {/* Filter Urutkan (Baru) */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter("sortBy", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
          </SelectContent>
        </Select>

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
              <SelectItem value="Draf">Draf</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Filter Tahun (Dinamis) */}
        <Select
          value={filters.year}
          onValueChange={(value) => updateFilter("year", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              {filters.year === "Semua Tahun" ? "Tahun" : filters.year}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Tahun">Semua Tahun</SelectItem>
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

      {/* Mobile Layout (Juga Diperbarui) */}
      <div className="block sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>

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
                <SelectItem value="Draft">Draf</SelectItem>
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
              <SelectItem value="Semua Tahun">Semua Tahun</SelectItem>
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
    </div>
  );
}
