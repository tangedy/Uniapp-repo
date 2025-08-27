export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  grade?: number;
  createdAt: string;
}

export interface Program {
  id: string;
  universityName: string;
  programName: string;
  ouacCode: string;
  admissionAverage: number;
  lastYearCutoff: number;
  tuitionDomestic: number;
  tuitionInternational: number;
  coopAvailable: boolean;
  applicationDeadline: string;
  supplementaryRequirements: SupplementaryRequirement[];
  description: string;
  websiteUrl: string;
}

export interface SupplementaryRequirement {
  id: string;
  type: 'AIF' | 'Essay' | 'Portfolio' | 'Interview' | 'Video' | 'References';
  name: string;
  description: string;
  deadline: string;
  required: boolean;
}

export interface UserApplication {
  id: string;
  userId: string;
  programId: string;
  program: Program;
  status: 'Planning' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Waitlist';
  appliedDate?: string;
  supplementaryStatus: { [key: string]: SupplementaryStatus };
  notes: string;
  createdAt: string;
}

export interface SupplementaryStatus {
  completed: boolean;
  completedDate?: string;
  notes?: string;
}