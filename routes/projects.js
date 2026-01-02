const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// 1. Get All Projects
router.get('/', (req, res) => {
    try {
        const projects = db.getProjects();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Add New Project
router.post('/', (req, res) => {
    try {
        const { name, location, type, budgetRange, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project Name is required' });
        }

        const newProject = {
            name,
            location,
            type: type || 'Residential', // Residential, Commercial, Plots
            budgetRange,
            description
        };

        const savedProject = db.saveProject(newProject);
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
