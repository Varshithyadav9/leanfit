LEANFIT COUPON FEATURE - PATCH 1
================================

This ZIP contains ONLY the files that need to be added/replaced for the first coupon-code implementation.
Keep the folder structure exactly as shown when copying into the main LeanFit project.

FILES TO REPLACE
----------------
1. src/components/PaymentPage.jsx
2. src/App.css
3. server/server.js
4. server/controllers/paymentController.js
5. server/models/Order.js

NEW FILES TO ADD
----------------
6. server/models/Coupon.js
7. server/services/couponService.js
8. server/controllers/couponController.js
9. server/routes/couponRoutes.js

WHAT THIS VERSION DOES
----------------------
- Adds coupon input + Apply Coupon button to the payment page.
- Validates the coupon on the backend.
- Re-validates the coupon again when payment is submitted.
- Supports percentage and fixed discounts.
- Supports minimum order amount.
- Supports maximum discount for percentage coupons.
- Supports start date and expiry date.
- Supports total usage limit.
- Supports per-user usage limit.
- Supports plan restrictions.
- Stores coupon code, original price and discount amount on the Order.
- Uses the backend-calculated final amount for UPI payment display and order storage.
- Does not trust a discounted price supplied by the browser.

IMPORTANT
---------
This patch does NOT yet add the Admin Dashboard > Coupons screen.
For now, create coupons directly in MongoDB. We can add the admin coupon-management page next.

MONGODB COLLECTION
------------------
Once a Coupon document is created, Mongoose will use the collection name:
  coupons

EXAMPLE 1: LEAN10 - 10% OFF ALL PLANS
--------------------------------------
Insert a document like this into the "coupons" collection:

{
  "code": "LEAN10",
  "discountType": "percentage",
  "discountValue": 10,
  "minimumOrderAmount": 0,
  "maximumDiscount": 100,
  "startDate": null,
  "expiryDate": null,
  "totalUsageLimit": 100,
  "perUserUsageLimit": 1,
  "active": true,
  "applicablePlans": ["All"]
}

EXAMPLE 2: WELCOME50 - RS. 50 OFF DIET + WORKOUT
-------------------------------------------------
{
  "code": "WELCOME50",
  "discountType": "fixed",
  "discountValue": 50,
  "minimumOrderAmount": 199,
  "maximumDiscount": null,
  "startDate": null,
  "expiryDate": null,
  "totalUsageLimit": 50,
  "perUserUsageLimit": 1,
  "active": true,
  "applicablePlans": ["Diet + Workout"]
}

VALID PLAN NAMES
----------------
Diet Plan
Workout Plan
Diet + Workout
Lean Pro Membership
Lean Pro Renewal

DEPLOYMENT
----------
Frontend: deploy the updated frontend after replacing the files.
Backend: deploy the updated backend after replacing/adding the server files.
No new npm package is required.

TEST CHECKLIST
--------------
1. Add LEAN10 in MongoDB.
2. Select Diet Plan (Rs. 199).
3. On Payment page enter LEAN10.
4. Confirm original price = 199.00.
5. Confirm discount = 19.90.
6. Confirm final payable amount = 179.10.
7. Open UPI and confirm amount = 179.10.
8. Upload screenshot and submit.
9. In MongoDB Orders, confirm:
   couponCode = LEAN10
   originalPrice = 199
   discountAmount = 19.9
   selectedPrice = 179.1

NOTE
----
The existing frontend uses "Diet + Workout" while the old backend only listed "Diet + Workout Plan".
This patch safely accepts both names so the existing Diet + Workout payment flow continues working.
