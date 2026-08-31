import { useEffect, useRef, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/lean_varshith/";
const INSTAGRAM_HANDLE = "@lean_varshith";
// Add your phone/WhatsApp number here when you want it shown to customers.
const SUPPORT_PHONE = "";

const QUICK_QUESTIONS = [
  "How do I make a payment?",
  "How does Lean Pro work?",
  "How do I renew for ₹99?",
  "Where is my order/PDF?",
];

function getAssistantReply(question) {
  const q = question.toLowerCase();

  if (q.includes("payment") || q.includes("upi") || q.includes("pay")) {
    return "For payment help, use the UPI option shown on the payment page, complete the payment, upload your screenshot and submit it. Your order will remain pending until admin verification.";
  }
  if (q.includes("99") || q.includes("renew") || q.includes("expiry") || q.includes("expire")) {
    return "Lean Pro renewal is ₹99 for another 90 days. The renewal option appears in your Customer Portal when your current access is close to expiry or has expired. Admin approval is required after payment.";
  }
  if (q.includes("login") || q.includes("password")) {
    return "Use the email ID or mobile number registered with LeanFit. If you still cannot log in, contact LeanFit support.";
  }
  if (q.includes("order") || q.includes("pdf")) {
    return "You can track orders and download completed plans from the Customer Portal. Pending orders need admin verification first.";
  }
  if (q.includes("dashboard") || q.includes("pro")) {
    return "Lean Pro Dashboard is available while your approved Pro access is active. Your dashboard shows the expiry date and remaining days.";
  }

  return "I can help with LeanFit payments, UPI, orders, PDFs, login, Lean Pro access and ₹99 renewal. Ask me about any of these, or choose a quick question below.";
}

function HelpButton({ variant = "default" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      from: "bot",
      text: "Hi! I'm LeanFit Assistant. How can I help you?",
    },
  ]);
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const askAssistant = (text = question) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion) return;

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, from: "user", text: cleanQuestion },
      { id: `${Date.now()}-bot`, from: "bot", text: getAssistantReply(cleanQuestion) },
    ]);
    setQuestion("");
  };

  const phoneHref = SUPPORT_PHONE ? `tel:${SUPPORT_PHONE.replace(/\s+/g, "")}` : "";

  return (
    <>
      <style>{`
        .lf-chat-root { position: fixed; right: 18px; bottom: 18px; z-index: 1000; }
        .lf-chat-trigger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(31,157,85,.35);
          background: #fff;
          color: #126f3b;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .lf-chat-trigger.light {
          border-color: rgba(255,255,255,.3);
          background: rgba(255,255,255,.08);
          color: #fff;
        }
        .lf-chat-trigger-icon {
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: currentColor;
          color: inherit;
          font-size: 11px;
        }
        .lf-chat-trigger-icon::after { content: "?"; color: #fff; }
        .lf-chat-panel {
          position: fixed;
          right: 18px;
          bottom: 72px;
          width: min(360px, calc(100vw - 28px));
          height: min(560px, calc(100dvh - 100px));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
          color: #0b172a;
          border: 1px solid #d7e0e8;
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(9,25,43,.22);
        }
        .lf-chat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #0b172a, #123e3a);
          color: #fff;
        }
        .lf-chat-head-title { font-weight: 800; font-size: 15px; }
        .lf-chat-head-sub { margin-top: 2px; font-size: 11px; opacity: .78; }
        .lf-chat-close {
          width: 30px;
          height: 30px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 50%;
          background: rgba(255,255,255,.08);
          color: #fff;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        }
        .lf-chat-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 14px;
          background: #f7f9fb;
        }
        .lf-chat-message { display: flex; margin-bottom: 10px; }
        .lf-chat-message.user { justify-content: flex-end; }
        .lf-chat-bubble {
          max-width: 86%;
          padding: 9px 11px;
          border-radius: 14px 14px 14px 4px;
          background: #fff;
          border: 1px solid #dce5ec;
          font-size: 13px;
          line-height: 1.45;
        }
        .lf-chat-message.user .lf-chat-bubble {
          border-radius: 14px 14px 4px 14px;
          background: #159447;
          border-color: #159447;
          color: #fff;
        }
        .lf-chat-quick {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding: 9px 12px;
          border-top: 1px solid #e5ebf0;
          background: #fff;
        }
        .lf-chat-chip {
          flex: 0 0 auto;
          border: 1px solid #d7e0e8;
          border-radius: 999px;
          background: #f7fafc;
          color: #183047;
          padding: 7px 9px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }
        .lf-chat-contact {
          display: flex;
          gap: 8px;
          padding: 0 12px 10px;
          background: #fff;
        }
        .lf-chat-contact a {
          flex: 1;
          text-align: center;
          text-decoration: none;
          border: 1px solid #d7e0e8;
          border-radius: 9px;
          padding: 7px 8px;
          color: #126f3b;
          font-size: 11px;
          font-weight: 800;
        }
        .lf-chat-input {
          display: flex;
          gap: 7px;
          padding: 10px 12px 12px;
          border-top: 1px solid #e5ebf0;
          background: #fff;
        }
        .lf-chat-input input {
          min-width: 0;
          flex: 1;
          border: 1px solid #cbd6df;
          border-radius: 10px;
          padding: 9px 10px;
          font-size: 13px;
          outline: none;
        }
        .lf-chat-input button {
          border: 0;
          border-radius: 10px;
          padding: 0 13px;
          background: #159447;
          color: #fff;
          font-weight: 800;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          .lf-chat-root {
            right: 14px;
            bottom: max(14px, env(safe-area-inset-bottom));
          }
          .lf-chat-panel {
            right: 10px;
            bottom: calc(68px + env(safe-area-inset-bottom));
            width: calc(100vw - 20px);
            height: min(68dvh, 520px);
            min-height: 390px;
            border-radius: 18px;
          }
          .lf-chat-head { padding: 12px 14px; }
          .lf-chat-messages { padding: 12px; }
          .lf-chat-quick { padding: 8px 10px; }
          .lf-chat-contact { padding: 0 10px 8px; }
          .lf-chat-input { padding: 9px 10px 10px; }
          .lf-chat-trigger {
            width: 46px;
            height: 46px;
            justify-content: center;
            padding: 0;
            box-shadow: 0 8px 24px rgba(9,25,43,.18);
          }
          .lf-chat-trigger-label { display: none; }
        }
        @media (max-width: 600px) and (max-height: 620px) {
          .lf-chat-panel { height: calc(100dvh - 92px); min-height: 0; }
        }
      `}</style>

      <div className="lf-chat-root">
        <button
          type="button"
          className={`lf-chat-trigger ${variant === "light" ? "light" : ""}`}
          onClick={() => setOpen(true)}
          aria-label="Open LeanFit Help chat"
        >
          <span className="lf-chat-trigger-icon" aria-hidden="true" />
          <span className="lf-chat-trigger-label">Help</span>
        </button>

        {open && (
          <div className="lf-chat-panel" role="dialog" aria-label="LeanFit Help chat">
            <div className="lf-chat-head">
              <div>
                <div className="lf-chat-head-title">LeanFit Assistant</div>
                <div className="lf-chat-head-sub">Help with LeanFit plans, payments, orders and account access</div>
              </div>
              <button type="button" className="lf-chat-close" onClick={() => setOpen(false)} aria-label="Close help">×</button>
            </div>

            <div className="lf-chat-messages" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`lf-chat-message ${message.from}`}>
                  <div className="lf-chat-bubble">{message.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="lf-chat-quick" aria-label="Quick questions">
              {QUICK_QUESTIONS.map((item) => (
                <button key={item} type="button" className="lf-chat-chip" onClick={() => askAssistant(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="lf-chat-contact">
              {phoneHref ? (
                <a href={phoneHref}>Call Support</a>
              ) : (
                <a href={`https://www.instagram.com/lean_varshith/`} target="_blank" rel="noreferrer">Instagram {INSTAGRAM_HANDLE}</a>
              )}
              {phoneHref && (
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
              )}
            </div>

            <div className="lf-chat-input">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") askAssistant();
                }}
                placeholder="Ask LeanFit anything..."
                aria-label="Ask LeanFit Assistant"
              />
              <button type="button" onClick={() => askAssistant()}>Send</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HelpButton;
