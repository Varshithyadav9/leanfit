LEANFIT HEADER CLEANUP PATCH

Replace these 3 files in your current project:
1. src/App.jsx
2. src/components/SiteHeader.jsx
3. src/App.css

What this patch does:
- Keeps the full LeanFit logo + About + Help + login navigation on the HOME page.
- On all other customer/public pages, keeps only the top navigation (About / Help / login options) without adding another LeanFit logo.
- Logged-in customers see About / Help / Home / Logout.
- Existing page-specific logos and headers (Calculator, Customer Portal, login artwork, Info pages, etc.) remain unchanged.
- Admin pages remain unchanged.
- No backend, MongoDB, coupon, payment, or Render changes.

This removes the duplicate-logo/header problem while keeping Help available across the site.
