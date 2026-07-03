export const metadata = { title: "Dispute Resolution | Find My Interior" };

export default function DisputeResolutionPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Dispute Resolution</h1>
      <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
        <p>
          At <strong>Find My Interior</strong>, we strive to ensure that all projects are completed smoothly and to the satisfaction of both customers and professionals. However, we understand that disagreements can occur. This Dispute Resolution Policy outlines how we handle such situations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Step 1: Direct Communication</h2>
        <p>
          We strongly encourage customers and professionals to communicate directly to resolve any issues. Most disputes arise from miscommunication or misaligned expectations and can be resolved through open dialogue via our platform's messaging system.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Step 2: Platform Mediation (For Escrow Projects)</h2>
        <p>
          If a resolution cannot be reached directly, and the project involves our milestone-based escrow payment system, either party can request mediation from Find My Interior support.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Submission:</strong> The requesting party must submit a detailed account of the dispute, including all relevant communications, contracts, and photographic evidence.</li>
          <li><strong>Review:</strong> Our dispute resolution team will review the submitted evidence, the original project requirements, and the accepted bid terms.</li>
          <li><strong>Decision:</strong> We will make a binding decision regarding the release of funds held in escrow. Funds may be released to the professional, refunded to the customer, or split proportionally based on the completed work.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Non-Escrow Projects</h2>
        <p>
          For projects or transactions conducted entirely outside of our milestone-based escrow system, Find My Interior is <strong>not</strong> responsible for dispute resolution or financial recovery. However, we take user safety seriously. If a professional is found to be engaging in fraudulent or unethical behavior, their account will be permanently banned from the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">Contacting Support</h2>
        <p>To initiate a dispute resolution request for an escrowed project, please contact us at:</p>
        <p>
          Email: disputes@findmyinterior.com<br/>
          Please include your Project ID and User ID in the subject line.
        </p>
      </div>
    </div>
  );
}
