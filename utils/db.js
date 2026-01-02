const fs = require('fs');
const path = require('path');
const leadsDbPath = path.join(__dirname, '../data/leads.json');
const projectsDbPath = path.join(__dirname, '../data/projects.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(leadsDbPath))) {
    fs.mkdirSync(path.dirname(leadsDbPath), { recursive: true });
}

// Ensure db files exist
if (!fs.existsSync(leadsDbPath)) fs.writeFileSync(leadsDbPath, '[]');
if (!fs.existsSync(projectsDbPath)) fs.writeFileSync(projectsDbPath, '[]');

// --- Helper Generic --
const readJson = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeJson = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- LEADS ---
const getLeads = () => readJson(leadsDbPath);

const saveLead = (lead) => {
    const leads = getLeads();
    if (!lead._id) lead._id = Date.now().toString();
    if (!lead.createdAt) lead.createdAt = new Date().toISOString();
    leads.push(lead);
    writeJson(leadsDbPath, leads);
    return lead;
};

const updateLead = (id, updates) => {
    const leads = getLeads();
    const index = leads.findIndex(l => l._id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...updates };
    writeJson(leadsDbPath, leads);
    return leads[index];
};

// --- PROJECTS ---
const getProjects = () => readJson(projectsDbPath);

const saveProject = (project) => {
    const projects = getProjects();
    if (!project._id) project._id = Date.now().toString();
    if (!project.createdAt) project.createdAt = new Date().toISOString();

    // Add default active status
    if (!project.status) project.status = 'Active';

    projects.push(project);
    writeJson(projectsDbPath, projects);
    return project;
};

module.exports = { getLeads, saveLead, updateLead, getProjects, saveProject };
