import jwt from "jsonwebtoken";

export default function adminAuthMiddleware(req, res, next) {
  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token || !process.env.JWT_SECRET) return res.status(401).json({ success: false, message: "Admin login required." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required." });
    req.adminAuth = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Admin session expired. Please log in again." });
  }
}
