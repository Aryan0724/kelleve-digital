import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="w-full py-24 bg-orange-600 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-orange-700 rounded-full blur-3xl opacity-50" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Are You a Home Professional?
        </h2>
        <p className="text-lg md:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
          Join Bihar's fastest-growing home improvement network. Get verified, showcase your portfolio, and receive highly qualified leads directly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold w-full sm:w-auto" render={<Link href="/join" />} nativeButton={false}>
            List Your Business Free
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold text-white border-white hover:bg-white hover:text-orange-600 w-full sm:w-auto" render={<Link href="/pricing" />} nativeButton={false}>
            View Premium Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
