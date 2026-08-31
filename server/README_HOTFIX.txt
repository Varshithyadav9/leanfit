LeanFit Render hotfix

Render error:
Cannot find module server/middleware/authMiddleware.js

Copy this file into your project at:
server/middleware/authMiddleware.js

IMPORTANT: Keep the newer file too:
server/middleware/adminAuthMiddleware.js

Your middleware folder should contain BOTH files.

Then run:
git add server/middleware/authMiddleware.js
git commit -m "Restore customer auth middleware"
git push

Render should redeploy automatically.
