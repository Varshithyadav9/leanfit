LEANFIT GLOBAL HELP + MOBILE PATCH

Use this patch on the latest working LeanFit project.

REPLACE these files:
- src/main.jsx
- src/components/HelpButton.jsx
- src/components/WelcomePage.jsx
- src/components/LoginPage.jsx
- src/components/PaymentPage.jsx
- src/components/Dashboard.jsx

WHAT CHANGED
1. HelpButton is mounted once globally in src/main.jsx, so it appears on every page.
2. Old page-specific HelpButton instances were removed to prevent duplicate buttons.
3. Mobile Help panel is shorter (about 68% of viewport height), scrollable, and stays above the floating Help button.
4. Floating Help button stays fixed at bottom-right and respects mobile safe-area spacing.
5. No coupon, payment, admin, MongoDB, or backend logic was changed.

PUSH
git add .
git commit -m "Make Help global and improve mobile chat"
git push
