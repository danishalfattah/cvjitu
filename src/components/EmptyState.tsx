import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    // Jadikan action sebagai objek opsional
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed border-[var(--border-color)]">
      <h3 className="text-lg font-poppins font-semibold text-[var(--neutral-ink)]">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mt-2 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
