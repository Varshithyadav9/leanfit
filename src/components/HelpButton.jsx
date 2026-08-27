import { useEffect, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/lean_varshith/";
const INSTAGRAM_HANDLE = "@lean_varshith";
// Add your phone/WhatsApp number here when you want it shown to customers.
const SUPPORT_PHONE = "";

const FAQS = [
  {
    title: "Payment & UPI",
    body: "Choose your plan, pay through the displayed UPI option, then upload the payment screenshot. Your order stays pending until admin verification.",
  },
  {
    title: "Lean Pro access",
    body: "Lean Pro access is time-limited. Your dashboard shows the current status, expiry date and remaining days. After expiry, renewal is required.",
  },
  {
    title: "₹99 renewal",
    body: "The ₹99 Lean Pro renewal appears in the Customer Portal when your membership is close to expiry or has expired. After payment, upload the screenshot and wait for admin approval.",
  },
  {
    title: "Orders & PDFs",
    body: "Open Customer Portal to check order status and access completed plans. If an order is still pending, wait for admin verification.",
  },
  {
    title: "Login problem",
    body: "Use the same email ID or mobile number used during registration. If you still cannot log in, contact LeanFit support.",
  },
];

function getAssistantReply(question) {
  const q = question.toLowerCase();

  if (q.includes("payment") || q.includes("upi") || q.includes("pay")) {
    return "For payment help: use the UPI option on the payment page, complete the payment, upload the screenshot and submit it. The order will be sent for admin verification.";
  }
  if (q.includes("99") || q.includes("renew") || q.includes("expiry") || q.includes("expire")) {
    return "Lean Pro renewal is ₹99 for another 90 days. The renewal option is shown in your Customer Portal when your current access is close to expiry or already expired. Admin approval is required after payment.";
  }
  if (q.includes("login") || q.includes("password")) {
    return "Use the email ID or mobile number registered with LeanFit. If you still have trouble, use the support contact below.";
  }
  if (q.includes("order") || q.includes("pdf")) {
    return "You can track your order and download completed plans from the Customer Portal. Pending orders need admin verification first.";
  }
  if (q.includes("dashboard") || q.includes("pro")) {
    return "Lean Pro Dashboard is available only while your approved Lean Pro access is active. Check the dashboard for your expiry date and remaining days.";
  }

  return "I can help with LeanFit payments, UPI, orders, PDFs, login, Lean Pro access and ₹99 renewal. Try asking about one of these topics, or contact LeanFit support below.";
}

function HelpButton({ variant = "light" }) {
  const [open, setOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const askAssistant = () => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      setAnswer("Type your LeanFit question first.");
      return;
    }
    setAnswer(getAssistantReply(cleanQuestion));
  };

  const phoneHref = SUPPORT_PHONE ? `tel:${SUPPORT_PHONE.replace(/\s+/g, "")}` : "";

  return (
    <>
      <style>{`
        .lf-help-trigger {
          border: 1px solid rgba(31,157,85,.35);
          background: #fff;
          color: #147a40;
          border-radius: 10px;
          padding: 9px 13px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .lf-help-trigger.light {
          border-color: rgba(255,255,255,.28);
          background: rgba(255,255,255,.08);
          color: #fff;
        }
        .lf-help-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(7,17,31,.58);
          backdrop-filter: blur(4px);
        }
        .lf-help-modal {
          width: min(620px, 100%);
          max-height: min(720px, calc(100vh - 36px));
          overflow: auto;
          border: 1px solid #dfe6ee;
          border-radius: 20px;
          background: #fff;
          color: #101828;
          box-shadow: 0 24px 70px rgba(7,17,31,.28);
        }
        .lf-help-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 20px;
          border-bottom: 1px solid #edf0f4;
        }
        .lf-help-head h2 { margin: 0; font-size: 22px; }
        .lf-help-head p { margin: 5px 0 0; color: #667085; font-size: 13px; }
        .lf-help-close {
          width: 34px;
          height: 34px;
          border: 1px solid #dfe6ee;
          border-radius: 9px;
          background: #f8fafc;
          color: #344054;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        }
        .lf-help-body { padding: 18px 20px 20px; }
        .lf-help-section { margin-top: 18px; }
        .lf-help-section:first-child { margin-top: 0; }
        .lf-help-section h3 { margin: 0 0 10px; font-size: 15px; }
        .lf-help-faq { display: grid; gap: 8px; }
        .lf-help-faq button {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e3e8ef;
          border-radius: 11px;
          background: #f8fafc;
          color: #172033;
          text-align: left;
          font-weight: 750;
          cursor: pointer;
        }
        .lf-help-faq button:hover { transform: none; background: #f2f8f4; }
        .lf-help-answer {
          margin-top: -2px;
          padding: 12px 14px;
          border-left: 3px solid #1f9d55;
          background: #f2faf5;
          color: #475467;
          font-size: 13px;
          line-height: 1.55;
        }
        .lf-help-chat {
          display: grid;
          gap: 9px;
          padding: 14px;
          border: 1px solid #dce9e1;
          border-radius: 14px;
          background: #f6fbf8;
        }
        .lf-help-chat textarea {
          width: 100%;
          min-height: 76px;
          resize: vertical;
          padding: 11px 12px;
          border: 1px solid #d0d8e2;
          border-radius: 10px;
          background: #fff;
          color: #101828;
          font: inherit;
        }
        .lf-help-chat-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .lf-help-primary, .lf-help-secondary {
          border-radius: 10px;
          padding: 10px 13px;
          font-weight: 800;
          cursor: pointer;
        }
        .lf-help-primary { border: 0; background: #1f9d55; color: #fff; }
        .lf-help-secondary { border: 1px solid #d8e0e8; background: #fff; color: #172033; }
        .lf-help-chat-result { color: #475467; font-size: 13px; line-height: 1.55; }
        .lf-help-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }
        .lf-help-contact a, .lf-help-contact span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 38px;
          padding: 8px 12px;
          border: 1px solid #dfe6ee;
          border-radius: 10px;
          background: #fff;
          color: #147a40;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }
        .lf-help-note { margin: 8px 0 0; color: #667085; font-size: 12px; }
        @media (max-width: 560px) {
          .lf-help-overlay { padding: 10px; }
          .lf-help-modal { max-height: calc(100vh - 20px); border-radius: 16px; }
          .lf-help-head, .lf-help-body { padding-left: 15px; padding-right: 15px; }
          .lf-help-trigger { padding: 8px 10px; }
        }
      `}</style>

      <button
        type="button"
        className={`lf-help-trigger ${variant === "light" ? "light" : ""}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Help
      </button>

      {open && (
        <div className="lf-help-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="lf-help-modal" role="dialog" aria-modal="true" aria-labelledby="lf-help-title">
            <header className="lf-help-head">
              <div>
                <h2 id="lf-help-title">LeanFit Help & Support</h2>
                <p>Quick answers for payments, orders, Lean Pro and login.</p>
              </div>
              <button type="button" className="lf-help-close" onClick={() => setOpen(false)} aria-label="Close help">×</button>
            </header>

            <div className="lf-help-body">
              <section className="lf-help-section">
                <h3>Quick Help</h3>
                <div className="lf-help-faq">
                  {FAQS.map((faq, index) => (
                    <div key={faq.title}>
                      <button
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        aria-expanded={activeFaq === index}
                      >
                        {faq.title}
                      </button>
                      {activeFaq === index && <div className="lf-help-answer">{faq.body}</div>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="lf-help-section">
                <h3>Ask LeanFit Assistant</h3>
                <div className="lf-help-chat">
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Example: How do I renew Lean Pro?"
                    aria-label="Ask LeanFit Assistant"
                  />
                  <div className="lf-help-chat-actions">
                    <button type="button" className="lf-help-primary" onClick={askAssistant}>Ask</button>
                    <button type="button" className="lf-help-secondary" onClick={() => { setQuestion(""); setAnswer(""); }}>Clear</button>
                  </div>
                  {answer && <div className="lf-help-chat-result" aria-live="polite">{answer}</div>}
                </div>
                <p className="lf-help-note">For account-specific issues or anything the assistant cannot answer, contact LeanFit support.</p>
              </section>

              <section className="lf-help-section">
                <h3>Talk to LeanFit Support</h3>
                <div className="lf-help-contact">
                  {SUPPORT_PHONE ? (
                    <a href={phoneHref}>Phone / WhatsApp: {SUPPORT_PHONE}</a>
                  ) : null}
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram: {INSTAGRAM_HANDLE}</a>
                </div>
                {!SUPPORT_PHONE && <p className="lf-help-note">Phone/WhatsApp can be added after you provide the number.</p>}
              </section>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default HelpButton;
