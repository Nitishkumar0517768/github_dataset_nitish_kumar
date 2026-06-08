import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Calendar, FileCode, Tag, Trash2 } from 'lucide-react';

const DatasetDetailModal = ({ dataset, isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  if (!isOpen || !dataset) return null;

  const id = dataset.id || dataset._id;
  const instruction = dataset.instruction || '';
  const input = dataset.input || '';
  const output = dataset.output || '';
  const metadata = dataset.metadata || {};
  
  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copy to Clipboard Helper
  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Custom Github Icon
  const GithubIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
      {/* Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Container */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-dark-card border-l border-slate-200 dark:border-dark-border shadow-2xl flex flex-col justify-between animate-slide-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">#{id}</span>
              <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-bold capitalize">
                {metadata.type || 'unknown'}
              </span>
              {dataset.isDeleted && (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold uppercase">
                  Soft Deleted
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold font-heading">Dataset Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {dataset.isDeleted && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 text-rose-800 dark:text-rose-300">
              <div className="p-1.5 bg-rose-100 dark:bg-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-bold">This dataset is soft-deleted</p>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                  This record is currently in the trash. Active features/endpoints will not return it unless explicitly queried. Admins can restore it from the explorer row list.
                </p>
              </div>
            </div>
          )}
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-dark-border/40">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <GithubIcon className="text-slate-400" />
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Source Repository:</span>
              </div>
              <div className="flex items-center gap-1.5 pl-6">
                <span className="text-sm font-semibold truncate max-w-[200px]">{metadata.repo_name || 'N/A'}</span>
                {metadata.url && (
                  <a 
                    href={metadata.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">File Path:</span>
              </div>
              <span className="block text-xs font-mono pl-6 text-slate-500 dark:text-slate-400 truncate" title={metadata.file_path}>
                {metadata.file_path || 'N/A'}
              </span>
            </div>

            <div className="space-y-3 sm:col-span-2 border-t border-slate-200/40 dark:border-dark-border/20 pt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">File Format / Code element:</span>
                </div>
                <span className="block text-xs font-semibold pl-6 mt-1 capitalize text-slate-600 dark:text-slate-300">
                  {metadata.doc_type || metadata.code_element || 'N/A'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Last Sync:</span>
                </div>
                <span className="block text-xs font-semibold pl-6 mt-1 text-slate-600 dark:text-slate-300">
                  {formatDate(dataset.updatedAt || dataset.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Instruction</h3>
              <button 
                onClick={() => handleCopy(instruction, 'instruction')}
                className="text-xs text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSection === 'instruction' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'instruction' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-dark-border/40 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {instruction}
            </div>
          </div>

          {/* Input Section (if exists) */}
          {input && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Input Context</h3>
                <button 
                  onClick={() => handleCopy(input, 'input')}
                  className="text-xs text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedSection === 'input' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'input' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-[#0d1117] text-[#c9d1d9] rounded-2xl overflow-x-auto text-xs font-mono border border-slate-900">
                <code>{input}</code>
              </pre>
            </div>
          )}

          {/* Output Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expected Output / Code</h3>
              <button 
                onClick={() => handleCopy(output, 'output')}
                className="text-xs text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSection === 'output' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'output' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-[#0d1117] text-[#c9d1d9] rounded-2xl overflow-x-auto text-xs font-mono border border-slate-900 max-h-96">
              <code>{output}</code>
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-slate-800/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl border border-slate-200 dark:border-dark-border transition-colors cursor-pointer"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
};

export default DatasetDetailModal;
