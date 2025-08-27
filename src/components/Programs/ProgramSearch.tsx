import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Program } from '../../types';
import ProgramCard from './ProgramCard';

interface ProgramSearchProps {
  programs: Program[];
  appliedPrograms: string[];
  onAddToApplications: (program: Program) => void;
}

const ProgramSearch: React.FC<ProgramSearchProps> = ({ 
  programs, 
  appliedPrograms, 
  onAddToApplications 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cutoff' | 'tuition'>('cutoff');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    coopOnly: false,
    maxCutoff: 100,
    maxTuition: 100000,
  });

  const filteredAndSortedPrograms = useMemo(() => {
    let filtered = programs.filter(program => {
      const matchesSearch = program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.universityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCoop = !filters.coopOnly || program.coopAvailable;
      const matchesCutoff = program.lastYearCutoff <= filters.maxCutoff;
      const matchesTuition = program.tuitionDomestic <= filters.maxTuition;

      return matchesSearch && matchesCoop && matchesCutoff && matchesTuition;
    });

    // Sort programs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.programName.localeCompare(b.programName);
        case 'cutoff':
          return b.lastYearCutoff - a.lastYearCutoff;
        case 'tuition':
          return a.tuitionDomestic - b.tuitionDomestic;
        default:
          return 0;
      }
    });

    return filtered;
  }, [programs, searchTerm, sortBy, filters]);

  const resetFilters = () => {
    setFilters({
      coopOnly: false,
      maxCutoff: 100,
      maxTuition: 100000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs or universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
              showFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-600' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <div className="relative">
            <SortAsc className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'cutoff' | 'tuition')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cutoff">Sort by Cutoff</option>
              <option value="name">Sort by Name</option>
              <option value="tuition">Sort by Tuition</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.coopOnly}
                  onChange={(e) => setFilters({ ...filters, coopOnly: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Co-op programs only</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Cutoff: {filters.maxCutoff}%
              </label>
              <input
                type="range"
                min="80"
                max="100"
                value={filters.maxCutoff}
                onChange={(e) => setFilters({ ...filters, maxCutoff: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tuition: ${filters.maxTuition.toLocaleString()}
              </label>
              <input
                type="range"
                min="6000"
                max="20000"
                step="1000"
                value={filters.maxTuition}
                onChange={(e) => setFilters({ ...filters, maxTuition: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedPrograms.length} of {programs.length} programs
        </p>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isApplied={appliedPrograms.includes(program.id)}
            onAddToApplications={onAddToApplications}
          />
        ))}
      </div>

      {filteredAndSortedPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No programs match your current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              resetFilters();
            }}
            className="mt-2 text-blue-600 hover:text-blue-700 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgramSearch;