// Integration Modal Functions
window.showIntegration = function (id, name) {
    const modal = document.getElementById('integration-modal');
    document.getElementById('int-project-name').innerText = name;

    // LIVE HOSTINGER URL
    const PRODUCTION_URL = 'https://lavenderblush-crab-898479.hostingersite.com';

    // HTML Endpoint
    const htmlCode = `
<!-- Add these hidden fields to your existing form -->
<input type="hidden" name="projectId" value="${id}">
<input type="hidden" name="source" value="Website Web Form">

<!-- Change your form action to point to your new CRM URL -->
<!-- action="${PRODUCTION_URL}/api/leads" -->
`;

    // JS Fetch (Smart Script)
    const jsCode = `
<script>
// Paste this before </body> on your landing page
document.addEventListener('DOMContentLoaded', () => {
    // YOUR LIVE CRM URL
    const API_URL = '/api/projects'; 
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
