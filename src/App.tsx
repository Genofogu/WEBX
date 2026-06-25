import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useParams } from 'react-router-dom';
import { Student, Listing, Application, DashboardStats, Message, Organization } from './types';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import StudentForm from './components/StudentForm';
import ListingForm from './components/ListingForm';
import Dashboard from './components/Dashboard';
import ApplicationsList from './components/ApplicationsList';
import { motion, AnimatePresence } from 'motion/react';
import { User, AlertCircle, CheckCircle2, Search, Filter, X, Briefcase, Calendar, MessageSquare, Send, Building2, UserCircle, Save, Globe, ExternalLink } from 'lucide-react';
import { io } from 'socket.io-client';

function Home({ students, currentStudent, setCurrentStudent }: { 
  students: Student[], 
  currentStudent: Student | null, 
  setCurrentStudent: (s: Student | null) => void 
}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [deadlineFilter, setDeadlineFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, [currentStudent]);

  const fetchData = async () => {
    try {
      const listingsRes = await fetch('/api/internships');
      const listingsData = await listingsRes.json();
      setListings(listingsData);
      
      if (currentStudent) {
        const savedRes = await fetch(`/api/user/saved/${currentStudent.id}`);
        const savedData = await savedRes.json();
        setSavedIds(savedData.map((l: Listing) => l.id));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (listingId: number) => {
    if (!currentStudent) {
      setNotification({ message: 'Please register as a student first!', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/user/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          student_id: currentStudent.id,
          note: `Hi, I am ${currentStudent.name} and I am interested in this role.`
        })
      });
      if (res.ok) {
        setNotification({ message: 'Application submitted successfully!', type: 'success' });
      } else {
        setNotification({ message: 'Failed to submit application.', type: 'error' });
      }
    } catch (err) {
      setNotification({ message: 'Error submitting application.', type: 'error' });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleSave = async (listingId: number) => {
    if (!currentStudent) {
      setNotification({ message: 'Please register as a student first!', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const isSaved = savedIds.includes(listingId);
    try {
      if (isSaved) {
        await fetch(`/api/user/saved/${currentStudent.id}/${listingId}`, { method: 'DELETE' });
        setSavedIds(prev => prev.filter(id => id !== listingId));
      } else {
        await fetch('/api/user/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: currentStudent.id, listing_id: listingId })
        });
        setSavedIds(prev => [...prev, listingId]);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Filter logic
  const roles = Array.from(new Set(listings.map(l => l.role)));
  const orgs = Array.from(new Set(listings.map(l => l.org_name)));
  const skills = Array.from(new Set(listings.flatMap(l => l.skills_required.split(',').map(s => s.trim()))));

  const filteredListings = listings.filter(l => {
    const matchesSearch = !searchQuery || 
      l.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.skills_required.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !selectedRole || l.role === selectedRole;
    const matchesOrg = !selectedOrg || l.org_name === selectedOrg;
    const matchesSkill = !selectedSkill || l.skills_required.toLowerCase().includes(selectedSkill.toLowerCase());

    const isExpired = new Date(l.deadline) < new Date(new Date().setHours(0, 0, 0, 0));
    const matchesDeadline = deadlineFilter === 'All' || 
      (deadlineFilter === 'Active' && !isExpired) || 
      (deadlineFilter === 'Expired' && isExpired);

    return matchesSearch && matchesRole && matchesOrg && matchesSkill && matchesDeadline;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedOrg('');
    setSelectedSkill('');
    setDeadlineFilter('All');
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' ? 'bg-green-900/90 text-green-300 border-green-800' : 'bg-red-900/90 text-red-300 border-red-800'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
        <div>
          <h1 className="text-3xl font-black text-white">Available Internships</h1>
          <p className="text-gray-400">Find your next big opportunity</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-xl border border-gray-700">
          <User className="w-5 h-5 text-blue-400" />
          <div className="text-sm">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Acting As</p>
            <select 
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              value={currentStudent?.id || ''}
              onChange={(e) => setCurrentStudent(students.find(s => s.id === parseInt(e.target.value)) || null)}
            >
              {students.length === 0 && <option value="">No students registered</option>}
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text"
              placeholder="Search by role, company, or skills..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-9 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-9 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                <option value="">All Companies</option>
                {orgs.map(org => <option key={org} value={org}>{org}</option>)}
              </select>
            </div>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-9 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">All Skills</option>
                {skills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-9 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={deadlineFilter}
                onChange={(e) => setDeadlineFilter(e.target.value)}
              >
                <option value="All">All Deadlines</option>
                <option value="Active">Active Only</option>
                <option value="Expired">Expired Only</option>
              </select>
            </div>
          </div>
        </div>
        {(searchQuery || selectedRole || selectedOrg || selectedSkill || deadlineFilter !== 'All') && (
          <div className="flex justify-end">
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onApply={handleApply}
              onToggleSave={handleToggleSave}
              isSaved={savedIds.includes(listing.id)}
              currentStudent={currentStudent || undefined}
            />
          ))}
          {filteredListings.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
              <p className="text-gray-500 font-medium">No internships match your current filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SavedPage({ currentStudent }: { currentStudent: Student | null }) {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStudent) {
      fetchSaved();
    } else {
      setLoading(false);
    }
  }, [currentStudent]);

  const fetchSaved = async () => {
    try {
      const res = await fetch(`/api/saved/${currentStudent?.id}`);
      const data = await res.json();
      setSavedListings(data);
    } catch (err) {
      console.error('Error fetching saved:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (listingId: number) => {
    if (!currentStudent) return;
    try {
      await fetch(`/api/saved/${currentStudent.id}/${listingId}`, { method: 'DELETE' });
      setSavedListings(prev => prev.filter(l => l.id !== listingId));
    } catch (err) {
      console.error('Error unsaving:', err);
    }
  };

  if (!currentStudent) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
        <p className="text-gray-400">Please register or select a student to view saved listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Your Bookmarks</h1>
        <p className="text-gray-400">Internships you've saved for later</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onApply={() => {}} 
              onToggleSave={handleToggleSave}
              isSaved={true}
              currentStudent={currentStudent}
            />
          ))}
          {savedListings.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
              <p className="text-gray-500 font-medium">You haven't saved any internships yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RegisterPage({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const navigate = useNavigate();
  const handleRegister = async (student: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (res.ok) {
        onRegisterSuccess();
        navigate('/');
      }
    } catch (err) {
      console.error('Error registering student:', err);
    }
  };

  return <StudentForm onRegister={handleRegister} />;
}

function PostListingPage() {
  const navigate = useNavigate();
  const handlePost = async (listing: any) => {
    try {
      const res = await fetch('/api/admin/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (res.ok) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error posting listing:', err);
    }
  };

  return <ListingForm onPost={handlePost} />;
}

function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/user/applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string, note: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredApplications = statusFilter === 'All' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Applications</h1>
          <p className="text-gray-400">Review and update student applications</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-xl border border-gray-700">
          <Filter className="w-5 h-5 text-blue-400" />
          <div className="text-sm">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Filter Status</p>
            <select 
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ApplicationsList applications={filteredApplications} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Platform Dashboard</h1>
        <p className="text-gray-400">Real-time statistics and insights</p>
      </div>
      <Dashboard stats={stats} />
    </div>
  );
}

interface Contact {
  id: number;
  name: string;
  type: 'student' | 'organization';
  subtext: string;
}

function ChatPage({ currentStudent, students }: { currentStudent: Student | null, students: Student[] }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [organizations, setOrganizations] = useState<Contact[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (currentStudent) {
      fetch('/api/user/applications')
        .then(res => res.json())
        .then(apps => {
          const studentApps = apps.filter((a: any) => a.student_id === currentStudent.id);
          const uniqueOrgs = Array.from(new Set(studentApps.map((a: any) => a.org_name)));
          const orgContacts: Contact[] = uniqueOrgs.map((name, index) => ({
            id: 10000 + index, // Pseudo-ID for organizations
            name: name as string,
            type: 'organization',
            subtext: 'Applied Organization'
          }));
          setOrganizations(orgContacts);
        });
    }
  }, [currentStudent]);

  useEffect(() => {
    if (socket && currentStudent && selectedContact) {
      const roomId = [currentStudent.id, selectedContact.id].sort().join('-');
      socket.emit('join_room', roomId);

      fetch(`/api/user/messages/${currentStudent.id}/${selectedContact.id}`)
        .then(res => res.json())
        .then(data => setMessages(data));

      socket.on('receive_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, currentStudent, selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !currentStudent || !selectedContact || !newMessage.trim()) return;

    const roomId = [currentStudent.id, selectedContact.id].sort().join('-');
    socket.emit('send_message', {
      sender_id: currentStudent.id,
      receiver_id: selectedContact.id,
      text: newMessage,
      roomId
    });
    setNewMessage('');
  };

  if (!currentStudent) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
        <p className="text-gray-400">Please register or select a student to start chatting.</p>
      </div>
    );
  }

  const studentContacts: Contact[] = students
    .filter(s => s.id !== currentStudent.id)
    .map(s => ({
      id: s.id,
      name: s.name,
      type: 'student',
      subtext: s.college
    }));

  const allContacts = [...studentContacts, ...organizations];

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Sidebar - Contact List */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-gray-800/50">
          <h3 className="font-bold text-white">Contacts</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {allContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No contacts found.</div>
          ) : (
            allContacts.map(contact => (
              <button
                key={`${contact.type}-${contact.id}`}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left ${
                  selectedContact?.id === contact.id && selectedContact?.type === contact.type ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  contact.type === 'student' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
                }`}>
                  {contact.type === 'student' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-sm truncate">{contact.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                      contact.type === 'student' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'
                    }`}>
                      {contact.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.subtext}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950/50">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-800 bg-gray-800/30 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                selectedContact.type === 'student' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
              }`}>
                {selectedContact.type === 'student' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="font-bold text-white leading-none">{selectedContact.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{selectedContact.type}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender_id === currentStudent.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender_id === currentStudent.id
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    <p className="text-[10px] opacity-50 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <MessageSquare className="w-16 h-16 opacity-20" />
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage({ currentStudent, onUpdate }: { currentStudent: Student | null, onUpdate: (student: Student) => void }) {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (currentStudent) {
      setFormData(currentStudent);
    }
  }, [currentStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/user/profile/${currentStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (!currentStudent) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
        <p className="text-gray-400">Please register or select a student to view profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Your Profile</h1>
        <p className="text-gray-400">Manage your personal information and skills</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Full Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">College/University</label>
            <input
              type="text"
              required
              value={formData.college || ''}
              onChange={e => setFormData({ ...formData, college: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Year of Study</label>
            <input
              type="text"
              required
              value={formData.year || ''}
              onChange={e => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Contact Email</label>
            <input
              type="email"
              required
              value={formData.contact || ''}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Skills (comma separated)</label>
          <input
            type="text"
            required
            value={formData.skills || ''}
            onChange={e => setFormData({ ...formData, skills: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. React, Node.js, Python"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Short Bio</label>
          <textarea
            required
            value={formData.bio || ''}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function CompaniesPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/organizations')
      .then(res => res.json())
      .then(data => {
        setOrganizations(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading companies...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Partner Organizations</h1>
        <p className="text-gray-400">Discover companies offering internships and projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
          >
            <div className="h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center p-6">
              <img
                src={org.logo}
                alt={org.name}
                className="h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{org.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-2">{org.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Website</a>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{org.contact}</span>
                </div>
              </div>
              <Link
                to={`/companies/${org.id}`}
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-xl transition-all"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CompanyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/organizations/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrg(data);
        setFormData(data);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrg(updated);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating organization:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading company profile...</div>;
  if (!org) return <div className="text-center py-20">Organization not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 p-2 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
            <img
              src={org.logo}
              alt={org.name}
              className="w-24 h-24 object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
        <div className="pt-16 p-8 space-y-6">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Company Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Website URL</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact || ''}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo || ''}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </form>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white">{org.name}</h2>
                <div className="flex items-center gap-4 text-gray-400">
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <Globe className="w-4 h-4" /> {new URL(org.website).hostname}
                  </a>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> {org.contact}
                  </span>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed">{org.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setStudents(data);
      if (data.length > 0 && !currentStudent) {
        setCurrentStudent(data[0]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<Home students={students} currentStudent={currentStudent} setCurrentStudent={setCurrentStudent} />} />
            <Route path="/profile" element={<ProfilePage currentStudent={currentStudent} onUpdate={(updated) => {
              setCurrentStudent(updated);
              fetchStudents();
            }} />} />
            <Route path="/saved" element={<SavedPage currentStudent={currentStudent} />} />
            <Route path="/chat" element={<ChatPage currentStudent={currentStudent} students={students} />} />
            <Route path="/register" element={<RegisterPage onRegisterSuccess={fetchStudents} />} />
            <Route path="/post" element={<PostListingPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyProfilePage />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-900 py-12 text-center text-gray-600 text-sm">
          <p>&copy; 2026 Student Internship & Project Board. Built with Node.js, Express, and React.</p>
        </footer>
      </div>
    </Router>
  );
}
