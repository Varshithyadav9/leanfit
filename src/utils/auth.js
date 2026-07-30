export function getStoredToken() {
  return localStorage.getItem("leanfitToken") || sessionStorage.getItem("leanfitToken") || "";
}

export function getStoredCustomer() {
  const raw = localStorage.getItem("leanfitCustomer") || sessionStorage.getItem("leanfitCustomer");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveSession(customer, token, remember = true) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("leanfitToken", token);
  storage.setItem("leanfitCustomer", JSON.stringify(customer));
}

export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem("leanfitToken");
    storage.removeItem("leanfitCustomer");
  }
}

function decodePayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(atob(base64).split("").map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
  } catch { return null; }
}

export function isSessionValid() {
  const token = getStoredToken();
  const payload = decodePayload(token);
  if (!token || !payload?.exp || payload.exp * 1000 <= Date.now()) {
    clearSession();
    return false;
  }
  return true;
}
