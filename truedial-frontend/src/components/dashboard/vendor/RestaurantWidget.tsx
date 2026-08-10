import { Utensils, Star, TrendingUp, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function RestaurantWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Dine-in Reservations</h3>
            <p className="text-xs text-muted-foreground">Table bookings</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Tonight (7 PM - 10 PM)</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold text-xs">8 Tables</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Weekend Pre-bookings</span>
            <span className="font-bold text-foreground">24</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/crm" className="mt-4">
          <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">View Seating Chart</button>
        </Link>
      </div>

      <div className="premium-card p-6 rounded-xl flex flex-col justify-between bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-orange-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Menu & Reviews</h3>
            <p className="text-xs text-muted-foreground">Recent feedback</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium border-l-2 border-amber-500 pl-3 py-1">
            <span className="block text-foreground line-clamp-1">"Loved the butter chicken! highly recommended."</span>
            <span className="text-xs text-amber-600">5 Stars - 2 hrs ago</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/reputation" className="mt-4">
          <button className="w-full text-sm font-medium bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition flex items-center justify-center gap-2">
            Reply to Reviews
          </button>
        </Link>
      </div>
    </div>
  );
}
