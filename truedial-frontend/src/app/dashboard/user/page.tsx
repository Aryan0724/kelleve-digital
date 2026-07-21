import { CreditCard, ShieldCheck, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://findmyinterior.com/api/v1";

async function getPrivilegeCard() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return null;
  
  try {
    const res = await fetch(`${API_BASE}/privilege-cards`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      next: { revalidate: 0 }
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (e) {
    return null;
  }
}

export default async function UserDashboard() {
  const card = await getPrivilegeCard();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">My Privilege Card</h1>
        <p className="text-muted-foreground text-sm mt-1">Access exclusive discounts across top verified businesses in multiple cities.</p>
      </div>

      <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
        
        {/* Card Content */}
        <div className="relative z-10 p-8 text-white h-72 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white text-navy rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-white/20">T</div>
              <span className="text-2xl font-bold tracking-wider">truedial</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold tracking-widest text-white/80 uppercase">Multi-City</div>
              <div className="text-lg font-bold text-primary">PRIVILEGE CARD</div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="text-sm text-white/70 tracking-widest mb-1">MEMBER ID</div>
            <div className="text-3xl font-mono tracking-widest drop-shadow-md">{card ? card.card_number : "TD-8492-4921"}</div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div>
              <div className="text-xs text-white/70 tracking-widest mb-1">MEMBER NAME</div>
              <div className="text-xl font-bold uppercase">Aryan Sharma</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/70 tracking-widest mb-1">VALID THRU</div>
              <div className="text-lg font-bold font-mono">{card ? new Date(card.valid_until).toLocaleDateString() : "12/26"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <Button className="w-full flex gap-2 h-12 shadow-lg shadow-primary/20"><Download className="w-4 h-4"/> Download Digital Card</Button>
        <div className="md:col-span-2 premium-card p-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Status: {card ? card.status : "Active"}</h4>
            <p className="text-xs text-muted-foreground">Your card is verified and ready to use at partner outlets.</p>
          </div>
        </div>
      </div>

      <div className="premium-card p-8 rounded-xl max-w-2xl mx-auto">
        <h3 className="font-bold text-navy dark:text-white mb-6 border-b border-border pb-2">How to use</h3>
        <ul className="space-y-4 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
            <p>Visit any TrueDial partner business (look for the TRUEDIAL Premium badge on their profile).</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
            <p>Show your digital Privilege Card on your phone before billing.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
            <p>Get instant flat discounts (up to 30%) on your total bill value.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
