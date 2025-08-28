import React, { useState } from 'react';
// import { CheckCircle, Circle, Calendar, FileText, Video, Award, User, Trash2 } from 'lucide-react';
import { UserApplication, SupplementaryRequirement } from '../../types';

interface ApplicationTrackerProps {
  applications: UserApplication[];
  onUpdateApplication: (applicationId: string, updates: Partial<UserApplication>) => void;
  onRemoveApplication: (applicationId: string) => void;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onUpdateApplication,
  onRemoveApplication 
}) => {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-gray-100 text-gray-800';
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-purple-100 text-purple-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Waitlist': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSupplementaryIcon = (type: SupplementaryRequirement['type']) => {
    switch (type) {
      case 'AIF': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>;
      case 'Essay': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>;
      case 'Portfolio': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;
      case 'Interview': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      case 'Video': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
      case 'References': return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      default: return <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>;
    }
  };

  const toggleSupplementary = (appId: string, reqId: string, completed: boolean) => {
    const application = applications.find(app => app.id === appId);
    if (!application) return;

    const newSupplementaryStatus = {
      ...application.supplementaryStatus,
      [reqId]: {
        completed,
        completedDate: completed ? new Date().toISOString() : undefined,
      },
    };

    onUpdateApplication(appId, { supplementaryStatus: newSupplementaryStatus });
  };

  const updateApplicationStatus = (appId: string, status: UserApplication['status']) => {
    onUpdateApplication(appId, { status });
  };

  const getCompletionRate = (application: UserApplication) => {
    const total = application.program.supplementaryRequirements.length;
    if (total === 0) return 100;
    
    const completed = application.program.supplementaryRequirements.filter(
      req => application.supplementaryStatus[req.id]?.completed
    ).length;
    
    return Math.round((completed / total) * 100);
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h2>
        <p className="text-gray-600 mb-4">
          Start by browsing programs and adding them to your application list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-sm text-gray-600">
          {applications.length} program{applications.length !== 1 ? 's' : ''} in your list
        </p>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => {
          const completionRate = getCompletionRate(application);
          const isExpanded = expandedApp === application.id;

          return (
            <div key={application.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.program.programName}
                    </h3>
                    <p className="text-gray-600">{application.program.universityName}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <button
                      onClick={() => onRemoveApplication(application.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove application"
                    >
                      <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><polyline points="16 12 12 16 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Supplementary Requirements
                    </span>
                    <span className="text-sm text-gray-600">{completionRate}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex items-center justify-between">
                  <select
                    value={application.status}
                    onChange={(e) => updateApplicationStatus(application.id, e.target.value as UserApplication['status'])}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>

                  <button
                    onClick={() => setExpandedApp(isExpanded ? null : application.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Program Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Admission Average:</span>
                          <span className="font-medium">{application.program.admissionAverage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Year Cutoff:</span>
                          <span className="font-medium">{application.program.lastYearCutoff}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tuition (Domestic):</span>
                          <span className="font-medium">
                            ${application.program.tuitionDomestic.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application Deadline:</span>
                          <span className="font-medium">
                            {new Date(application.program.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Supplementary Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Supplementary Requirements ({application.program.supplementaryRequirements.length})
                      </h4>
                      <div className="space-y-3">
                        {application.program.supplementaryRequirements.map((req) => {
                          const isCompleted = application.supplementaryStatus[req.id]?.completed || false;
                          const completedDate = application.supplementaryStatus[req.id]?.completedDate;

                          return (
                            <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <button
                                onClick={() => toggleSupplementary(application.id, req.id, !isCompleted)}
                                className={`mt-0.5 transition-colors ${
                                  isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                              >
                                {isCompleted ? <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="12 6 12 12 16 12"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="6"/></svg> : <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  {getSupplementaryIcon(req.type)}
                                  <h5 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                                    {req.name}
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <svg className="h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16"/><polyline points="8 12 12 16 16 12"/></svg>
                                    <span>Due: {new Date(req.deadline).toLocaleDateString()}</span>
                                  </div>
                                  {isCompleted && completedDate && (
                                    <div className="text-green-600">
                                      Completed: {new Date(completedDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTracker;