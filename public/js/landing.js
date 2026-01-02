document.getElementById('lead-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button');
    const alertBox = document.getElementById('alert-box');

    // UI Loading State
    const originalText = btn.innerText;
    btn.innerText = 'Submitting...';
    btn.disabled = true;

    // Gather data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alertBox.className = 'alert alert-success';
            alertBox.innerText = 'Thank you! Our agent will contact you shortly.';
            alertBox.style.display = 'block';
            form.reset();
        } else {
            throw new Error(result.error || 'Submission failed');
        }

    } catch (error) {
        alertBox.className = 'alert alert-error';
        alertBox.innerText = 'Error: ' + error.message;
        alertBox.style.display = 'block';
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});
