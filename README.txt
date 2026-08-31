LeanFit Header Glitch Fix

Replace only:
src/components/SiteHeader.jsx

Fixes:
- Homepage always shows Customer Login + Admin Login.
- Logged-in customer controls remain on internal customer pages.
- Logout clears both localStorage and sessionStorage immediately.
