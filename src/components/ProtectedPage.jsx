import { useEffect } from "react";
import { isSessionValid } from "../utils/auth";
function ProtectedPage({ setPage, children }) {
  const valid = isSessionValid();
  useEffect(() => { if (!valid) setPage("login"); }, [valid, setPage]);
  return valid ? children : null;
}
export default ProtectedPage;
