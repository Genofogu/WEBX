import React from 'react';
import { Application } from '../types';
import { CheckCircle, XCircle, Clock, FileText, User, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface ApplicationsListProps {
  applications: Application[];
  onUpdateStatus: (id: number, status: string, note: string) => void;
}

export default function ApplicationsList({ applications, onUpdateStatus }: ApplicationsListProps) {
  const statusColors = {
    'Pending': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    'Shortlisted': 'bg-green-900/30 text-green-400 border-green-800',
    'Rejected': 'bg-red-900/30 text-red-400 border-red-800',
  };

  return (
    <div className="space-y-6">
      {applications.map((app, i) => {
        const skillsRequired = app.skills_required?.split(',').map(s => s.trim().toLowerCase()) || [];
        const studentSkills = app.student_skills?.split(',').map(s => s.trim().toLowerCase()) || [];
        const matchingSkills = skillsRequired.filter(skill => studentSkills.includes(skill));
        const matchPercentage = skillsRequired.length > 0 ? (matchingSkills.length / skillsRequired.length) * 100 : 0;

        return (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{app.student_name}</h3>
                    <p className="text-gray-400 flex items-center gap-1 text-sm">
                      <Briefcase className="w-4 h-4" /> {app.role} at {app.org_name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                  {matchPercentage >= 50 && (
                    <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-800">
                      {Math.round(matchPercentage)}% Skill Match
                    </span>
                  )}
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Applicant Note
                  </p>
                  <p className="text-gray-300 text-sm italic">"{app.note || 'No note provided'}"</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center min-w-[200px]">
                <button 
                  onClick={() => onUpdateStatus(app.id, 'Shortlisted', app.note)}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Shortlist
                </button>
                <button 
                  onClick={() => onUpdateStatus(app.id, 'Rejected', app.note)}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => onUpdateStatus(app.id, 'Pending', app.note)}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Clock className="w-4 h-4" /> Reset to Pending
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
