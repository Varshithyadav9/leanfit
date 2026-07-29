const templates = [
  ["Welcome", "Welcome to LeanFit", "Your account is ready. Complete your profile to continue with your personalized fitness plan."],
  ["Order received", "We received your LeanFit order", "Your order has been recorded and is waiting for payment verification."],
  ["Payment verified", "Your LeanFit payment is verified", "Your payment was approved and your personalized plan is being prepared."],
  ["Plan ready", "Your LeanFit plan is ready", "Your plan is now available in the Customer Portal. You may also receive it through WhatsApp."],
];
function EmailTemplates({ setPage }) {
  return <main className="admin-page"><section className="admin-header"><div><p className="brand-label">LEANFIT ADMIN</p><h2>Email Template Library</h2><p>Ready for future use after connecting a verified sending domain.</p></div><button className="secondary-btn" onClick={() => setPage("admin")}>Back to Admin</button></section>
  <section className="template-grid">{templates.map(([name,subject,body])=><article className="template-card" key={name}><span>{name}</span><h3>{subject}</h3><p>Hello {"{{name}}"},</p><p>{body}</p><p><strong>Order ID:</strong> {"{{orderId}}"}</p><small>LeanFit • Eat • Train • Transform</small></article>)}</section></main>;
}
export default EmailTemplates;
