const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// 1. Submit a generic lead (Integration for Landing Pages)
router.post('/', (req, res) => {
    try {
        let { name, email, phone, project, projectId, source, notes } = req.body;

        // Logic: If projectId is provided (via API Key or Hidden Field), look up the project Name
        if (projectId) {
            const allProjects = db.getProjects();
            const foundProject = allProjects.find(p => p._id === projectId);
            if (foundProject) {
                project = foundProject.name; // Auto-fill project name
            } else {
                // If invalid ID, maybe still allow but warn? Or fail? 
                // Let's fallback to "Unknown Project" if generic.
                if (!project) project = 'Unknown Connected Project (' + projectId + ')';
            }
        }

        // Basic validation
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and Phone are required.' });
        }

        // If project is still missing (neither sent nor found via ID)
        if (!project) {
            project = 'General Inquiry';
        }

        const newLead = {
            name,
            email,
            phone,
            project,
            projectId: projectId || null, // Store the ID too for reference
            source: source || 'Web Form',
            status: 'New',
            assignedTo: 'Unassigned',
            notes
        };

        const savedLead = db.saveLead(newLead);
        res.status(201).json({ message: 'Lead captured successfully', lead: savedLead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all leads (For the Dashboard)
router.get('/', (req, res) => {
    try {
        const { project, status } = req.query;
        let leads = db.getLeads();

        if (project) leads = leads.filter(l => l.project === project);
        if (status) leads = leads.filter(l => l.status === status);

        // Sort by createdAt desc
        leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Update Lead Status (For Employees)
router.patch('/:id', (req, res) => {
    try {
        const { status, assignedTo, notes } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;
        if (notes) updateData.notes = notes;

        const updatedLead = db.updateLead(req.params.id, updateData);

        if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });

        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get Summary Stats (For Dashboard)
router.get('/stats', (req, res) => {
    try {
        const leads = db.getLeads();
        const totalLeads = leads.length;
        const newLeads = leads.filter(l => l.status === 'New').length;
        const converted = leads.filter(l => ['Booked', 'Closed'].includes(l.status)).length;

        const projectStats = {};
        leads.forEach(l => {
            const pName = l.project || 'Other';
            projectStats[pName] = (projectStats[pName] || 0) + 1;
        });

        res.json({
            total: totalLeads,
            new: newLeads,
            converted: converted,
            byProject: Object.keys(projectStats).map(k => ({ _id: k, count: projectStats[k] }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
