LEANFIT CUSTOMER FLOW FINALIZATION

Replace only these files in your current project:

src/components/PaymentPage.jsx
src/components/CustomerPortal.jsx
src/components/Dashboard.jsx
src/App.css
server/controllers/orderController.js

What this update fixes:
- Uses VITE_API_URL consistently instead of hardcoded API URLs.
- Validates payment screenshots and cleans preview memory.
- Saves the submitted Order ID locally after payment.
- Customer orders refresh automatically every 20 seconds.
- Lean Pro dashboard opens only after admin verification.
- Direct dashboard access is blocked when membership is not approved.
- Feedback is shown only on delivered orders.
- Delivered orders must have a generated PDF.
- Customer order responses are not browser-cached.

Deployment:
1. Replace the files.
2. Push the frontend changes to Vercel.
3. Push/deploy server/controllers/orderController.js to Render.
4. Test payment -> admin verify -> customer refresh -> PDF/dashboard -> delivered -> feedback.

Authentication validation is intentionally left for the final update.
