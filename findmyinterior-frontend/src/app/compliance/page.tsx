export const metadata = { title: "Trust & Safety Compliance | Find My Interior" };

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Trust & Safety Compliance</h1>
      <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
        <p>
          At <strong>Find My Interior</strong>, maintaining a secure and trustworthy marketplace for both homeowners and professionals is our top priority. We have implemented a rigorous verification and compliance framework to ensure peace of mind for all our users.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Professional Verification Process</h2>
        <p>Every professional on our platform undergoes a multi-tier verification process:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Verification:</strong> Professionals must submit government-issued identification (e.g., Aadhar, PAN) to verify their identity.</li>
          <li><strong>Business Verification:</strong> Businesses must provide valid GST registration and incorporation certificates to prove their legitimacy.</li>
          <li><strong>Address Verification:</strong> We conduct verification of the professional's registered business address.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Trust Metrics & Ratings</h2>
        <p>To promote transparency, we display a "Smart Bid Score" and comprehensive vendor metrics for every professional. This score is algorithmically generated based on:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Years of experience in the industry.</li>
          <li>Past project completion rate on the platform.</li>
          <li>Verified customer ratings and reviews.</li>
          <li>Level of document verification completed.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Secure Payments & Milestone Escrow</h2>
        <p>To protect both parties from fraud or non-payment, we offer a milestone-based escrow system for large projects.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Funds are deposited by the customer at the start of a milestone and held securely.</li>
          <li>Funds are only released to the professional once the customer approves the completed milestone work.</li>
          <li>All transactions are processed through RBI-compliant secure payment gateways.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Zero Tolerance Policy</h2>
        <p>We maintain a zero-tolerance policy against:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fraud, extortion, or misrepresentation of services.</li>
          <li>Harassment, abusive language, or discrimination.</li>
          <li>Bypassing the platform to avoid fees.</li>
        </ul>
        <p>Violating these guidelines will result in immediate account suspension or permanent banning.</p>
      </div>
    </div>
  );
}
