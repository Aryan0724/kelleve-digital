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
    </div>
  );
}

