import React from 'react';
import { Eye, Edit2, Trash2, ExternalLink, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" 
    />
  </svg>
);


const DatasetTableRow = ({ dataset, onView, onEdit, onDelete, onRestore, isSelected, onSelectToggle }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Safe extraction of nested metadata fields
  const id = dataset.id || dataset._id;
  const instruction = dataset.instruction || '';
  const metaType = dataset.metadata?.type || 'unknown';
  const repoName = dataset.metadata?.repo_name || 'unknown';
  const filePath = dataset.metadata?.file_path || '';
  const url = dataset.metadata?.url || '';
  const isDeleted = dataset.isDeleted === true;

  // Extract file extension or name for display
  const getFileDisplay = () => {
    if (!filePath) return 'N/A';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  // Format type style badge
  const getTypeBadge = () => {
    switch (metaType.toLowerCase()) {
      case 'function':
      case 'function_implementation':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
      case 'class':
      case 'class_implementation':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
      case 'documentation':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'readme':
      case 'readme_based':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-100 dark:border-orange-900/30';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    }
  };

  return (
    <tr className={`border-b border-slate-200/60 dark:border-dark-border/60 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors group ${isDeleted ? 'bg-slate-100/30 dark:bg-slate-950/10 opacity-60' : ''}`}>
      {/* Checkbox column */}
      <td className="px-6 py-4.5 align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectToggle && onSelectToggle(id)}
          className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/20 outline-none transition-colors cursor-pointer"
        />
      </td>

      {/* Dataset ID badge */}
      <td className="px-6 py-4.5 align-middle font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
        #{id}
      </td>

      {/* Metadata classification type */}
      <td className="px-6 py-4.5 align-middle">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${getTypeBadge()}`}>
          {metaType.replace('_', ' ')}
        </span>
      </td>

      {/* Source Repository (Clickable repository metadata details) */}
      <td className="px-6 py-4.5 align-middle">
        <div className="flex items-center gap-1.5 max-w-[200px]">
          <GithubIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className={`text-sm font-semibold truncate ${isDeleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {repoName}
          </span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex-shrink-0"
              title="Open GitHub source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </td>

      {/* Target file location */}
      <td className={`px-6 py-4.5 align-middle font-mono text-xs max-w-[140px] truncate ${isDeleted ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`} title={filePath}>
        {getFileDisplay()}
      </td>

      {/* Instruction preview snippet */}
      <td className="px-6 py-4.5 align-middle">
        <p className={`text-sm line-clamp-1 max-w-[320px] ${isDeleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`} title={instruction}>
          {instruction}
        </p>
      </td>

      {/* Operations column */}
      <td className="px-6 py-4.5 align-middle text-right">
        <div className="flex items-center justify-end gap-2">
          {/* View Details */}
          <button
            onClick={() => onView(dataset)}
            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
            title="View full record"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Restore action visible to admin users if deleted */}
          {user && user.role === 'admin' && isDeleted && (
            <button
              onClick={() => onRestore && onRestore(id)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
              title="Restore record"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Edit & Delete actions visible to logged in users when NOT deleted */}
          {user && !isDeleted && (
            <>
              <button
                onClick={() => onEdit(dataset)}
                className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
                title="Edit record"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all border border-slate-200/40 dark:border-dark-border/40 cursor-pointer"
                title="Delete record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DatasetTableRow;
