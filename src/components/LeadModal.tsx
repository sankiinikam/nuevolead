'use client';

import React, { useState, useEffect } from 'react';
import { Lead, Contact, Address, LeadProduct, Task } from '@/types';
import {
  X,
  Plus,
  Trash2,
  Building2,
  DollarSign,
  Users,
  MapPin,
  ShoppingBag,
  FileText,
  UserCheck,
  CheckSquare,
  Sparkles,
  Info,
  AlertTriangle
} from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit: Lead | null;
  onSave: (leadData: any) => Promise<void>;
}

const INDUSTRIES = [
  'Manufacturing',
  'IT & Software',
  'Automotive & Engineering',
  'Electronics & Semiconductors',
  'Construction & Real Estate',
  'Pharmaceutical & Healthcare',
  'Textiles & Apparel',
  'Trading & Distribution',
  'Energy & Renewable',
  'Other',
];

const SOURCES = [
  'Direct Visit',
  'Cold Call',
  'Website / Inbound',
  'Exhibition & Trade Fair',
  'Client Referral',
  'LinkedIn & Social Media',
  'Channel Partner',
];

const VISIT_TYPES = ['Direct Visit', 'Phone Call', 'Virtual Meeting / Demo', 'Email Campaign', 'Referral'];

const STATUSES: { value: Lead['status']; label: string; desc: string }[] = [
  { value: 'Hot', label: 'Hot Deal', desc: 'Decision imminent (>70% probability)' },
  { value: 'Warm', label: 'Warm Prospect', desc: 'Active discussions, requirements verified' },
  { value: 'Cold', label: 'Cold Lead', desc: 'Initial contact, early stage qualification' },
  { value: 'Future-Prospect', label: 'Future Prospect', desc: 'Interested for upcoming quarters' },
  { value: 'Close-Won', label: 'Close-Won', desc: 'Purchase Order signed & closed' },
  { value: 'Close-Lost', label: 'Close-Lost', desc: 'Deal lost to competitor or cancelled' },
];

export default function LeadModal({
  isOpen,
  onClose,
  leadToEdit,
  onSave,
}: LeadModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'status' | 'contacts' | 'addresses' | 'products' | 'discussion' | 'remarks' | 'tasks'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [leadNumber, setLeadNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [industry, setIndustry] = useState('Manufacturing');
  const [source, setSource] = useState('Direct Visit');
  const [visitDate, setVisitDate] = useState('');
  const [visitType, setVisitType] = useState('Direct Visit');
  const [enteredBy, setEnteredBy] = useState('Sanket');
  const [assignedToId, setAssignedToId] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => setTeamMembers(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const [status, setStatus] = useState<Lead['status']>('Hot');
  const [dealValue, setDealValue] = useState<number>(0);
  const [probability, setProbability] = useState<number>(75);
  const [expectedClosingDate, setExpectedClosingDate] = useState('');
  const [orderValue, setOrderValue] = useState<number>(0);

  // Primary contact summary fields
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryDesignation, setPrimaryDesignation] = useState('');
  const [primaryMobile, setPrimaryMobile] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [primaryCity, setPrimaryCity] = useState('');
  const [primaryState, setPrimaryState] = useState('');

  // Detailed relations
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [products, setProducts] = useState<LeadProduct[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Remarks & summaries
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [requirements, setRequirements] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [managerRemarks, setManagerRemarks] = useState('');

  // Reset or populate on open
  useEffect(() => {
    if (leadToEdit) {
      setLeadNumber(leadToEdit.leadNumber || '');
      setCustomerName(leadToEdit.customerName || '');
      setIndustry(leadToEdit.industry || 'Manufacturing');
      setSource(leadToEdit.source || 'Direct Visit');
      setVisitDate(leadToEdit.visitDate ? leadToEdit.visitDate.split('T')[0] : '');
      setVisitType(leadToEdit.visitType || 'Direct Visit');
      setEnteredBy(leadToEdit.enteredBy || 'Sanket');
      setAssignedToId(leadToEdit.assignedToId || leadToEdit.assignedTo?.id || '');

      setStatus(leadToEdit.status || 'Hot');
      setDealValue(leadToEdit.dealValue || 0);
      setProbability(leadToEdit.probability || 50);
      setExpectedClosingDate(leadToEdit.expectedClosingDate ? leadToEdit.expectedClosingDate.split('T')[0] : '');
      setOrderValue(leadToEdit.orderValue || 0);

      setPrimaryContactName(leadToEdit.contactName || '');
      setPrimaryDesignation(leadToEdit.designation || '');
      setPrimaryMobile(leadToEdit.mobile || '');
      setPrimaryEmail(leadToEdit.email || '');
      setPrimaryCity(leadToEdit.city || '');
      setPrimaryState(leadToEdit.state || '');

      setContacts(leadToEdit.contacts?.length ? leadToEdit.contacts : []);
      setAddresses(leadToEdit.addresses?.length ? leadToEdit.addresses : []);
      setProducts(leadToEdit.products?.length ? leadToEdit.products : []);
      setTasks(leadToEdit.tasks?.length ? leadToEdit.tasks : []);

      setDiscussionSummary(leadToEdit.discussionSummary || '');
      setRequirements(leadToEdit.requirements || '');
      setNextStep(leadToEdit.nextStep || '');
      setNextFollowUpDate(leadToEdit.nextFollowUpDate ? leadToEdit.nextFollowUpDate.split('T')[0] : '');
      setManagerRemarks(leadToEdit.managerRemarks || '');
    } else {
      // Defaults for brand new lead
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().split('T')[0];
      setLeadNumber(`LD-2026-${randomSuffix}`);
      setCustomerName('');
      setIndustry('Manufacturing');
      setSource('Direct Visit');
      setVisitDate(today);
      setVisitType('Direct Visit');
      setEnteredBy('Sanket');
      setAssignedToId('');

      setStatus('Hot');
      setDealValue(0);
      setProbability(75);
      setExpectedClosingDate('');
      setOrderValue(0);

      setPrimaryContactName('');
      setPrimaryDesignation('');
      setPrimaryMobile('');
      setPrimaryEmail('');
      setPrimaryCity('');
      setPrimaryState('');

      setContacts([
        {
          title: 'Mr.',
          name: '',
          designation: 'Managing Director',
          department: 'Executive Management',
          mobile: '',
          email: '',
        },
      ]);
      setAddresses([
        {
          type: 'Headquarters',
          address1: '',
          city: '',
          state: 'Maharashtra',
          country: 'India',
        },
      ]);
      setProducts([]);
      setTasks([]);

      setDiscussionSummary('');
      setRequirements('');
      setNextStep('');
      setNextFollowUpDate('');
      setManagerRemarks('');
    }
    setActiveTab('info');
    setErrorMessage('');
  }, [leadToEdit, isOpen]);

  // Calculate live product total
  const productTotal = products.reduce(
    (acc, p) => acc + (Number(p.offeredPrice || 0) * Number(p.unitQuantity || 0)),
    0
  );

  // When status is set to Close-Won, sync orderValue to productTotal (Page 22 PDF rule)
  useEffect(() => {
    if (status === 'Close-Won') {
      if (productTotal > 0) {
        setOrderValue(productTotal);
      } else if (dealValue > 0) {
        setOrderValue(dealValue);
      }
    }
  }, [status, productTotal, dealValue]);

  if (!isOpen) return null;

  // Add Contact row
  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        title: 'Mr.',
        name: '',
        designation: '',
        department: '',
        mobile: '',
        email: '',
      },
    ]);
  };

  const handleUpdateContact = (index: number, field: keyof Contact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
    // Sync primary contact with first row
    if (index === 0) {
      if (field === 'name') setPrimaryContactName(value);
      if (field === 'designation') setPrimaryDesignation(value);
      if (field === 'mobile') setPrimaryMobile(value);
      if (field === 'email') setPrimaryEmail(value);
    }
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  // Add Address row
  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        type: 'Branch Office',
        address1: '',
        city: '',
        state: '',
        country: 'India',
      },
    ]);
  };

  const handleUpdateAddress = (index: number, field: keyof Address, value: string) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
    if (index === 0) {
      if (field === 'city') setPrimaryCity(value);
      if (field === 'state') setPrimaryState(value);
    }
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  // Add Product item
  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        productName: '',
        category: 'Hardware / Machinery',
        mrp: 0,
        offeredPrice: 0,
        unitQuantity: 1,
        totalAmount: 0,
      },
    ]);
  };

  const handleUpdateProduct = (index: number, field: keyof LeadProduct, value: any) => {
    const updated = [...products];
    const curr = { ...updated[index], [field]: value };
    // Auto recalculate line item total
    const price = field === 'offeredPrice' ? Number(value) : curr.offeredPrice;
    const qty = field === 'unitQuantity' ? Number(value) : curr.unitQuantity;
    curr.totalAmount = (Number(price) || 0) * (Number(qty) || 0);

    updated[index] = curr;
    setProducts(updated);

    // If dealValue is currently 0, automatically update it with total
    const newTotal = updated.reduce((acc, p) => acc + (Number(p.offeredPrice || 0) * Number(p.unitQuantity || 0)), 0);
    if (dealValue === 0 || dealValue === productTotal) {
      setDealValue(newTotal);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Add Task
  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        isCompleted: false,
        dueDate: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const handleUpdateTask = (index: number, field: keyof Task, value: any) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setActiveTab('info');
      setErrorMessage('Company / Customer Name is strictly required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const payload = {
        id: leadToEdit?.id,
        leadNumber: leadNumber || `LD-${Date.now().toString().slice(-6)}`,
        customerName: customerName.trim(),
        industry,
        source,
        visitDate,
        visitType,
        enteredBy,
        assignedToId: assignedToId || undefined,
        status,
        dealValue: Number(dealValue) || 0,
        probability: Number(probability) || 0,
        expectedClosingDate: expectedClosingDate || undefined,
        orderValue: Number(orderValue) || 0,

        contactName: primaryContactName || contacts[0]?.name || '',
        designation: primaryDesignation || contacts[0]?.designation || '',
        mobile: primaryMobile || contacts[0]?.mobile || '',
        email: primaryEmail || contacts[0]?.email || '',
        city: primaryCity || addresses[0]?.city || '',
        state: primaryState || addresses[0]?.state || '',

        discussionSummary,
        requirements,
        nextStep,
        nextFollowUpDate: nextFollowUpDate || undefined,
        managerRemarks,

        contacts,
        addresses,
        products,
        tasks,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save lead record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {leadToEdit ? `Edit Lead: ${leadToEdit.customerName}` : 'Create New Opportunity / Lead'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {leadToEdit ? `System ID: ${leadToEdit.leadNumber}` : 'Record complete prospect profile, decision makers, and products quoted'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto bg-white dark:bg-slate-900 scrollbar-none py-2">
          {[
            { id: 'info', label: '1. Basic Info', icon: Building2 },
            { id: 'status', label: '2. Stage & Deal', icon: DollarSign },
            { id: 'contacts', label: `3. Contacts (${contacts.length})`, icon: Users },
            { id: 'addresses', label: `4. Addresses (${addresses.length})`, icon: MapPin },
            { id: 'products', label: `5. Products (${products.length})`, icon: ShoppingBag },
            { id: 'discussion', label: '6. Requirements', icon: FileText },
            { id: 'remarks', label: '7. Manager Remarks', icon: UserCheck },
            { id: 'tasks', label: `8. Checklist (${tasks.length})`, icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body / Tab Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Number / Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leadNumber}
                    onChange={(e) => setLeadNumber(e.target.value)}
                    placeholder="e.g. LD-2026-1049"
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer / Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. SRM Auto Components Ltd"
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Segment
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Visit / Entry Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Visit / Interaction Type
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {VISIT_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Entered By (Sales Representative) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={enteredBy}
                    onChange={(e) => setEnteredBy(e.target.value)}
                    placeholder="e.g. Sanket / Sales Exec"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Account Executive
                  </label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role === 'ADMIN' ? 'Admin' : m.role === 'MANAGER' ? 'Manager' : 'Rep'}) — {m.designation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                <p>
                  Tip: Multi-contact decision makers and line items are supported in Tabs 3 and 5. When this lead is closed as <strong>Close-Won</strong>, the order value will automatically link to the total quoted line items as specified in the manual.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: STAGE & VALUATION */}
          {activeTab === 'status' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pipeline Stage / Lead Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {STATUSES.map((st) => (
                    <div
                      key={st.value}
                      onClick={() => setStatus(st.value)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all ${
                        status === st.value
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {st.label}
                        </span>
                        {status === st.value && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {st.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quoted Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {productTotal > 0 && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 block">
                      Sum of quoted products: ₹{productTotal.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Closing Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Closing Date
                  </label>
                  <input
                    type="date"
                    value={expectedClosingDate}
                    onChange={(e) => setExpectedClosingDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Close-Won Special Section */}
              {status === 'Close-Won' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Deal Won: Order Confirmation Rule (PDF Page 22)
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-3">
                    As defined in standard enterprise lead closing protocol, final Order Value is locked to product deliverables.
                  </p>
                  <div className="max-w-xs">
                    <label className="block text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
                      Final Locked Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={orderValue}
                      onChange={(e) => setOrderValue(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACTS & DECISION MAKERS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Decision Makers & Key Personnel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add MDs, Purchase Managers, and technical evaluators for this account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Decision Maker
                </button>
              </div>

              <div className="space-y-3">
                {contacts.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Contact #{idx + 1} {idx === 0 && <span className="text-indigo-600 font-bold">(Primary Point of Contact)</span>}
                      </span>
                      {contacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Title</label>
                        <select
                          value={c.title || 'Mr.'}
                          onChange={(e) => handleUpdateContact(idx, 'title', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Prof.">Prof.</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => handleUpdateContact(idx, 'name', e.target.value)}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Designation</label>
                        <input
                          type="text"
                          value={c.designation || ''}
                          onChange={(e) => handleUpdateContact(idx, 'designation', e.target.value)}
                          placeholder="e.g. VP Procurement"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Mobile / Phone</label>
                        <input
                          type="text"
                          value={c.mobile || ''}
                          onChange={(e) => handleUpdateContact(idx, 'mobile', e.target.value)}
                          placeholder="9876543210"
                          className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Email</label>
                        <input
                          type="email"
                          value={c.email || ''}
                          onChange={(e) => handleUpdateContact(idx, 'email', e.target.value)}
                          placeholder="r.sharma@corp.com"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Physical & Registered Locations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add corporate headquarters, factories, or warehouse shipping addresses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Address Location #{idx + 1}
                      </span>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Type</label>
                        <select
                          value={a.type}
                          onChange={(e) => handleUpdateAddress(idx, 'type', e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="Headquarters">Headquarters</option>
                          <option value="Plant / Factory">Plant / Factory</option>
                          <option value="Billing Address">Billing Address</option>
                          <option value="Branch Office">Branch Office</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Street / Industrial Area</label>
                        <input
                          type="text"
                          value={a.address1}
                          onChange={(e) => handleUpdateAddress(idx, 'address1', e.target.value)}
                          placeholder="Plot 42, MIDC Phase II"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">City</label>
                        <input
                          type="text"
                          value={a.city}
                          onChange={(e) => handleUpdateAddress(idx, 'city', e.target.value)}
                          placeholder="e.g. Pune"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">State</label>
                        <input
                          type="text"
                          value={a.state}
                          onChange={(e) => handleUpdateAddress(idx, 'state', e.target.value)}
                          placeholder="e.g. Maharashtra"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={a.pin || ''}
                          onChange={(e) => handleUpdateAddress(idx, 'pin', e.target.value)}
                          placeholder="411018"
                          className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS QUOTED */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Product Line Items & Proposed Quotation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Itemized pricing per Page 14 of User Manual
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Line Item
                </button>
              </div>

              {products.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500">No products added yet. Click &quot;Add Line Item&quot; to build quotation.</p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="py-2.5 px-3">Product Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 w-28">MRP (₹)</th>
                        <th className="py-2.5 px-3 w-28">Offered (₹)</th>
                        <th className="py-2.5 px-3 w-20">Qty</th>
                        <th className="py-2.5 px-3 w-32">Total (₹)</th>
                        <th className="py-2.5 px-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2">
                            <input
                              type="text"
                              value={p.productName}
                              onChange={(e) => handleUpdateProduct(idx, 'productName', e.target.value)}
                              placeholder="e.g. CNC Spindle System"
                              className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={p.category || ''}
                              onChange={(e) => handleUpdateProduct(idx, 'category', e.target.value)}
                              placeholder="Machinery"
                              className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={p.mrp}
                              onChange={(e) => handleUpdateProduct(idx, 'mrp', Number(e.target.value))}
                              className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={p.offeredPrice}
                              onChange={(e) => handleUpdateProduct(idx, 'offeredPrice', Number(e.target.value))}
                              className="w-full text-xs font-semibold px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={p.unitQuantity}
                              onChange={(e) => handleUpdateProduct(idx, 'unitQuantity', Number(e.target.value))}
                              className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="p-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                            ₹{(Number(p.offeredPrice || 0) * Number(p.unitQuantity || 0)).toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary row */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Total Product Valuation ({products.length} line items):
                    </span>
                    <span className="font-bold text-base text-indigo-600 dark:text-indigo-400 font-mono">
                      ₹{productTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: REQUIREMENTS & DISCUSSION */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client Technical & Business Requirements
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Detail scope of work, technical specifications, quantity requirements, delivery timelines..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interaction Summary / Minutes of Meeting
                </label>
                <textarea
                  rows={3}
                  value={discussionSummary}
                  onChange={(e) => setDiscussionSummary(e.target.value)}
                  placeholder="Points discussed with stakeholders, objections addressed, client sentiment..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Next Action Item / Deliverable
                  </label>
                  <input
                    type="text"
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    placeholder="e.g. Submit revised formal techno-commercial proposal"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Next Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MANAGER REMARKS */}
          {activeTab === 'remarks' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2 text-purple-900 dark:text-purple-300 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  Reporting Manager Review Field (PDF Page 17)
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-400 mb-3">
                  This field is reserved for sales directors, regional heads, or team managers to document guidance, pricing approvals, and strategic feedback.
                </p>
                <textarea
                  rows={5}
                  value={managerRemarks}
                  onChange={(e) => setManagerRemarks(e.target.value)}
                  placeholder="Manager observations, margin approval thresholds, escalation notes, leadership feedback..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 8: TASK CHECKLIST */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Lead Milestone Checklist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track actionable deliverables required to close this prospect
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <CheckSquare className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500">No tasks defined. Click &quot;Add Task&quot; to schedule deliverables.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                    >
                      <input
                        type="checkbox"
                        checked={t.isCompleted}
                        onChange={(e) => handleUpdateTask(idx, 'isCompleted', e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={t.title}
                        onChange={(e) => handleUpdateTask(idx, 'title', e.target.value)}
                        placeholder="Task title (e.g. Request credit approval)"
                        className={`flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white ${
                          t.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      />
                      <input
                        type="date"
                        value={t.dueDate ? t.dueDate.split('T')[0] : ''}
                        onChange={(e) => handleUpdateTask(idx, 'dueDate', e.target.value)}
                        className="text-xs px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Saving Record...</>
                ) : (
                  <>{leadToEdit ? 'Update Opportunity' : 'Create Opportunity'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
