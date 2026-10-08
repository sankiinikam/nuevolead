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
