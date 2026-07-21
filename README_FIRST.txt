LEANFIT RAZORPAY INTEGRATION

1. Replace your backend server files with the included server folder files.
2. Replace frontend/src/components/PaymentPage.jsx with the included file.
3. In Render backend Environment, add:
   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
4. Never upload or commit your real .env file.
5. Push the changes to GitHub. Render will run npm install using package-lock.json.
6. Use Razorpay Test Mode first.

Important:
- The server checks the plan price itself. The browser cannot change the amount.
- Lean Pro access is unlocked only after verified captured payment.
- Screenshot upload is removed.
