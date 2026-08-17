import { Metadata } from "next";
import { ClientHome } from "@/components/home/ClientHome";

export const metadata: Metadata = {
  title: "Home",
  description: "Find & Hire The Best Interior Experts, Contractors, and Suppliers in Bihar. Compare quotes and save up to 30% on your next home project.",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-background relative pb-16 md:pb-0">
      <ClientHome />
      
      {/* Homepage SEO Block */}
      <section className="container mx-auto px-4 py-8 md:py-12 mt-8 border-t border-slate-100 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto text-[11px] md:text-xs text-slate-400 dark:text-slate-500 leading-relaxed text-justify">
          <h2 className="text-sm font-semibold mb-2 text-slate-500 dark:text-slate-400">Bihar's Leading Network for Interior Design & Construction</h2>
          <p>
            FindMyInterior is your trusted platform to connect with the <strong>Best Interior Designer</strong> and top-rated <strong>Interior Designers in Patna</strong>. 
            Whether you are looking for an <strong>Interior Designer Near Me</strong> for a quick room makeover, a specialized <strong>Modular Kitchen Designer</strong>, 
            or a full-service <strong>Interior Design Company</strong> for extensive <strong>Home Interior Design</strong>, our verified professionals have you covered. 
            We also feature expert <strong>Wardrobe Designers</strong>, <strong>False Ceiling Contractors</strong>, and seasoned <strong>Commercial Interior Designers</strong> for office spaces.
          </p>
          <p className="mt-2">
            Beyond aesthetics, we help you find reliable contractors for core structural work. Search for a <strong>Civil Contractor Near Me</strong>, 
            <strong>Building Contractor</strong>, or a specialized <strong>House Construction Contractor</strong>. If you are renovating, easily hire a 
            <strong>Renovation Contractor</strong>, <strong>Painting Contractor</strong>, <strong>Plumbing Contractor</strong>, or <strong>Electrical Contractor</strong>. 
            For hassle-free end-to-end execution, choose a <strong>Turnkey Interior Contractor</strong> to handle all <strong>Home Renovation Services</strong> and <strong>Home Improvement Services</strong>.
          </p>
          <p className="mt-2">
            Looking to buy a new property? Connect directly with top <strong>Builders in Patna</strong>, reputable <strong>Real Estate Developers</strong>, 
            and leading <strong>Residential Builders</strong>. Browse exclusive <strong>Apartment Projects</strong> and luxury <strong>Villa Builders</strong> across Bihar.
          </p>
        </div>
      </section>
    </div>
  );
}

