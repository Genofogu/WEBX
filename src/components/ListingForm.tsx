import React, { useState } from 'react';
import { Briefcase, Building2, Clock, DollarSign, Code, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface ListingFormProps {
  onPost: (listing: any) => void;
}

export default function ListingForm({ onPost }: ListingFormProps) {
  const [formData, setFormData] = useState({
    org_name: '',
    role: '',
    duration: '3 Months',
    stipend: '',
    skills_required: '',
    contact: '',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPost(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-3 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Post Internship Listing</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Organization Name
            </label>
            <input 
              type="text" 
              required
              value={formData.org_name}
              onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Internship Role
            </label>
            <input 
              type="text" 
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Frontend Developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duration
            </label>
            <select 
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>1 Month</option>
              <option>2 Months</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>Full-time</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Stipend (Monthly)
            </label>
            <input 
              type="text" 
              required
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="$500 / Unpaid"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Code className="w-4 h-4" /> Skills Required (Comma separated)
          </label>
          <input 
            type="text" 
            required
            value={formData.skills_required}
            onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="React, Tailwind, TypeScript"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Email
            </label>
            <input 
              type="email" 
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="hr@acme.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Application Deadline
            </label>
            <input 
              type="date" 
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Post Internship
        </button>
      </form>
    </motion.div>
  );
}
