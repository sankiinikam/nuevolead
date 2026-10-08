'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Building2,
  Users,
  MapPin,
  ShoppingBag,
  Clock,
  Sparkles,
  FileSpreadsheet,
  ChevronRight,
  Award
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDE_SECTIONS = [
  {
    id: 'overview',
    title: '1. Executive Overview & Lifecycle',
    icon: Award,
    content: (
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Nuevo Lead CRM Platform (V1.0)
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Nuevo Lead CRM is an enterprise-grade Lead & Sales Pipeline Engine engineered to streamline corporate lead acquisition, multi-stakeholder tracking, line-item quoting, and seamless conversion into closed revenue.
        </p>
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300 space-y-2">
          <p className="font-semibold">The 6 Lifecycle Stages in Nuevo Lead:</p>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li><strong>Cold:</strong> Newly captured lead; early qualification underway.</li>
            <li><strong>Warm:</strong> Active commercial engagement, client interest confirmed.</li>
            <li><strong>Hot:</strong> High-probability opportunity (&gt;70%), decision imminent.</li>
            <li><strong>Future-Prospect:</strong> Client expressed interest deferred to upcoming fiscal quarter.</li>
            <li><strong>Close-Won:</strong> Purchase order issued; order value locked to quoted line items.</li>
            <li><strong>Close-Lost:</strong> Opportunity abandoned or lost to alternative vendor.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'add-lead',
    title: '2. Creating a Lead (User Guide P.7–11)',
    icon: Building2,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Lead Entry & Account Profile
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          To register a prospective client into Nuevo Lead, click <strong>&quot;+ New Lead&quot;</strong> in the top navigation bar. Every opportunity contains foundational tracking parameters:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Lead Number / Code:</span>
            <p className="text-slate-500 mt-1">Unique alphanumeric identifier (e.g. LD-2026-1049) auto-generated or manually keyed.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Customer Name:</span>
            <p className="text-slate-500 mt-1">Full registered company name of the client organization.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Visit / Entry Date:</span>
            <p className="text-slate-500 mt-1">Date when initial interaction took place.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Entered By:</span>
            <p className="text-slate-500 mt-1">Sales executive or account manager responsible for the pipeline.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'decision-makers',
    title: '3. Multi-Decision Makers (P.12–13)',
    icon: Users,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Recording Multiple Corporate Contacts
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          B2B transactions involve multiple stakeholders (Managing Directors, VP Procurement, Factory Engineers). As specified in Page 12 of the user manual:
        </p>
        <ul className="text-xs space-y-2 list-disc pl-4 text-slate-600 dark:text-slate-300">
          <li>Navigate to <strong>Tab 3: Contacts</strong> inside the Lead Modal.</li>
          <li>Click <strong>&quot;Add Decision Maker&quot;</strong> to attach unlimited points of contact.</li>
          <li>Capture Salutation (Mr./Ms./Dr.), Full Name, Designation, Department, Phone, Mobile, and Email.</li>
          <li>The first contact row automatically serves as the primary account contact for quick dialing and table views.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'addresses',
    title: '4. Physical Locations (P.13)',
    icon: MapPin,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Headquarters, Plant, & Billing Locations
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Enter corporate premises in <strong>Tab 4: Addresses</strong>. Each lead can contain multiple facility addresses:
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <p>• <strong>Headquarters:</strong> Corporate administrative office.</p>
          <p>• <strong>Plant / Factory:</strong> Industrial fabrication plant or delivery site.</p>
          <p>• <strong>Billing Address:</strong> Registered GST address for official accounting.</p>
          <p>• <strong>Branch Office:</strong> Regional subsidiary branches.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'products',
    title: '5. Line Items Quoting (P.14)',
    icon: ShoppingBag,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Interactive Product Line Items & Auto Totals
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          In <strong>Tab 5: Products</strong>, you can configure itemized quotes:
        </p>
        <ul className="text-xs space-y-2 list-disc pl-4 text-slate-600 dark:text-slate-300">
          <li>Specify Product Description, Category, MRP, Offered Price, and Unit Quantity.</li>
          <li>Nuevo Lead instantly computes the line-item total (`Offered Price × Quantity`).</li>
          <li>The total quotation sum is calculated in real time and synced with the Quoted Deal Value.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'close-won',
    title: '6. Close-Won Protocol (P.22)',
    icon: Sparkles,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Critical Closing Rule: Locked Order Value
        </h4>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mandatory User Guide Rule (Page 22):
          </p>
          <p className="leading-relaxed">
            When a sales lead reaches signed purchase agreement, change the status to <strong>&quot;Close-Won&quot;</strong>. 
            The system automatically locks the <strong>Order Value</strong> to match the sum of all quoted product line items.
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            This prevents discrepancies between quoted line items and recognized booking revenue in executive dashboards.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'followups',
    title: '7. Follow-Up Logging & SMS Alerts (P.15–16)',
    icon: Clock,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Interaction Audits & Chronological Timeline
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Click the message icon on any lead in the Table or Kanban to open the Follow-Up dialog:
        </p>
        <ul className="text-xs space-y-2 list-disc pl-4 text-slate-600 dark:text-slate-300">
          <li>Record interaction channel (Phone Call, Direct In-Person Visit, Virtual Demo, Email).</li>
          <li>Update lead stage directly from the follow-up.</li>
          <li>Schedule next follow-up date with optional SMS & Email notification alert.</li>
          <li>View the complete chronological timeline of past meetings and discussion summaries.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'export',
    title: '8. Dual-Box Field Data Export (P.24–26)',
    icon: FileSpreadsheet,
    content: (
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Dual-Box Field Selector for Excel / CSV Reports
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Nuevo Lead features the exact dual-box selector described in Section 4 of the manual:
        </p>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <p>1. Click <strong>&quot;Export Data&quot;</strong> in the top header.</p>
          <p>2. Choose whether to export All Leads or filter by Stage (e.g. Hot Deals Only).</p>
          <p>3. Move fields between <strong>Available Fields</strong> and <strong>Selected to Export</strong> using `&gt;`, `&lt;`, `&gt;&gt;`, or `&lt;&lt;`.</p>
          <p>4. Click <strong>&quot;Download Export (.CSV)&quot;</strong> for instant spreadsheet download.</p>
        </div>
      </div>
    ),
  },
];

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const [activeSectionId, setActiveSectionId] = useState('overview');

  if (!isOpen) return null;

  const currentSection = GUIDE_SECTIONS.find(s => s.id === activeSectionId) || GUIDE_SECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Nuevo Lead CRM — Standard Operating Manual
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official guide to lead capture, quoting, closing rules, and reports
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

        {/* Body Layout: Sidebar navigation left, Content right */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* Sidebar */}
          <div className="md:col-span-4 p-3 bg-slate-50/50 dark:bg-slate-800/30 overflow-y-auto space-y-1">
            {GUIDE_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 p-6 overflow-y-auto">
            {currentSection.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 text-xs">
          <span className="text-slate-500">Nuevo Lead CRM V1.0 Enterprise Guide</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
