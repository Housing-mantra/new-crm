# How to Deploy SARYU CRM 🚀

## Option 1: Deploy on Render (Recommended for Node.js)
1.  **Push to GitHub**:
    *   Create a new repository on GitHub.
    *   Run these commands in your terminal:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/estate-crm.git
        git branch -M main
        git push -u origin main
        ```
2.  **Create Service on Render**:
    *   Go to [dashboard.render.com](https://dashboard.render.com).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   Click **Deploy**.

## ⚠️ Important Note About Data Storage
Currently, this app uses a **local JSON file** (`data/leads.json`) to store leads.
*   On **Localhost**: Data is safe.
*   On **Render (Free Tier)**: **DATA WILL BE LOST** when the server restarts (approx every 15 mins of inactivity).

### To Fix Data Persistence (MongoDB):
1.  Create a free database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Get your Connection String (e.g., `mongodb+srv://user:pass@...`).
3.  Add it as an Environment Variable in Render: `MONGO_URI`.
4.  Update the code to use Mongoose Models instead of `utils/db.js`.

## Integration
Once deployed, your API URL will look like:
`https://estate-crm-xyz.onrender.com`

Update your landing page scripts to use this new URL instead of `localhost:3000`.
