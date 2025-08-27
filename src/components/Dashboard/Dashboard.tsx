import React from 'react';
import { BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { UserApplication } from '../../types';

interface DashboardProps {
  applications: UserApplication[];
}

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    pending: applications.filter(app => app.status === 'Planning').length,
    offers: applications.filter(app => app.status === 'Offer').length,
  };

  const upcomingDeadlines = applications
    .flatMap(app => 
      app.program.supplementaryRequirements.map(req => ({
        programName: app.program.programName,
        universityName: app.program.universityName,
        requirement: req.name,
        deadline: new Date(req.deadline),
        completed: app.supplementaryStatus[req.id]?.completed || false,
      }))
    )
    .filter(item => !item.completed && item.deadline > new Date())
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 5);

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-50';
    if (days <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Application Dashboard</h1>
        <p className="text-blue-100">
          Track your Ontario CS university applications and stay on top of deadlines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applied</p>
              <p className="text-2xl font-semibold text-green-600">{stats.applied}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Planning</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offers</p>
              <p className="text-2xl font-semibold text-purple-600">{stats.offers}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
        </div>
        <div className="p-6">
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming deadlines</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingDeadlines.map((item, index) => {
                const daysUntil = getDaysUntilDeadline(item.deadline);
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.requirement}</h3>
                      <p className="text-sm text-gray-600">
                        {item.programName} - {item.universityName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {item.deadline.toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDeadlineColor(daysUntil)}`}>
                      {daysUntil === 0 ? 'Due today' : 
                       daysUntil === 1 ? '1 day left' : 
                       `${daysUntil} days left`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {applications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Start by browsing and adding programs to your application list.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Browse Programs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;