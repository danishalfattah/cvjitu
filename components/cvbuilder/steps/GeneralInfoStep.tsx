import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CVBuilderData } from "../types";

interface GeneralInfoStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
}

export function GeneralInfoStep({ data, onUpdate }: GeneralInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-sm font-medium">
          Job Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="jobTitle"
          type="text"
          placeholder="e.g. Software Engineer"
          value={data.jobTitle}
          onChange={(e) => onUpdate({ jobTitle: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
        />
        <p className="text-xs text-gray-500">Job Title is required</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Brief description of your CV"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors min-h-[120px] resize-none"
          rows={5}
        />
        <p className="text-xs text-gray-500">
          Description of the job or position you are applying for
        </p>
      </div>
    </div>
  );
}
