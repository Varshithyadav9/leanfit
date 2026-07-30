LeanFit compact welcome and admin update

Replace these files in your current project:
1. src/components/WelcomePage.jsx
2. src/components/AdminDashboard.jsx
3. src/App.css

Changes:
- Restores the LeanFit logo on the welcome page.
- Keeps the welcome page compact.
- Adds About, Contact, Privacy Policy and Terms & Conditions links.
- Adds a small Simple / Affordable / Personalized information strip.
- Adds a compact footer.
- Fixes Admin Login to use setPage("admin-login") instead of /admin.
- Removes the customer Settings button from the Admin Dashboard.
- Keeps Email Templates and Back to Website in Admin.

Push after replacement:
git add .
git commit -m "Update compact welcome page and admin navigation"
git push origin main

Build note:
The files were checked for integration against leanfit-v2(17).zip. A full local Vite build could not complete in this environment because the uploaded node_modules is missing the Linux rolldown native binding. Vercel will install dependencies for its own environment during deployment.
