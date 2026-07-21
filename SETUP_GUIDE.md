# TDCP Visitor Intake System — Setup Guide

This is an **internal office tool** — staff fill it in at the counter while
helping a walk-in visitor, it is not filled out by tourists themselves.

Three pieces:
1. **`form.html`** — intake form used by office staff
2. **`Code.gs`** — backend (lives inside a Google Sheet, no server needed)
3. **`dashboard.html`** — internal analytics dashboard for TDCP staff

## Step 1 — Create the Google Sheet backend

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet. Name it something like **"TDCP Visitor Responses"**.
2. Go to **Extensions → Apps Script**. Delete any starter code in the editor.
3. Paste the entire contents of `Code.gs` into the editor. Save (Ctrl/Cmd+S).
4. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" → choose **Web app**.
   - Description: "TDCP feedback backend"
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**. Google will ask you to authorize — approve it (it'll show an "unverified app" warning since it's your own script; click **Advanced → Go to project (unsafe) → Allow**. This is normal for personal Apps Script projects).
6. Copy the **Web app URL** it gives you (looks like `https://script.google.com/macros/s/XXXXXXXX/exec`).

## Step 2 — Connect the form

1. Open `form.html` in a text editor.
2. Find this line near the bottom:
   ```js
   const ENDPOINT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace it with the URL you copied in Step 1.
4. Save the file.

## Step 3 — Connect the dashboard

1. Open `dashboard.html` in a text editor.
2. Do the same replacement for `ENDPOINT_URL`.
3. Save the file.

## Step 4 — Host the two HTML files

Pick whichever is easiest for you / TDCP's IT setup:
- **Quickest for a demo:** Open the files directly in a browser (works fine locally) — but if you want a real shareable link, use one of the options below.
- **Free & simple:** Push both files to a GitHub repo and enable **GitHub Pages** (Settings → Pages → deploy from branch). You'll get a URL like `https://yourusername.github.io/tdcp-feedback/form.html`.
- **If TDCP has a domain/hosting already:** just upload `form.html` and `dashboard.html` to their existing web server — they're fully static, no build step needed.

## Step 5 — Test it end-to-end

1. Open `form.html`, fill it out, submit.
2. Open your Google Sheet — a new row should appear within a few seconds.
3. Open `dashboard.html` — it should show the KPI cards and charts updating.

## Restrict who sees the dashboard (recommended)

`dashboard.html` currently has no login — anyone with the link can view it. For an internal-only tool, either:
- Host it somewhere access-controlled (e.g. behind TDCP's internal network / intranet), or
- Add simple password gating with a JS prompt, or
- Move the dashboard behind Google Sign-In if TDCP wants it locked to staff accounts (this needs a bit more setup — ask me if you want this built out).

## Troubleshooting

- **Dashboard shows "Couldn't load data" / CORS error:** Make sure the Apps Script deployment's "Who has access" is set to **Anyone**, not "Anyone with Google account" — Apps Script Web Apps only allow anonymous cross-origin GET requests under the "Anyone" setting.
- **Form submits but nothing shows in the sheet:** Check the Apps Script **Executions** log (left sidebar in the Apps Script editor) for errors.
- **Changed Code.gs after first deploy:** You need to create a **new deployment version** (Deploy → Manage deployments → edit → New version) — saving the script alone doesn't update the live Web App.

## Portfolio framing (for your resume/LinkedIn)

> Designed and deployed an internal visitor intake and analytics system for TDCP (Tourism Development Corporation of Punjab) — a staff-facing data entry tool, a serverless Google Sheets backend, and a live BI-style dashboard visualizing visitor demographics, site popularity, and service-request trends across the double-decker bus tour desk.

This is a legitimate full-stack delivery story: frontend, a real backend/data layer, and a BI-style reporting layer — worth having in your portfolio even outside the AI/ML track, since it shows you can ship a complete product independently.
