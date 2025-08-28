import React from 'react';
// import { MapPin, Calendar, DollarSign, Users, Plus, Check } from 'lucide-react';
import { Program } from '../../types';

interface ProgramCardProps {
  program: Program;
  isApplied?: boolean;
  onAddToApplications?: (program: Program) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  isApplied = false, 
  onAddToApplications 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCutoffColor = (cutoff: number) => {
    if (cutoff >= 95) return 'text-red-600 bg-red-50';
    if (cutoff >= 90) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{program.programName}</h3>
            <p className="text-gray-600 flex items-center mt-1">
              <svg className="h-4 w-4 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {program.universityName}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCutoffColor(program.lastYearCutoff)}`}>
            {program.lastYearCutoff}% cutoff
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {program.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 21-2-2a4 4 0 0 0-4 0"/>
              <circle cx="17" cy="7" r="4"/>
            </svg>
            <span>Avg: {program.admissionAverage}%</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>{formatCurrency(program.tuitionDomestic)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 col-span-2">
            <svg className="h-4 w-4 mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Deadline: {formatDate(program.applicationDeadline)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {program.coopAvailable && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Co-op
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              {program.supplementaryRequirements.length} supplements
            </span>
          </div>

          {onAddToApplications && (
            <button
              onClick={() => onAddToApplications(program)}
              disabled={isApplied}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isApplied
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isApplied ? (
                <>
                  <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add to Applications</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;