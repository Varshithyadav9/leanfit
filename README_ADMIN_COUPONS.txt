LEANFIT ADMIN COUPONS PATCH v2
==============================

WHAT THIS ADDS
- Admin Dashboard -> Coupons button
- Create coupon
- Edit coupon
- Activate / deactivate coupon
- Delete coupon
- Usage count
- Percentage or fixed discounts
- Minimum order / maximum discount
- Start and expiry dates
- Total usage and per-customer limits
- Plan restrictions
- Existing LEAN10 from MongoDB will appear automatically

IMPORTANT SECURITY IMPROVEMENT
The old AdminLogin.jsx had the admin email/password inside frontend JavaScript.
This patch moves admin login verification to the backend and protects coupon-management APIs with an admin JWT.

FILES TO REPLACE
Frontend:
  src/App.jsx
  src/App.css
  src/components/AdminDashboard.jsx
  src/components/AdminLogin.jsx

Backend:
  server/controllers/authController.js
  server/routes/authRoutes.js
  server/routes/couponRoutes.js
  server/.env.example   (reference only; do NOT overwrite your real .env)

NEW FILES
  src/components/AdminCoupons.jsx
  server/controllers/couponAdminController.js
  server/middleware/adminAuthMiddleware.js

RENDER ENVIRONMENT VARIABLES - REQUIRED BEFORE ADMIN LOGIN WILL WORK
In your Render backend service -> Environment, add:
  ADMIN_EMAIL = your admin login email
  ADMIN_PASSWORD = your admin login password

JWT_SECRET must already exist because LeanFit customer authentication uses it.
Do NOT put ADMIN_EMAIL or ADMIN_PASSWORD into Vercel/frontend variables.
Do NOT commit your real .env file.

DEPLOY
1. Copy/replace the files above, preserving their folders.
2. In Render add ADMIN_EMAIL and ADMIN_PASSWORD.
3. git add .
4. git commit -m "Add admin coupon management"
5. git push
6. Wait for Render and Vercel deployments to finish.
7. Login to Admin. You will see a Coupons button.
8. Open Coupons. Existing LEAN10 should already be listed.

TEST
- Create TEST20, percentage, 20, All plans, Active.
- Confirm it appears in the list.
- Test TEST20 on the customer payment page.
- Deactivate it in Admin and confirm the customer page rejects it.
- Reactivate or delete it.

BUILD NOTE
Backend JavaScript syntax checks passed in the provided project.
A full Vite build could not run in this Linux sandbox because the uploaded node_modules lacks the Linux Rolldown native optional dependency. This is the same environment/node_modules issue seen previously, not a backend syntax error.
