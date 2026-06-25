import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, UserPlus, Home, ClipboardList, Bookmark, MessageSquare, UserCircle, Building2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-400">
              <Briefcase className="w-6 h-6" />
              <span>InternBoard</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link to="/profile" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Profile
              </Link>
              <Link to="/companies" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Companies
              </Link>
              <Link to="/saved" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Saved
              </Link>
              <Link to="/chat" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Chat
              </Link>
              <Link to="/register" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Register
              </Link>
              <Link to="/post" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Post Listing
              </Link>
              <Link to="/applications" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Manage Apps
              </Link>
              <Link to="/dashboard" className="hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
