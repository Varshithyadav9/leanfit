import { useEffect, useMemo, useRef, useState } from "react";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function Notifications({ items = [], storageKey = "leanfitNotifications", title = "Notifications" }) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setReadIds(Array.isArray(saved) ? saved : []);
    } catch {
      setReadIds([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const close = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const normalized = useMemo(
    () => items.filter(Boolean).map((item, index) => ({
      id: String(item.id || `${item.title}-${index}`),
      title: item.title || "LeanFit update",
      message: item.message || "There is a new update for your account.",
      time: item.time || "Recently",
      type: item.type || "info",
    })),
    [items]
  );

  const unread = normalized.filter((item) => !readIds.includes(item.id)).length;

  const saveReadIds = (next) => {
    setReadIds(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const markRead = (id) => {
    if (!readIds.includes(id)) saveReadIds([...readIds, id]);
  };

  const markAllRead = () => saveReadIds(normalized.map((item) => item.id));

  return (
    <div className="notification-center" ref={rootRef}>
      <button
        className="notification-trigger"
        type="button"
        aria-label={`Open notifications. ${unread} unread`}
        onClick={() => setOpen((value) => !value)}
      >
        <BellIcon />
        {unread > 0 && <span className="notification-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <section className="notification-panel" aria-label={title}>
          <header className="notification-panel-head">
            <div>
              <strong>{title}</strong>
              <span>{unread} unread</span>
            </div>
            {unread > 0 && <button type="button" onClick={markAllRead}>Mark all as read</button>}
          </header>

          <div className="notification-list">
            {normalized.length === 0 ? (
              <div className="notification-empty">No notifications yet.</div>
            ) : normalized.map((item) => {
              const isRead = readIds.includes(item.id);
              return (
                <button
                  type="button"
                  className={`notification-item ${isRead ? "read" : "unread"}`}
                  key={item.id}
                  onClick={() => markRead(item.id)}
                >
                  <span className={`notification-type ${item.type}`} />
                  <span className="notification-copy">
                    <strong>{item.title}</strong>
                    <span>{item.message}</span>
                    <small>{item.time}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default Notifications;
