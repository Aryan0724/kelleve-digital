export const metadata = { title: "Terms of Service | Find My Interior" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
      <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
        <p className="font-semibold">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          Welcome to Find My Interior. These Terms of Service ("Terms") govern your access to and use of the Find My Interior website, services, and applications (collectively, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">1. Description of Services</h2>
        <p>
          Find My Interior is a digital marketplace connecting homeowners, property developers, and businesses ("Customers") with interior designers, architects, suppliers, and skilled workers ("Professionals"). We provide a platform for these parties to connect, negotiate, and transact. We are not a party to any contract or agreement entered into between Customers and Professionals.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">2. User Accounts & Verification</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must be at least 18 years old to create an account.</li>
          <li>You are responsible for safeguarding your account credentials and for all activities that occur under your account.</li>
          <li>Professionals may undergo a verification process (KYC, Business Registration, etc.). However, Find My Interior does not guarantee the quality, safety, or legality of the services provided by Professionals.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">3. Fees and Payments</h2>
        <p>
          Registration on the Platform is generally free. However, certain actions (like unlocking leads, submitting bids, or premium subscriptions) may incur fees.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Wallet System:</strong> Users may add funds to their Find My Interior Wallet to pay for these services. Wallet funds are non-transferable and subject to our Refund Policy.</li>
          <li><strong>Project Payments:</strong> Find My Interior may offer milestone-based escrow payments. In such cases, funds are held securely until the agreed-upon milestone is approved by the Customer.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">4. User Conduct</h2>
        <p>You agree not to use the Platform to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violate any local, state, national, or international law or regulation.</li>
          <li>Circumvent the Platform's payment systems to avoid paying fees.</li>
          <li>Harass, threaten, or defraud other users.</li>
          <li>Submit false, misleading, or inaccurate information in your profile or bids.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">5. Dispute Resolution</h2>
        <p>
          In the event of a dispute between a Customer and a Professional, users are encouraged to communicate directly to resolve the issue. If the dispute involves milestone payments held by Find My Interior, we may, at our sole discretion, mediate the dispute. However, we are not legally obligated to resolve disputes between users.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, Find My Interior and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from (a) your use of or inability to use the Platform; (b) any conduct or content of any third party on the Platform; or (c) unauthorized access, use, or alteration of your transmissions or content.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">7. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on the Platform. Your continued use of the Platform after the effective date of the revised Terms constitutes your acceptance of the terms.
        </p>
      </div>
    </div>
  );
}
