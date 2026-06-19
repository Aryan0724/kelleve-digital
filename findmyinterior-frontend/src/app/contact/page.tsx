import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Find My Interior",
  description: "Get in touch with Find My Interior for support, business inquiries, or assistance with finding professionals in Bihar.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a1c3a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            We're here to help! Whether you're a homeowner looking for services or a professional wanting to grow your business.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <p className="text-slate-600 mb-8">
                Have a question about our platform or need assistance? Fill out the form or reach out to us directly using the information below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Office Address</h4>
                  <p className="text-slate-600 mt-1">
                    Find My Interior HQ<br />
                    Boring Road, Patna<br />
                    Bihar - 800001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Phone</h4>
                  <p className="text-slate-600 mt-1">
                    +91 99999 99999<br />
                    <span className="text-sm text-slate-500">Mon-Fri, 9am - 6pm</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Email Support</h4>
                  <p className="text-slate-600 mt-1">
                    support@findmyinterior.com<br />
                    business@findmyinterior.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-xl border">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Write your message here..." className="h-32" />
              </div>
              <Button type="button" className="w-full bg-[#E8701A] hover:bg-orange-700 h-12 text-base font-semibold text-white">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-slate-200 w-full h-[400px] rounded-xl flex items-center justify-center flex-col border border-slate-300">
           <MapPin className="w-12 h-12 text-slate-400 mb-4" />
           <p className="text-slate-500 font-medium text-lg">Interactive Map Placeholder</p>
           <p className="text-slate-400 text-sm">Google Maps iframe to be embedded here</p>
        </div>

      </div>
    </div>
  );
}
