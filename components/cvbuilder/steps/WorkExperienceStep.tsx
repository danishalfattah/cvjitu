import { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Trash2, Sparkles, Calendar } from "lucide-react";
import { CVBuilderData, WorkExperience } from "../types";

interface WorkExperienceStepProps {
  data: CVBuilderData;
  onAddExperience: () => void;
  onUpdateExperience: (id: string, updates: Partial<WorkExperience>) => void;
  onRemoveExperience: (id: string) => void;
}

export function WorkExperienceStep({
  data,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
}: WorkExperienceStepProps) {
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);

  const generateKeyAchievements = async (experienceId: string) => {
    setGeneratingAI(experienceId);

    // Simulate AI generation
    setTimeout(() => {
      const sampleAchievements = [
        "Led cross-functional team of 8 developers to deliver project 2 weeks ahead of schedule",
        "Improved application performance by 35% through code optimization and database tuning",
        "Implemented automated testing framework resulting in 50% reduction in bugs",
        "Mentored 3 junior developers and conducted technical training sessions",
        "Contributed to open-source projects with over 1000+ GitHub stars",
      ];

      const experience = data.workExperiences.find(
        (exp) => exp.id === experienceId
      );
      if (experience) {
        onUpdateExperience(experienceId, {
          achievements: [...experience.achievements, ...sampleAchievements],
        });
      }
      setGeneratingAI(null);
    }, 2000);
  };

  const addAchievement = (experienceId: string) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      onUpdateExperience(experienceId, {
        achievements: [...experience.achievements, ""],
      });
    }
  };

  const updateAchievement = (
    experienceId: string,
    index: number,
    value: string
  ) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      onUpdateExperience(experienceId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      const newAchievements = experience.achievements.filter(
        (_, i) => i !== index
      );
      onUpdateExperience(experienceId, { achievements: newAchievements });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Provide details about your work experience. This will help potential
          employers understand your professional background.
        </p>
        <Button
          onClick={onAddExperience}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.workExperiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}

      {data.workExperiences.map((experience, index) => (
        <Card
          key={experience.id}
          className="border border-[var(--border-color)]"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--red-light)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--red-normal)] font-semibold text-sm">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--neutral-ink)]">
                Experience {index + 1}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveExperience(experience.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`jobTitle-${experience.id}`}
                  className="text-sm font-medium"
                >
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`jobTitle-${experience.id}`}
                  placeholder="e.g. Software Engineer"
                  value={experience.jobTitle}
                  onChange={(e) =>
                    onUpdateExperience(experience.id, {
                      jobTitle: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                />
                <p className="text-xs text-gray-500">Job Title is required</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`company-${experience.id}`}
                  className="text-sm font-medium"
                >
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`company-${experience.id}`}
                  placeholder="Amazon"
                  value={experience.company}
                  onChange={(e) =>
                    onUpdateExperience(experience.id, {
                      company: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                />
                <p className="text-xs text-gray-500">
                  Company name is required
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`location-${experience.id}`}
                className="text-sm font-medium"
              >
                Location
              </Label>
              <Input
                id={`location-${experience.id}`}
                placeholder="San Francisco, CA"
                value={experience.location}
                onChange={(e) =>
                  onUpdateExperience(experience.id, {
                    location: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`startDate-${experience.id}`}
                  className="text-sm font-medium"
                >
                  Start Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`startDate-${experience.id}`}
                    type="month"
                    placeholder="Pick a date"
                    value={experience.startDate}
                    onChange={(e) =>
                      onUpdateExperience(experience.id, {
                        startDate: e.target.value,
                      })
                    }
                    className="pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`endDate-${experience.id}`}
                  className="text-sm font-medium"
                >
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`endDate-${experience.id}`}
                    type="month"
                    placeholder="Pick a date"
                    value={experience.endDate}
                    onChange={(e) =>
                      onUpdateExperience(experience.id, {
                        endDate: e.target.value,
                      })
                    }
                    disabled={experience.current}
                    className="pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) =>
                  onUpdateExperience(experience.id, {
                    current: checked as boolean,
                    endDate: checked ? "" : experience.endDate,
                  })
                }
              />
              <Label htmlFor={`current-${experience.id}`} className="text-sm">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`description-${experience.id}`}
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id={`description-${experience.id}`}
                placeholder="Brief description of your role"
                value={experience.description}
                onChange={(e) =>
                  onUpdateExperience(experience.id, {
                    description: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Key Achievements (Detailed Points)
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateKeyAchievements(experience.id)}
                    disabled={generatingAI === experience.id}
                    className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {generatingAI === experience.id
                      ? "Generating..."
                      : "Generate Points"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(experience.id)}
                    className="border-[var(--border-color)]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Point
                  </Button>
                </div>
              </div>

              {experience.achievements.length === 0 && (
                <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500">
                    No achievements added yet
                  </p>
                  <p className="text-xs text-gray-400">
                    Use "Generate Points" for AI suggestions or "Add Point" to
                    add manually
                  </p>
                </div>
              )}

              {experience.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex items-start space-x-2">
                  <Badge variant="outline" className="mt-3 text-xs">
                    {achIndex + 1}
                  </Badge>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Describe your achievement or responsibility"
                      value={achievement}
                      onChange={(e) =>
                        updateAchievement(
                          experience.id,
                          achIndex,
                          e.target.value
                        )
                      }
                      className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(experience.id, achIndex)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
