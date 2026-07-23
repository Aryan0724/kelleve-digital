import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientSearch from "./ClientSearch";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <ClientSearch />
      <Footer />
    </div>
  );
}
