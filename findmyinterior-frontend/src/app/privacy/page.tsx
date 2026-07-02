export const metadata = { title: "Privacy Policy | Find My Interior" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>We respect your privacy. This policy outlines how your data is handled.</p>
        {/* Placeholder for actual policy */}
      </div>
    </div>
  );
}
