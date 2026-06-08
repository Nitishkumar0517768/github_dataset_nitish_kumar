import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters, fetchDatasets } from '../store/datasetSlice';
import { Filter, Trash2, ChevronRight, Sliders } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.datasets);

  // Handle dropdown value changes
  const handleFilterChange = (name, value) => {
    dispatch(setFilter({ [name]: value }));
    dispatch(fetchDatasets());
  };

  // Handle clearing all filters
  const handleClearAll = () => {
    dispatch(resetFilters());
    dispatch(fetchDatasets());
  };

  // Filter dropdown configurations
  const filterSections = [
    {
      label: 'Classification Type',
      name: 'type',
      options: [
        { label: 'All Types', value: '' },
        { label: 'Function', value: 'function' },
        { label: 'Function Implementation', value: 'function_implementation' },
        { label: 'Class', value: 'class' },
        { label: 'Class Implementation', value: 'class_implementation' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Docstring Generation', value: 'docstring_generation' },
      ],
    },
    {
      label: 'Category',
      name: 'category',
      options: [
        { label: 'All Categories', value: '' },
        { label: 'AI (Artificial Intelligence)', value: 'ai' },
        { label: 'ML (Machine Learning)', value: 'ml' },
        { label: 'Code Generation', value: 'code_generation' },
        { label: 'Docstring', value: 'docstring' },
      ],
    },
    {
      label: 'Framework',
      name: 'framework',
      options: [
        { label: 'All Frameworks', value: '' },
        { label: 'PyTorch', value: 'pytorch' },
        { label: 'TensorFlow', value: 'tensorflow' },
        { label: 'Keras', value: 'keras' },
        { label: 'Scikit-Learn', value: 'scikit' },
        { label: 'JAX', value: 'jax' },
      ],
    },
    {
      label: 'Language / Extension',
      name: 'language',
      options: [
        { label: 'All Languages', value: '' },
        { label: 'Python (.py)', value: 'python' },
        { label: 'JavaScript (.js)', value: 'javascript' },
        { label: 'Markdown (.md)', value: 'markdown' },
        { label: 'Go (.go)', value: 'go' },
        { label: 'C++ (.cpp)', value: 'cpp' },
        { label: 'Java (.java)', value: 'java' },
        { label: 'Rust (.rs)', value: 'rust' },
      ],
    },
    {
      label: 'Document Format',
      name: 'docType',
      options: [
        { label: 'All Formats', value: '' },
        { label: 'Markdown (md)', value: 'md' },
        { label: 'HTML', value: 'html' },
        { label: 'RestructuredText (rst)', value: 'rst' },
        { label: 'Plain Text (txt)', value: 'txt' },
      ],
    },
    {
      label: 'Source Type',
      name: 'source',
      options: [
        { label: 'All Sources', value: '' },
        { label: 'GitHub Repository', value: 'github_repository' },
      ],
    },
  ];

  const hasActiveFilters = Object.values(filters).some((val) => val !== '');

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-dark-border/60 p-5 rounded-3xl shadow-sm space-y-5 h-fit">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
          <Sliders className="w-4 h-4 text-brand-500" />
          Filter Options
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Repository search (Custom type-in filter) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Source Repository
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. pytorch/pytorch"
            value={filters.repo}
            onChange={(e) => handleFilterChange('repo', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-dark-border rounded-xl text-xs outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Select lists */}
      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.name} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.label}
            </label>
            <select
              value={filters[section.name]}
              onChange={(e) => handleFilterChange(section.name, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-dark-border rounded-xl text-xs outline-none text-slate-700 dark:text-slate-300 focus:border-brand-500 transition-colors cursor-pointer capitalize"
            >
              {section.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
