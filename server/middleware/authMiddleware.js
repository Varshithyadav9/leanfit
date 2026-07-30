import jwt from "jsonwebtoken";
export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return res.status(401).json({ success: false, message: "Login required." });
  if (!process.env.JWT_SECRET) return res.status(500).json({ success: false, message: "Server authentication is not configured." });
  try { req.customerAuth = jwt.verify(token, process.env.JWT_SECRET); return next(); }
  catch (error) {
    const message = error?.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid session. Please log in again.";
    return res.status(401).json({ success: false, message });
  }
}
