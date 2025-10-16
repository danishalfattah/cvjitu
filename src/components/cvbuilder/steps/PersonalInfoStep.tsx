import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { CVBuilderData } from "../types";
import { t, type Language } from "@/lib/translations";

interface PersonalInfoStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
  lang: Language;
}

export function PersonalInfoStep({
  data,
  onUpdate,
  lang,
}: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            {t("firstNameLabel", lang)} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder={t("firstNamePlaceholder", lang)}
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            {t("lastNameLabel", lang)} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder={t("lastNamePlaceholder", lang)}
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t("emailLabel", lang)} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder", lang)}
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t("phoneLabel", lang)}
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder", lang)}
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          {t("locationLabel", lang)}
        </Label>
        <Input
          id="location"
          type="text"
          placeholder={t("locationPlaceholder", lang)}
          value={data.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-sm font-medium">
            {t("linkedinLabel", lang)}
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder={t("linkedinPlaceholder", lang)}
            value={data.linkedin}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium">
            {t("websiteLabel", lang)}
          </Label>
          <Input
            id="website"
            type="url"
            placeholder={t("websitePlaceholder", lang)}
            value={data.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
