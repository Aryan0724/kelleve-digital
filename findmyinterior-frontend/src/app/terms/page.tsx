export const metadata = { title: "Terms of Service | Find My Interior" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Welcome to Find My Interior. These terms govern your use of our platform.</p>
        {/* Placeholder for actual terms */}
      </div>
    </div>
  );
}
