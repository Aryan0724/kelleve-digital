import { ArrowRight, ShoppingBag, Truck, Percent } from "lucide-react";
import Link from "next/link";

interface B2BCrossSellWidgetProps {
  categoryType: string;
}

export default function B2BCrossSellWidget({ categoryType }: B2BCrossSellWidgetProps) {
  let recommendations = [];

  if (categoryType === "real_estate") {
    recommendations = [
      { name: "Supreme Cements Wholesale", desc: "Save 15% on bulk orders", icon: Truck },
      { name: "Veneer & Plywood Direct", desc: "B2B rates applied", icon: ShoppingBag },
    ];
  } else if (categoryType === "restaurant") {
    recommendations = [
      { name: "FreshFarm Bulk Groceries", desc: "Next-day delivery", icon: Truck },
      { name: "EcoPack Containers", desc: "Save 20% on takeaway packaging", icon: Percent },
    ];
  } else if (categoryType === "medical") {
    recommendations = [
      { name: "MediSupply Wholesale", desc: "Surgicals & Gloves in bulk", icon: ShoppingBag },
      { name: "BioWaste Solutions", desc: "B2B pickup service", icon: Truck },
    ];
  } else {
    // Service worker or general
    recommendations = [
      { name: "Hardware Pro Hub", desc: "Tools and spare parts at wholesale", icon: ShoppingBag },
    ];
  }

  return (
    <div className="premium-card rounded-xl overflow-hidden mt-6">
      <div className="p-5 border-b border-border bg-gradient-to-r from-emerald-500/10 to-transparent">
        <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-500" /> B2B Supply Chain Loop
        </h3>
        <p className="text-xs text-muted-foreground mt-1">Recommended wholesale suppliers on TrueDial based on your recent jobs.</p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:border-emerald-500/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <rec.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{rec.name}</h4>
                <p className="text-xs text-muted-foreground">{rec.desc}</p>
              </div>
            </div>
            <Link href="/search?category=B2B">
              <button className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full font-bold transition">
                Order
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
