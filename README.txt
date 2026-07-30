LEANFIT ADMIN LOGIN FIX

1. Copy src/components/WelcomePage.jsx
2. Paste it into your LeanFit project at src/components/WelcomePage.jsx
3. Replace the existing file.
4. Run:
   git add .
   git commit -m "Fix admin login navigation"
   git push origin main

Cause fixed:
- Removed react-router-dom import because this project uses setPage navigation.
- Admin Login now calls setPage("admin-login") instead of opening /admin directly.
