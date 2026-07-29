const pages = {
  privacy: {
    eyebrow: "LEGAL",
    title: "Privacy Policy",
    updated: "Last updated: July 2026",
    sections: [
      ["Information we collect", "LeanFit may collect your name, email address, mobile number, fitness goal, food preferences, lifestyle details, payment reference and progress information that you choose to provide."],
      ["How we use it", "We use this information to create and deliver your selected plan, provide account access, maintain order records, support progress tracking and respond to customer requests."],
      ["Payment information", "LeanFit does not ask for card PINs, UPI PINs or banking passwords. Payment screenshots are used only to verify manual payments."],
      ["Data sharing", "We do not sell customer information. Information may be processed by hosting, database and communication providers required to operate the service."],
      ["Your choices", "You may request correction or deletion of your account information by contacting LeanFit. Some records may be retained where reasonably required for payment, fraud prevention or legal compliance."],
      ["Security", "Reasonable technical measures are used to protect data, but no internet service can guarantee complete security."],
    ],
  },
  terms: {
    eyebrow: "LEGAL",
    title: "Terms & Conditions",
    updated: "Last updated: July 2026",
    sections: [
      ["Service", "LeanFit provides general fitness, nutrition and workout guidance based on information supplied by the customer."],
      ["Not medical advice", "LeanFit plans are educational guidelines and are not a diagnosis, prescription or substitute for medical care. Customers with injuries, medical conditions, pregnancy or dietary restrictions should consult a qualified professional."],
      ["Customer responsibility", "You are responsible for providing accurate information and for choosing exercises and foods that are safe and suitable for you."],
      ["Payments and delivery", "Manual payments are reviewed before a plan is marked verified. Delivery time may vary depending on payment verification and plan preparation."],
      ["Refunds", "Because personalized plans require preparation, refund eligibility is reviewed case by case before plan delivery. Contact LeanFit promptly if a payment was made incorrectly."],
      ["Acceptable use", "Do not misuse the service, attempt unauthorized access, copy paid plans for resale or submit false payment evidence."],
    ],
  },
  contact: {
    eyebrow: "SUPPORT",
    title: "Contact LeanFit",
    updated: "We usually respond within one business day.",
    sections: [
      ["WhatsApp", "Use the WhatsApp contact shared during your order process for payment verification, plan delivery and account support."],
      ["Email", "Add your official LeanFit support email here after creating it. Until then, use WhatsApp as the primary support channel."],
      ["Instagram", "You can also contact LeanFit through your official social profile. Never share passwords, OTPs, UPI PINs or banking credentials."],
      ["Before contacting us", "Keep your order ID, registered email address and mobile number ready so we can locate your order quickly."],
    ],
  },
  about: {
    eyebrow: "OUR STORY",
    title: "About LeanFit",
    updated: "Simple plans. Practical habits. Consistent progress.",
    sections: [
      ["Why LeanFit exists", "LeanFit was created to make diet and workout planning easier for normal people who want clear, affordable and realistic guidance."],
      ["Our approach", "Plans focus on familiar foods, practical training, flexible alternatives and progress habits that can fit everyday life."],
      ["What makes it different", "LeanFit brings plan delivery, customer orders and progress tracking together in one simple experience."],
      ["Our mission", "Help customers build a repeatable fitness routine without unnecessary complexity, extreme rules or confusing information."],
    ],
  },
};

function InfoPage({ type, setPage }) {
  const page = pages[type] || pages.about;
  return (
    <main className="info-page">
      <header className="simple-header">
        <img src="/leanfit-logo.png" alt="LeanFit" className="simple-logo" />
        <button className="secondary-btn" type="button" onClick={() => setPage("welcome")}>Back to Home</button>
      </header>
      <section className="info-hero">
        <p className="brand-label">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.updated}</p>
      </section>
      <section className="info-content">
        {page.sections.map(([heading, text]) => (
          <article className="info-section" key={heading}>
            <h2>{heading}</h2><p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
export default InfoPage;
