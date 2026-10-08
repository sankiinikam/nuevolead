export type Role = 'ADMIN' | 'MANAGER' | 'SALES_EXECUTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation?: string;
  department?: string;
  phone?: string;
  targetRevenue: number;
  reportingToId?: string;
  reportingTo?: {
    id: string;
    name: string;
    role: Role;
    designation?: string;
  } | null;
  subordinates?: User[];
  isActive: boolean;
  assignedLeads?: Lead[];
  createdAt?: string;
  stats?: {
    totalLeads: number;
    hotLeads: number;
    pipelineValue: number;
    wonRevenue: number;
  };
}

export interface Contact {
  id?: string;
  title?: string;
  name: string;
  designation?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  linkedin?: string;
}

export interface Address {
  id?: string;
  type: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pin?: string;
  country?: string;
}

export interface LeadProduct {
  id?: string;
  productName: string;
  category?: string;
  subCategory?: string;
  mrp: number;
  offeredPrice: number;
  unitQuantity: number;
  totalAmount: number;
}

export interface FollowUp {
  id?: string;
  leadId?: string;
  followUpDate: string;
  followUpTime?: string;
  followUpType: string;
  leadStatus: string;
  contactPerson?: string;
  discussionSummary: string;
  nextFollowUpDate?: string;
  nextAction?: string;
  smsAlert?: boolean;
  createdAt?: string;
  lead?: {
    id: string;
    leadNumber: string;
    customerName: string;
    status: string;
    dealValue: number;
    assignedTo?: {
      id: string;
      name: string;
    };
  };
}

export interface Task {
  id?: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  customerName: string;
  visitDate: string;
  visitType: string;
  industry?: string;
  source?: string;
  status: 'Cold' | 'Warm' | 'Hot' | 'Close-Won' | 'Close-Lost' | 'Future-Prospect';
  dealValue: number;
  probability: number;
  discussionSummary?: string;
  requirements?: string;
  nextStep?: string;
  nextFollowUpDate?: string;
  expectedClosingDate?: string;
  orderValue: number;
  managerRemarks?: string;
  enteredBy: string;

  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;

  contactName?: string;
  designation?: string;
  mobile?: string;
  email?: string;
  city?: string;
  state?: string;

  contacts: Contact[];
  addresses: Address[];
  products: LeadProduct[];
  followUps: FollowUp[];
  tasks: Task[];
}
