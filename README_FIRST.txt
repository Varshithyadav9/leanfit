LEANFIT CORRECTED CLEAN PROJECT

WHAT WAS FIXED
1. Removed .git, node_modules and the private server/.env from this ZIP.
2. Fixed server/package-lock.json URLs that incorrectly pointed to an internal package registry and caused Render ETIMEDOUT failures.
3. Pinned Node.js to version 20 and added npm start for Render.
4. Pinned Razorpay 2.9.8 and Sharp 0.34.5.
5. Corrected Lean Pro Membership backend price from ₹349 to ₹449 to match the frontend.
6. Changed the PDF email recipient from only ADMIN_EMAIL to the customer email, with optional admin BCC.
7. Customer Portal now allows PDF download for both Verified and Delivered orders.
8. Added server/.env.example and improved .gitignore protection.

IMPORTANT
- Never upload server/.env to GitHub or share it.
- Copy server/.env.example to server/.env locally and enter your real values.
- Add the same secret values in Render > Environment.
- Resend's onboarding@resend.dev sender is restricted for testing. To email any customer, verify your own sending domain in Resend and set EMAIL_FROM to that verified address.

LOCAL SETUP
1. In project root: npm install
2. In server folder: npm install
3. Frontend: npm run dev
4. Backend: cd server && npm run dev

RENDER SETTINGS
Root Directory: server
Build Command: npm ci --include=optional
Start Command: npm start

After replacing your project files:
git add .
git commit -m "Fix Render deployment and Razorpay integration"
git push

Then in Render use: Manual Deploy > Clear build cache & deploy.
