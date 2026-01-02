const API_URL = 'http://localhost:3000/api/projects';

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

async function loadProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '<p style="color: var(--text-muted);">Loading projects...</p>';

    try {
        const res = await fetch(API_URL);
        const projects = await res.json();

        container.innerHTML = '';

        if (projects.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); border: 2px dashed var(--border); border-radius: 16px;">
                    <ion-icon name="business-outline" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></ion-icon>
                    <p>No projects found. Add your first project!</p>
                </div>`;
            return;
        }

        projects.forEach(p => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '10px';

            // Random gradient for visual appeal if no image
            const gradients = [
                'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                'linear-gradient(135deg, #10b981, #3b82f6)',
                'linear-gradient(135deg, #f59e0b, #ef4444)'
            ];
            const bg = gradients[Math.floor(Math.random() * gradients.length)];

            card.innerHTML = `
                <div style="height: 100px; background: ${bg}; margin: -20px -20px 10px; border-radius: 16px 16px 0 0; display: flex; align-items: flex-end; padding: 15px;">
                    <span style="background: rgba(0,0,0,0.6); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; backdrop-filter: blur(4px);">
                        ${p.type}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3 style="color: var(--text-main); font-size: 1.2rem; margin: 0;">${p.name}</h3>
                    <span style="font-size: 0.8rem; color: ${p.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'};">● ${p.status}</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">
                    <ion-icon name="location-outline"></ion-icon> ${p.location}
                </p>
                <div style="margin-top: auto; padding-top: 15px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted);">
                   <span>${p.budgetRange || 'Price on Request'}</span>
                   <button onclick="showIntegration('${p._id}', '${p.name}')" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                        <ion-icon name="code-slash-outline"></ion-icon> Get Code
                   </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = '<p style="color: var(--danger);">Failed to load projects.</p>';
        console.error(err);
    }
}

// Modal Functions
window.openModal = function () {
    document.getElementById('project-modal').style.display = 'flex';
}

window.closeModal = function () {
    document.getElementById('project-modal').style.display = 'none';
}

// Handle Form Submit
document.getElementById('add-project-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Saving...';
    btn.disabled = true;

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeModal();
            this.reset();
            loadProjects(); // Reload list
        } else {
            alert('Failed to save project');
        }
    } catch (err) {
        console.error(err);
        alert('Error saving project');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// Close modal when clicking outside
document.getElementById('project-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});


// Integration Modal Functions
window.showIntegration = function (id, name) {
    const modal = document.getElementById('integration-modal');
    document.getElementById('int-project-name').innerText = name;

    // HTML Endpoint
    const htmlCode = `
<!-- Add these hidden fields to your existing form -->
<input type="hidden" name="projectId" value="${id}">
<input type="hidden" name="source" value="Website Web Form">

<!-- Change your form action to point to your CRM Deployment URL -->
<!-- action="https://your-crm-url.com/api/leads" -->
`;

    // JS Fetch (Smart Script)
    const jsCode = `
<script>
// Paste this before </body> on your landing page
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your Live CRM URL (Localhost won't work on real websites)
    const CRM_URL = 'http://localhost:3000/api/leads'; 
    const PROJECT_ID = '${id}'; // ${name}

    // Attach to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            // Attempt to find fields automatically
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Smart mapping for common field names
            const payload = {
                name: data.name || data.fname || data.fullname || data['your-name'],
                phone: data.phone || data.mobile || data.contact || data.tel || data['your-mobile'],
                email: data.email || data['your-email'],
                projectId: PROJECT_ID,
                source: document.title || 'Landing Page',
                notes: 'Form Data: ' + JSON.stringify(data)
            };

            if (payload.name && payload.phone) {
                // Send to CRM in background
                fetch(CRM_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(r => console.log('Lead Sent to CRM')).catch(e => console.error(e));
            }
        });
    });
});
</script>
`;

    document.getElementById('code-snippet-html').innerText = htmlCode.trim();
    document.getElementById('code-snippet-js').innerText = jsCode.trim();

    modal.style.display = 'flex';
}

window.closeIntegrationModal = function () {
    document.getElementById('integration-modal').style.display = 'none';
}

// Close int modal when clicking outside
document.getElementById('integration-modal').addEventListener('click', function (e) {
    if (e.target === this) closeIntegrationModal();
});

window.copyCode = function (elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        // Show a small feedback toast or change button text
        const btn = document.querySelector(`span[onclick="copyCode('${elementId}')"]`);
        const original = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            btn.innerText = original;
            btn.style.color = 'var(--primary)';
        }, 2000);
    });
}
