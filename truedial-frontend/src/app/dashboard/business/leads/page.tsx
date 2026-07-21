import { Users, Phone, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  const mockLeads = [
    { id: 1, name: "Arjun Mehta", phone: "+91 9876543210", email: "arjun@example.com", message: "Hi, I am looking to book a table for 10 people next Friday. Do you have private dining?", status: "New", date: "2 mins ago" },
    { id: 2, name: "Sneha Kapoor", phone: "+91 9123456789", email: "sneha@example.com", message: "Can you share your latest brochure and pricing?", status: "Contacted", date: "2 hours ago" },
    { id: 3, name: "Rahul Verma", phone: "+91 9988776655", email: "rahul@example.com", message: "Need an emergency consultation.", status: "Closed", date: "1 day ago" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Leads & Inquiries</h1>
          <p className="text-muted-foreground">Manage and respond to customers who contacted you through TrueDial.</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/50 text-sm py-1 px-3">3 Total Leads</Badge>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/50 text-sm py-1 px-3">1 New</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {mockLeads.map((lead) => (
          <div key={lead.id} className="premium-card p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{lead.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {lead.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {lead.email}</span>
                    </div>
                  </div>
                </div>
                {lead.status === "New" && <Badge className="bg-primary text-white">New</Badge>}
                {lead.status === "Contacted" && <Badge className="bg-blue-500/20 text-blue-600 border border-blue-200">Contacted</Badge>}
                {lead.status === "Closed" && <Badge className="bg-gray-200 text-gray-600 border border-gray-300">Closed</Badge>}
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm text-foreground">
                <span className="font-medium block mb-1">Message:</span>
                "{lead.message}"
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-48 shrink-0">
              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mb-2">
                <Clock className="w-3 h-3" /> Received {lead.date}
              </div>
              {lead.status === "New" && (
                <>
                  <Button className="w-full">Mark Contacted</Button>
                  <Button variant="outline" className="w-full">Send SMS Reply</Button>
                </>
              )}
              {lead.status !== "New" && (
                <Button variant="outline" className="w-full">View History</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
