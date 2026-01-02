# Deploying to Hostinger (Node.js App) 🚀

Great! Hostinger's "Deploy Node.js App" feature (as shown in your screenshot) makes this very easy.

## Step 1: Put your Code on GitHub (Required)
Hostinger needs to pull the code from a Git repository.
1.  Log in to your [GitHub Account](https://github.com).
2.  Create a **New Repository**. Name it something like `saryu-crm`.
3.  Do **NOT** add README or .gitignore (we already have them).
4.  Copy the commands shown under "…or push an existing repository from the command line".
5.  **Paste those commands in your VS Code Terminal**. They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/saryu-crm.git
    git branch -M main
    git push -u origin main
    ```
    *(If you don't know how to do this, ask me and I will help you run the commands provided you give me the repo URL)*

## Step 2: Hostinger Setup
1.  Go back to that **Hostinger Screen** you showed me.
2.  Click **"Continue with GitHub"**.
3.  Select the `saryu-crm` repository you just created.
4.  **Configuration Settings**:
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (or `node server.js`)
    *   **Port**: `3000` (or leave auto if it detects it)
5.  Click **Deploy**.

## Step 3: What about the Database?
Since you are using Hostinger:
*   **Default**: The app will use the internal file system (`data/leads.json`). careful: **If you re-deploy or reinstall, this file might get wiped/reset.**
*   **Recommended (Permanent)**: 
    1.  Create a free **MongoDB Atlas** account.
    2.  Get the connection URL.
    3.  In Hostinger Environment Variables, add `MONGO_URI` = `your_connection_string`.
    4.  The app will automatically switch to MongoDB mode.

## Step 4: Update Landing Page
Once deployed, Hostinger will give you a domain (e.g., `saryu-crm.main-app.com` or your own domain).
Updates your landing page script:
```javascript
const CRM_URL = 'https://YOUR-NEW-HOSTINGER-DOMAIN.com/api/leads';
```
