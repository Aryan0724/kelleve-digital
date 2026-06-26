const fs = require('fs');
const path = require('path');
const dir = 'src/components/dashboard/roles';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Dashboard.tsx') && f !== 'HomeownerDashboard.tsx' && f !== 'DesignerDashboard.tsx');
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/import \{ ProfileTab \} from .+/g, 'import { CompleteProfileTab } from "@/components/dashboard/CompleteProfileTab";');
  content = content.replace(/import \{ VerificationTab \} from .+\n/g, '');
  content = content.replace(/import \{ PortfolioTab \} from .+\n/g, '');
  
  content = content.replace(/<UnverifiedBanner onVerifyClick=\{\(\) => setActiveTab\('verification'\)\} \/>/g, "{activeTab !== 'profile' && <UnverifiedBanner onVerifyClick={() => setActiveTab('profile')} />}");
  
  // Remove verification tab render
  content = content.replace(/\{activeTab === 'verification'.+\n/g, '');
  content = content.replace(/\{activeTab === 'portfolio'.+\n/g, '');
  
  // Replace ProfileTab render
  content = content.replace(/<ProfileTab \/>/g, '<CompleteProfileTab />');
  
  // Update sidebar buttons
  content = content.replace(/\{renderSidebarButton\(\"verification\".+\n/g, '');
  content = content.replace(/\{renderSidebarButton\(\"profile\", <User className=\"h-5 w-5\" \/>, \"[^\"]+\"\)\}/g, '{renderSidebarButton("profile", <User className="h-5 w-5" />, "Complete Profile")}');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', file);
}
