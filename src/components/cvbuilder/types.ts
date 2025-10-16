export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface CVBuilderData {
  // General Info
  jobTitle: string;
  description: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  
  // Work Experience
  workExperiences: WorkExperience[];
  
  // Education
  educations: Education[];
  
  // Skills
  skills: string[];
  
  // Summary
  summary: string;
}

export interface CVGrade {
  overallScore: number;
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    status: "excellent" | "good" | "average" | "needs_improvement";
  }[];
  suggestions: string[];
}