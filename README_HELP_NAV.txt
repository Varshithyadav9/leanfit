LEANFIT HELP NAVIGATION PATCH

Replace/add these files in your current project:

REPLACE:
src/App.jsx
src/App.css
src/components/HelpButton.jsx
src/components/WelcomePage.jsx

ADD:
src/components/SiteHeader.jsx

What this patch changes:
- Removes the floating ? Help button.
- Adds a normal "Help" option immediately after "About" in the top navigation.
- Keeps About > Help > Customer Login > Admin Login order.
- Makes this top navigation available across customer/public LeanFit pages.
- Help opens the existing LeanFit Assistant.
- Admin dashboard/admin management pages keep their existing admin navigation.

No backend, MongoDB, coupon, payment, or Render environment changes are required.
