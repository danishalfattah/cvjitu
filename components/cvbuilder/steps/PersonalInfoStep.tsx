import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { CVBuilderData } from "../types";

interface PersonalInfoStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
}

export function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@email.com"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          type="text"
          placeholder="San Francisco, CA"
          value={data.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
        />
      </div>

      {/* LinkedIn and Website */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-sm font-medium">
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="linkedin.com/in/johndoe"
            value={data.linkedin}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium">
            Website/Portfolio
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="johndoe.com"
            value={data.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
