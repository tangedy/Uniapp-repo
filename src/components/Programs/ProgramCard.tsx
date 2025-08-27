import React from 'react';
import { MapPin, Calendar, DollarSign, Users, Plus, Check } from 'lucide-react';
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
              <MapPin className="h-4 w-4 mr-1" />
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
            <Users className="h-4 w-4 mr-2" />
            <span>Avg: {program.admissionAverage}%</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{formatCurrency(program.tuitionDomestic)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 col-span-2">
            <Calendar className="h-4 w-4 mr-2" />
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
                  <Check className="h-4 w-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
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