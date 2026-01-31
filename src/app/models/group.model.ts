import { Student } from './student.model';

export interface Group {
  id?: number;
  groupName: string;
  collegeName: string;
  department: string;
  academicYear: string;
  semester: string;
  totalStudents: number;
  internshipType: InternshipType;
  preferredMode: InternshipMode;
  durationMonths: number;
  startDate: string;
  endDate: string;
  facultyName: string;
  facultyEmail: string;
  facultyPhone: string;
  leader?: Student;
  members?: GroupMember[];
  status: GroupStatus;
  company?: Company;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  website?: string;
  industry?: string;
  description?: string;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
}

export interface GroupMember {
  id?: number;
  group?: Group;
  student?: Student;
  studentName: string;
  githubLink?: string;
  status: MemberStatus;
}

export interface GroupInvitation {
  id?: number;
  group?: Group;
  invitedEmail: string;
  invitationToken: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
}

export enum InternshipType {
  TECHNICAL = 'TECHNICAL',
  NON_TECHNICAL = 'NON_TECHNICAL'
}

export enum InternshipMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  HYBRID = 'HYBRID'
}

export enum GroupStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  APPLIED = 'APPLIED',
  SELECTED = 'SELECTED'
}

export enum Availability {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME'
}

export enum MemberStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SELECTED = 'SELECTED'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}