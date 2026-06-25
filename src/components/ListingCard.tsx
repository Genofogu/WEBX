import React from 'react';
import { Listing, Student } from '../types';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, Bookmark, BookmarkCheck, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface ListingCardProps {
  listing: Listing;
  onApply: (listingId: number) => void;
  onToggleSave?: (listingId: number) => void;
  isSaved?: boolean;
  currentStudent?: Student;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onApply, onToggleSave, isSaved, currentStudent }) => {
  const skillsRequired = listing.skills_required.split(',').map(s => s.trim().toLowerCase());
  const studentSkills = currentStudent?.skills.split(',').map(s => s.trim().toLowerCase()) || [];
  
  const matchingSkills = skillsRequired.filter(skill => studentSkills.includes(skill));
  const matchPercentage = skillsRequired.length > 0 ? (matchingSkills.length / skillsRequired.length) * 100 : 0;

  const isExpired = new Date(listing.deadline) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all relative ${isExpired ? 'opacity-75' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{listing.role}</h3>
          <p className="text-blue-400 font-medium flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> {listing.org_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isExpired ? (
            <div className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-800">
              Expired
            </div>
          ) : matchPercentage >= 50 && (
            <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-800">
              <CheckCircle2 className="w-3 h-3" /> {Math.round(matchPercentage)}% Match
            </div>
          )}
          {onToggleSave && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(listing.id);
              }}
              className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
              title={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" /> {listing.duration}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" /> {listing.stipend}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" /> Deadline: {listing.deadline}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" /> Remote / On-site
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills Required</h4>
        <div className="flex flex-wrap gap-2">
          {skillsRequired.map((skill, i) => (
            <span 
              key={i} 
              className={`px-2 py-1 rounded text-xs font-medium ${
                studentSkills.includes(skill) 
                ? 'bg-blue-900/30 text-blue-300 border border-blue-800' 
                : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={() => !isExpired && onApply(listing.id)}
        disabled={isExpired}
        className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          isExpired 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isExpired ? 'Applications Closed' : 'Apply Now'}
      </button>
    </motion.div>
  );
};

export default ListingCard;