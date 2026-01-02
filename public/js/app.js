const API_URL = 'http://localhost:3000/api/leads';

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadLeads();
});

async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();

        document.getElementById('total-leads').innerText = data.total;
        document.getElementById('new-leads').innerText = data.new;
        document.getElementById('converted-leads').innerText = data.converted;
    } catch (err) {
        console.error('Failed to load stats', err);
    }
}

async function loadLeads(filterProject = null, filterStatus = null) {
    const tbody = document.getElementById('leads-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading...</td></tr>';

    let url = API_URL;
    const params = new URLSearchParams();
    if (filterProject) params.append('project', filterProject);
    if (filterStatus) params.append('status', filterStatus);

    if (params.toString()) url += `?${params.toString()}`;

    try {
        const res = await fetch(url);
        const leads = await res.json();

        tbody.innerHTML = '';

        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No leads found.</td></tr>';
            return;
        }

        leads.forEach(lead => {
            const tr = document.createElement('tr');

            const date = new Date(lead.createdAt).toLocaleDateString();

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--text-main);">${lead.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${lead.email || ''}</div>
                </td>
                <td>${lead.project}</td>
                <td>${lead.phone}</td>
                <td>${lead.source}</td>
                <td>${date}</td>
                <td>
                    ${generateStatusSelect(lead._id, lead.status)}
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--danger);">Failed to load leads.</td></tr>';
    }
}

function generateStatusSelect(id, currentStatus) {
    const statuses = ['New', 'Contacted', 'Interested', 'Site Visit', 'Negotiation', 'Closed', 'Lost'];

    let options = statuses.map(s =>
        `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${s}</option>`
    ).join('');

    return `
        <div class="status-badge status-${currentStatus.replace(' ', '')}" style="position: relative;">
            <select class="status-select" onchange="updateStatus('${id}', this.value, this)">
                ${options}
            </select>
        </div>
    `;
}

async function updateStatus(id, newStatus, selectElement) {
    // Optionally show saving state
    const badge = selectElement.parentElement;
    const oldClass = badge.className;
    badge.style.opacity = '0.5';

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            // Update badge color
            badge.className = `status-badge status-${newStatus.replace(' ', '')}`;

            // Refresh stats because counts might change
            loadStats();
        } else {
            alert('Failed to update status');
        }
    } catch (err) {
        console.error(err);
        alert('Error updating status');
    } finally {
        badge.style.opacity = '1';
    }
}
