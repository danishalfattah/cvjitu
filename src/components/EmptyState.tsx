import { Button } from "./ui/button";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-24 h-24 bg-[var(--red-light)] rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-[var(--red-normal)]" />
      </div>
      <h3 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
