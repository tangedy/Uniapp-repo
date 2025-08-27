import React, { useState } from 'react';
import { CheckCircle, Circle, Calendar, FileText, Video, Award, User, Trash2 } from 'lucide-react';
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
      case 'AIF': return <FileText className="h-4 w-4" />;
      case 'Essay': return <FileText className="h-4 w-4" />;
      case 'Portfolio': return <Award className="h-4 w-4" />;
      case 'Interview': return <User className="h-4 w-4" />;
      case 'Video': return <Video className="h-4 w-4" />;
      case 'References': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                      <Trash2 className="h-4 w-4" />
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
                                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
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
                                    <Calendar className="h-4 w-4" />
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