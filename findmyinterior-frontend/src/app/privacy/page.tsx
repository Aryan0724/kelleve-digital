export const metadata = { title: "Privacy Policy | Find My Interior" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
        <p className="font-semibold">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At <strong>Find My Interior</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our marketplace services in India.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">1. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information that you voluntarily give to us when you register.</li>
          <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, your browser type, and your operating system.</li>
          <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, or request information about our services. All payments are processed by secure third-party payment gateways (e.g., Razorpay, Stripe) compliant with RBI regulations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">2. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create and manage your account.</li>
          <li>Facilitate connections between homeowners, interior designers, suppliers, and skilled workers.</li>
          <li>Process transactions and send related information, including transaction confirmations and invoices.</li>
          <li>Send administrative information to you, such as updates to our terms, conditions, and policies.</li>
          <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">3. Disclosure of Your Information</h2>
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process or to protect the rights, property, and safety of others.</li>
          <li><strong>Interactions with Other Users:</strong> If you interact with other users of the Site, those users may see your name, profile photo, and descriptions of your activity (such as project requirements or bids).</li>
          <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">4. Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900">5. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
        <p>
          <strong>Find My Interior</strong><br/>
          Patna, Bihar, India<br/>
          Email: privacy@findmyinterior.com
        </p>
      </div>
    </div>
  );
}
