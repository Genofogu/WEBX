export interface Student {
  id: number;
  name: string;
  college: string;
  year: string;
  skills: string;
  bio: string;
  contact: string;
}

export interface Listing {
  id: number;
  org_name: string;
  role: string;
  duration: string;
  stipend: string;
  skills_required: string;
  contact: string;
  posted_at: string;
  deadline: string;
}

export interface Application {
  id: number;
  listing_id: number;
  student_id: number;
  status: 'Pending' | 'Shortlisted' | 'Rejected';
  note: string;
  applied_at: string;
  student_name?: string;
  student_skills?: string;
  role?: string;
  org_name?: string;
  skills_required?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalListings: number;
  totalStudents: number;
  totalApplications: number;
  shortlistedCount: number;
  mostAppliedListing: {
    role: string;
    org_name: string;
    app_count: number;
  } | null;
  skillDistribution: {
    skill: string;
    count: number;
  }[];
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  logo: string;
  contact: string;
  website: string;
}
