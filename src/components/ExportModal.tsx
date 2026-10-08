'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  FileSpreadsheet,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_FIELDS: { key: string; label: string }[] = [
  { key: 'leadNumber', label: 'Lead Number' },
  { key: 'customerName', label: 'Customer / Company Name' },
  { key: 'visitDate', label: 'Visit / Entry Date' },
  { key: 'visitType', label: 'Visit Type' },
  { key: 'status', label: 'Lead Status' },
  { key: 'dealValue', label: 'Quoted Deal Value (₹)' },
  { key: 'probability', label: 'Closing Probability (%)' },
  { key: 'orderValue', label: 'Locked Order Value (₹)' },
  { key: 'industry', label: 'Industry Segment' },
  { key: 'source', label: 'Lead Source' },
  { key: 'enteredBy', label: 'Entered By (Sales Rep)' },
  { key: 'contactName', label: 'Primary Contact Person' },
  { key: 'designation', label: 'Contact Designation' },
  { key: 'mobile', label: 'Mobile Number' },
  { key: 'email', label: 'Email Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'products', label: 'Products Quoted' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'discussionSummary', label: 'Discussion Summary' },
  { key: 'managerRemarks', label: 'Manager Remarks' },
  { key: 'nextFollowUpDate', label: 'Next Follow-Up Date' },
];

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  // Available vs Selected lists
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'leadNumber',
    'customerName',
    'visitDate',
    'status',
    'dealValue',
    'contactName',
    'mobile',
    'city',
    'enteredBy',
  ]);

  const [availableHighlighted, setAvailableHighlighted] = useState<string[]>([]);
  const [selectedHighlighted, setSelectedHighlighted] = useState<string[]>([]);

  // Filter criteria
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Unselected fields are those not in selectedFields
  const availableFields = ALL_FIELDS.filter(f => !selectedFields.includes(f.key));

  const handleMoveToSelected = () => {
    if (availableHighlighted.length === 0) return;
    setSelectedFields([...selectedFields, ...availableHighlighted]);
    setAvailableHighlighted([]);
  };

  const handleMoveToAvailable = () => {
    if (selectedHighlighted.length === 0) return;
    setSelectedFields(selectedFields.filter(k => !selectedHighlighted.includes(k)));
    setSelectedHighlighted([]);
  };

  const handleMoveAllToSelected = () => {
    setSelectedFields(ALL_FIELDS.map(f => f.key));
    setAvailableHighlighted([]);
  };

  const handleMoveAllToAvailable = () => {
    setSelectedFields([]);
    setSelectedHighlighted([]);
  };

  const toggleHighlight = (
    key: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(key)) {
      setList(list.filter(k => k !== key));
    } else {
      setList([...list, key]);
    }
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export.');
      return;
    }

    try {
      setIsExporting(true);
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: selectedFields,
          status: statusFilter,
        }),
      });

      if (!res.ok) throw new Error('Export request failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nuevo_Lead_CRM_Export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err: any) {
      alert(err.message || 'Export error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Export Lead Data to Excel / CSV
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dual-Box Field Selector (User Guide Page 24–26)
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

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Filter by Stage:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">All Stages (Full Pipeline)</option>
              <option value="Hot">Hot Deals Only</option>
              <option value="Warm">Warm Prospects Only</option>
              <option value="Cold">Cold Leads Only</option>
              <option value="Future-Prospect">Future Prospects Only</option>
              <option value="Close-Won">Closed-Won (Orders Placed)</option>
              <option value="Close-Lost">Closed-Lost</option>
            </select>
          </div>

          {/* Dual-Box Transfer List */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            
            {/* Box 1: Available Fields (5 cols) */}
            <div className="md:col-span-5 flex flex-col h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border-b border-inherit text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Available Fields ({availableFields.length})</span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-1">
                {availableFields.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-10">All fields selected</p>
                ) : (
                  availableFields.map((f) => {
                    const isSelected = availableHighlighted.includes(f.key);
                    return (
                      <div
                        key={f.key}
                        onClick={() => toggleHighlight(f.key, availableHighlighted, setAvailableHighlighted)}
                        className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {f.label}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Middle Controls (1 col) */}
            <div className="md:col-span-1 flex md:flex-col justify-center items-center gap-2 py-2">
              <button
                type="button"
                onClick={handleMoveToSelected}
                disabled={availableHighlighted.length === 0}
                title="Add selected field"
                className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMoveToAvailable}
                disabled={selectedHighlighted.length === 0}
                title="Remove selected field"
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMoveAllToSelected}
                title="Add all fields"
                className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMoveAllToAvailable}
                title="Remove all fields"
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Box 2: Selected Fields (5 cols) */}
            <div className="md:col-span-5 flex flex-col h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-inherit text-xs font-bold text-emerald-800 dark:text-emerald-300 flex justify-between">
                <span>Selected to Export ({selectedFields.length})</span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto space-y-1">
                {selectedFields.length === 0 ? (
                  <p className="text-center text-xs text-rose-500 py-10">
                    No fields selected. Choose fields to include in export.
                  </p>
                ) : (
                  selectedFields.map((key) => {
                    const field = ALL_FIELDS.find(f => f.key === key);
                    const isSelected = selectedHighlighted.includes(key);
                    return (
                      <div
                        key={key}
                        onClick={() => toggleHighlight(key, selectedHighlighted, setSelectedHighlighted)}
                        className={`text-xs p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{field?.label || key}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating Spreadsheet...' : 'Download Export (.CSV)'}
          </button>
        </div>
      </div>
    </div>
  );
}
