"use client";

import { useState } from "react";
import { CalendarDays, UtensilsCrossed, Wrench, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentModal from "./AppointmentModal";
import TableReservationModal from "./TableReservationModal";
import ServiceRequestModal from "./ServiceRequestModal";
import QuoteRequestModal from "./QuoteRequestModal";

interface Props {
  businessName: string;
  businessSlug: string;
  /** The primary category string from the listing, e.g. "Restaurants", "Hospitals", "Plumber" */
  category: string;
}

type ModalType = "appointment" | "reservation" | "service" | "quote" | "inquiry" | null;

function detectBookingType(category: string): ModalType {
  const c = category?.toLowerCase() || "";
  if (/doctor|physician|dental|dentist|hospital|clinic|derma|paedia|gynae|ortho|eye|psychiatr|cardio|pharma|diagnostic/i.test(c)) return "appointment";
  if (/restaurant|cafe|coffee|bakery|food|dhaba|cloud kitchen|catering|juice|banquet|dining/i.test(c)) return "reservation";
  if (/plumb|electric|ac|repair|carpenter|pest|clean|cctv|mechanic|inverter|mover|packers|handyman|service/i.test(c)) return "service";
  if (/interior|architect|builder|contractor|modular|furniture|material|real estate|vastu|painting|renovation/i.test(c)) return "quote";
  return "inquiry";
}

const CTA_CONFIG = {
  appointment: { label: "Book Appointment", icon: CalendarDays, color: "bg-blue-600 hover:bg-blue-700" },
  reservation: { label: "Reserve a Table", icon: UtensilsCrossed, color: "bg-amber-600 hover:bg-amber-700" },
  service: { label: "Request Service", icon: Wrench, color: "bg-emerald-600 hover:bg-emerald-700" },
  quote: { label: "Get Free Quote", icon: FileText, color: "bg-purple-600 hover:bg-purple-700" },
  inquiry: { label: "Send Inquiry", icon: MessageSquare, color: "bg-[#E8701A] hover:bg-[#E8701A]/90" },
};

export default function BookingCTA({ businessName, businessSlug, category }: Props) {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const bookingType = detectBookingType(category);
  const config = CTA_CONFIG[bookingType || "inquiry"];
  const Icon = config.icon;

  return (
    <>
      <Button
        onClick={() => setOpenModal(bookingType)}
        className={`w-full h-12 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 justify-center transition-all ${config.color}`}
      >
        <Icon className="w-5 h-5" />
        {config.label}
      </Button>

      {openModal === "appointment" && (
        <AppointmentModal businessName={businessName} businessSlug={businessSlug} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "reservation" && (
        <TableReservationModal businessName={businessName} businessSlug={businessSlug} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "service" && (
        <ServiceRequestModal businessName={businessName} businessSlug={businessSlug} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "quote" && (
        <QuoteRequestModal businessName={businessName} businessSlug={businessSlug} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "inquiry" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Send Inquiry</h2>
            <p className="text-sm text-muted-foreground mb-4">Use the contact form below to reach <strong>{businessName}</strong> directly.</p>
            <Button onClick={() => setOpenModal(null)} className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white rounded-xl">Close</Button>
          </div>
        </div>
      )}
    </>
  );
}
