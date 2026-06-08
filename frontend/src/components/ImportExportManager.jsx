import React, { useState, useRef } from 'react';
import { Upload, Download, FileJson, Check, AlertCircle, X, Loader } from 'lucide-react';
import apiClient from '../services/api';

const ImportExportManager = ({ isOpen, onClose, onImportSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Input Click select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Client-side JSON validation and loading
  const processFile = (file) => {
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      setError("Please upload a valid JSON file (.json).");
      setFile(null);
      setParsedData(null);
      return;
    }

    setFile(file);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const records = Array.isArray(json) ? json : [json];
        
        // Validation check for required fields: id, instruction, output
        for (let i = 0; i < records.length; i++) {
          const item = records[i];
          if (!item.id || !item.instruction || !item.output) {
            setError(`Formatting error in record at index ${i}: 'id', 'instruction', and 'output' fields are required.`);
            setParsedData(null);
            return;
          }
        }
        setParsedData(records);
      } catch (err) {
        setError("Invalid JSON format. Check file syntax.");
        setParsedData(null);
      }
    };
    reader.readAsText(file);
  };

  const triggerInputClick = () => {
    fileInputRef.current.click();
  };

  // POST Import Action
  const handleImportSubmit = async () => {
    if (!parsedData) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/datasets/import-json', parsedData);
      setSuccess(true);
      setFile(null);
      setParsedData(null);
      if (onImportSuccess) {
        onImportSuccess(response.data.message || 'Import completed successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import JSON data');
    } finally {
      setLoading(false);
    }
  };

  // GET Export to CSV
  const handleExportCSV = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/datasets/export/csv', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `datasets_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export database to CSV format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-3xl shadow-2xl flex flex-col justify-between animate-fade-in max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 mb-5">
          <h2 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Import & Export Manager
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Seed your training data with JSON uploads or download datasets in CSV format.
          </p>
        </div>

        {/* Export Card */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-dark-border/40 bg-slate-50/50 dark:bg-slate-800/10 mb-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Export Database</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Download datasets as a flat CSV spreadsheet.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/50 dark:border-dark-border/50" />
          </div>
          <span className="relative px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-dark-card">
            JSON Import
          </span>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onDragEnter={handleDrag} 
          onDragOver={handleDrag} 
          onDragLeave={handleDrag} 
          onDrop={handleDrop}
          onClick={triggerInputClick}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-brand-500 bg-brand-50/10 dark:bg-brand-950/5' 
              : 'border-slate-200 dark:border-dark-border hover:border-brand-400/80 hover:bg-slate-50/30 dark:hover:bg-slate-800/5'
          }`}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".json"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Drag & drop JSON file here</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                or click to browse local files
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {file && parsedData && (
          <div className="mt-4 p-3.5 bg-brand-50/40 dark:bg-brand-950/5 rounded-2xl border border-brand-100/50 dark:border-brand-900/10 flex items-center justify-between gap-3 text-brand-900 dark:text-brand-300">
            <div className="flex items-center gap-2 min-w-0">
              <FileJson className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  Parsed: {parsedData.length} records detected
                </p>
              </div>
            </div>
            <button
              onClick={handleImportSubmit}
              disabled={loading}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Import
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs">
            <Check className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">
              Data imported successfully! Your database inventory has been updated.
            </span>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200/60 dark:border-dark-border transition-colors cursor-pointer disabled:opacity-50"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImportExportManager;
