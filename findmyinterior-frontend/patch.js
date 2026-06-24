const fs = require('fs');
const path = require('path');

const files = {
    'DesignerDashboard.tsx': 'available_leads',
    'ContractorDashboard.tsx': 'available_leads',
    'SupplierDashboard.tsx': 'available_leads',
    'WorkerDashboard.tsx': 'available_leads',
    'BuilderDashboard.tsx': 'overview'
};

for (const [fileName, defaultTab] of Object.entries(files)) {
    const filePath = path.join('src', 'components', 'dashboard', 'roles', fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('UnverifiedBanner')) {
        content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { UnverifiedBanner } from "@/components/dashboard/UnverifiedBanner";');
    }

    const useStateRegex = /const \[activeTab, setActiveTab\] = useState\(\(\) => \{[\s\S]*?return "[^"]+";\n  \}\);/;
    const replacement = `const isUnverified = user && !["verified_business", "trusted_professional", "elite_professional", "site_verified"].includes(user.verification_level || "");\n  const [activeTab, setActiveTab] = useState("${defaultTab}");`;
    content = content.replace(useStateRegex, replacement);

    if (!content.includes('<UnverifiedBanner')) {
        content = content.replace('<div className="lg:col-span-3 space-y-6">', '<div className="lg:col-span-3 space-y-6">\n            <UnverifiedBanner onVerifyClick={() => setActiveTab(\'verification\')} />');
    }

    if (defaultTab === 'available_leads') {
        const tabRegex = /\{activeTab === 'available_leads' && <AvailableLeadsTab leads=\{data\?\.recommended_leads\} \/>\}/;
        const tabReplacement = `{activeTab === 'available_leads' && (
              isUnverified ? (
                <div className="space-y-6 relative">
                  <div className="z-20 relative">
                    <VerificationTab onSwitchTab={setActiveTab} profileData={data} />
                  </div>
                  <div className="opacity-30 pointer-events-none relative z-10 select-none blur-sm">
                    <AvailableLeadsTab leads={data?.recommended_leads} />
                  </div>
                </div>
              ) : (
                <AvailableLeadsTab leads={data?.recommended_leads} />
              )
            )}`;
        content = content.replace(tabRegex, tabReplacement);
    } else {
        const overviewRegex = /<div className="grid grid-cols-2 md:grid-cols-4 gap-4">[\s\S]*?<\/div>/;
        const overviewMatch = content.match(overviewRegex);
        if (overviewMatch && !content.includes('isUnverified && <VerificationTab')) {
            const overviewReplacement = overviewMatch[0] + `\n            {activeTab === 'overview' && isUnverified && <VerificationTab onSwitchTab={setActiveTab} profileData={data} />}`;
            content = content.replace(overviewRegex, overviewReplacement);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Dashboards updated successfully!');
