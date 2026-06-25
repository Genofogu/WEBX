import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { notifyNewApplication, notifyStatusUpdate, notifyMatchingListing } from './notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Database
const db = {
  students: [
    { id: 1, name: 'Alice Smith', college: 'Tech Institute', year: '3rd Year', skills: 'React, TypeScript, Tailwind', bio: 'Passionate frontend developer.', contact: 'alice@example.com' },
    { id: 2, name: 'Bob Jones', college: 'State University', year: '4th Year', skills: 'Python, Django, SQL', bio: 'Backend enthusiast with a love for data.', contact: 'bob@example.com' }
  ],
  listings: [
    { id: 1, org_name: 'Google', role: 'Frontend Intern', duration: '3 Months', stipend: '$2000', skills_required: 'React, TypeScript', contact: 'hr@google.com', posted_at: new Date().toISOString(), deadline: '2026-05-01' },
    { id: 2, org_name: 'Meta', role: 'Backend Intern', duration: '6 Months', stipend: '$2500', skills_required: 'Python, SQL', contact: 'hr@meta.com', posted_at: new Date().toISOString(), deadline: '2026-06-15' },
    { id: 3, org_name: 'StartupX', role: 'Fullstack Intern', duration: '2 Months', stipend: '$500', skills_required: 'React, Node.js', contact: 'jobs@startupx.com', posted_at: new Date().toISOString(), deadline: '2026-04-30' }
  ],
  applications: [] as any[],
  saved_listings: [] as { student_id: number, listing_id: number }[],
  messages: [] as { id: number, sender_id: number, receiver_id: number, text: string, timestamp: string }[],
  organizations: [
    { id: 1, name: 'Google', description: 'A global leader in technology and innovation.', logo: 'https://logo.clearbit.com/google.com', contact: 'hr@google.com', website: 'https://google.com' },
    { id: 2, name: 'Meta', description: 'Building the future of social connection.', logo: 'https://logo.clearbit.com/meta.com', contact: 'hr@meta.com', website: 'https://meta.com' },
    { id: 3, name: 'StartupX', description: 'A fast-growing startup focused on AI solutions.', logo: 'https://picsum.photos/seed/startupx/200/200', contact: 'jobs@startupx.com', website: 'https://startupx.ai' }
  ]
};

async function startServer() {
  console.log('Starting server initialization with mock database...');
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Students
  app.post(['/api/students', '/api/admin/users'], (req, res) => {
    const student = { ...req.body, id: db.students.length + 1 };
    db.students.push(student);
    res.json({ id: student.id });
  });

  app.get(['/api/students', '/api/admin/users'], (req, res) => {
    res.json(db.students);
  });

  app.put(['/api/students/:id', '/api/user/profile/:id'], (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.students.findIndex(s => s.id === id);
    if (index !== -1) {
      db.students[index] = { ...db.students[index], ...req.body, id };
      res.json(db.students[index]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  });

  // Listings
  app.post(['/api/listings', '/api/admin/internship'], (req, res) => {
    const listing = { ...req.body, id: db.listings.length + 1, posted_at: new Date().toISOString() };
    db.listings.push(listing);

    // Notify matching students
    const listingSkills = listing.skills_required.split(',').map((s: string) => s.trim().toLowerCase());
    db.students.forEach(student => {
      const studentSkills = student.skills.split(',').map(s => s.trim().toLowerCase());
      const matches = listingSkills.some((skill: string) => studentSkills.includes(skill));
      if (matches) {
        notifyMatchingListing(student.contact, listing.role, listing.org_name, listing.skills_required);
      }
    });

    res.json({ id: listing.id });
  });

  app.get(['/api/listings', '/api/internships'], (req, res) => {
    res.json(db.listings.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()));
  });

  // Saved Listings (Bookmarks)
  app.post(['/api/saved', '/api/user/saved'], (req, res) => {
    const { student_id, listing_id } = req.body;
    const exists = db.saved_listings.some(s => s.student_id === student_id && s.listing_id === listing_id);
    if (!exists) {
      db.saved_listings.push({ student_id, listing_id });
    }
    res.json({ success: true });
  });

  app.delete(['/api/saved/:student_id/:listing_id', '/api/user/saved/:student_id/:listing_id'], (req, res) => {
    const student_id = parseInt(req.params.student_id);
    const listing_id = parseInt(req.params.listing_id);
    db.saved_listings = db.saved_listings.filter(s => !(s.student_id === student_id && s.listing_id === listing_id));
    res.json({ success: true });
  });

  app.get(['/api/saved/:student_id', '/api/user/saved/:student_id'], (req, res) => {
    const student_id = parseInt(req.params.student_id);
    const savedIds = db.saved_listings.filter(s => s.student_id === student_id).map(s => s.listing_id);
    const savedListings = db.listings.filter(l => savedIds.includes(l.id));
    res.json(savedListings);
  });

  // Applications
  app.post(['/api/apply', '/api/user/apply'], (req, res) => {
    const application = { ...req.body, id: db.applications.length + 1, status: 'Pending', applied_at: new Date().toISOString() };
    db.applications.push(application);

    // Notify organization
    const student = db.students.find(s => s.id === application.student_id);
    const listing = db.listings.find(l => l.id === application.listing_id);
    if (student && listing) {
      notifyNewApplication(listing.contact, student.name, listing.role);
    }

    res.json({ id: application.id });
  });

  app.get(['/api/applications', '/api/user/applications'], (req, res) => {
    const apps = db.applications.map(app => {
      const student = db.students.find(s => s.id === app.student_id);
      const listing = db.listings.find(l => l.id === app.listing_id);
      return {
        ...app,
        student_name: student?.name,
        student_skills: student?.skills,
        role: listing?.role,
        org_name: listing?.org_name,
        skills_required: listing?.skills_required
      };
    });
    res.json(apps.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()));
  });

  app.put(['/api/applications/:id', '/api/user/applications/:id'], (req, res) => {
    const { status, note } = req.body;
    const index = db.applications.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
      const oldApp = db.applications[index];
      db.applications[index] = { ...oldApp, status, note };

      // Notify student if status changed
      if (status !== oldApp.status) {
        const student = db.students.find(s => s.id === oldApp.student_id);
        const listing = db.listings.find(l => l.id === oldApp.listing_id);
        if (student && listing) {
          notifyStatusUpdate(student.contact, listing.role, listing.org_name, status);
        }
      }

      res.json({ updated: 1 });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  // Dashboard Stats
  app.get(['/api/dashboard', '/api/admin/dashboard'], (req, res) => {
    const totalListings = db.listings.length;
    const totalStudents = db.students.length;
    const totalApplications = db.applications.length;
    const shortlistedCount = db.applications.filter(a => a.status === 'Shortlisted').length;
    
    const counts: any = {};
    db.applications.forEach(a => {
      counts[a.listing_id] = (counts[a.listing_id] || 0) + 1;
    });
    
    let mostAppliedId = null;
    let maxCount = -1;
    for (const id in counts) {
      if (counts[id] > maxCount) {
        maxCount = counts[id];
        mostAppliedId = parseInt(id);
      }
    }
    
    const mostAppliedListing = mostAppliedId ? db.listings.find(l => l.id === mostAppliedId) : null;

    // Calculate skill distribution
    const skillCounts: { [key: string]: number } = {};
    db.students.forEach(student => {
      const studentSkills = student.skills.split(',').map(s => s.trim().toLowerCase());
      studentSkills.forEach(skill => {
        if (skill) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      });
    });

    const skillDistribution = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 skills

    res.json({
      totalListings,
      totalStudents,
      totalApplications,
      shortlistedCount,
      mostAppliedListing: mostAppliedListing ? { ...mostAppliedListing, app_count: maxCount } : null,
      skillDistribution
    });
  });

  // Organizations
  app.get(['/api/organizations', '/api/admin/organizations'], (req, res) => {
    res.json(db.organizations);
  });

  app.get(['/api/organizations/:id', '/api/admin/organizations/:id'], (req, res) => {
    const org = db.organizations.find(o => o.id === parseInt(req.params.id));
    if (org) res.json(org);
    else res.status(404).json({ error: 'Organization not found' });
  });

  app.post(['/api/organizations', '/api/admin/organizations'], (req, res) => {
    const org = { ...req.body, id: db.organizations.length + 1 };
    db.organizations.push(org);
    res.json(org);
  });

  app.put(['/api/organizations/:id', '/api/admin/organizations/:id'], (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.organizations.findIndex(o => o.id === id);
    if (index !== -1) {
      db.organizations[index] = { ...db.organizations[index], ...req.body, id };
      res.json(db.organizations[index]);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  });

  // Chat Messages
  app.get(['/api/messages/:user1/:user2', '/api/user/messages/:user1/:user2'], (req, res) => {
    const user1 = parseInt(req.params.user1);
    const user2 = parseInt(req.params.user2);
    const history = db.messages.filter(m => 
      (m.sender_id === user1 && m.receiver_id === user2) ||
      (m.sender_id === user2 && m.receiver_id === user1)
    );
    res.json(history);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
      const { sender_id, receiver_id, text, roomId } = data;
      const message = {
        id: db.messages.length + 1,
        sender_id,
        receiver_id,
        text,
        timestamp: new Date().toISOString()
      };
      db.messages.push(message);
      io.to(roomId).emit('receive_message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
