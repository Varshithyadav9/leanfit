LeanFit Final Customer Portal Renewal Update

Replace only these files:
- src/components/CustomerPortal.jsx
- src/components/Dashboard.jsx
- src/components/PaymentPage.jsx
- server/controllers/paymentController.js
- server/controllers/orderController.js
- server/models/Order.js

Final behavior:
- The ₹99 renewal option appears ONLY in Customer Portal.
- It stays hidden while more than 15 days remain.
- It appears during the final 15 days and after expiry.
- Expired users cannot open Lean Pro Dashboard.
- Clicking renewal opens the existing UPI payment page with ₹99 prefilled.
- User uploads screenshot and submits.
- Renewal appears in Admin as Pending.
- Only admin verification extends the original membership by another 90 days.
- No new PDF is generated for renewal orders.
- Existing progress and dashboard history remain unchanged.
