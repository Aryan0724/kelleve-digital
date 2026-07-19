import { ShieldAlert, PhoneCall, Mail, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpAndSupportPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How can we help you today?</h1>
          <p className="text-lg text-slate-600">Find answers to common questions or reach out to our support team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 border-indigo-100 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <PhoneCall className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
              <CardTitle>Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Our support team is available Mon-Fri, 9am - 6pm.</p>
              <a href="tel:+918888888888" className="text-indigo-600 font-bold hover:underline">+91 88888 88888</a>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-indigo-100 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <Mail className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@findmyinterior.com" className="text-indigo-600 font-bold hover:underline">support@findmyinterior.com</a>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-indigo-100 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <ShieldAlert className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
              <CardTitle>Trust & Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Report an issue with a professional or a listing.</p>
              <a href="/contact" className="text-indigo-600 font-bold hover:underline">Report Issue</a>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> How do I post a requirement?
              </h3>
              <p className="text-slate-600 pl-7">You can click on the "Post Requirement" button in the navigation bar, fill in the details of your project, and start receiving bids from verified professionals.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> How do I list my business?
              </h3>
              <p className="text-slate-600 pl-7">Register as a professional. Once logged in, go to your dashboard and look for the "Business Listing" section to create and publish your public profile.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Are the professionals verified?
              </h3>
              <p className="text-slate-600 pl-7">Yes, we conduct background checks and verify the identity and credentials of professionals before awarding them a "Verified" badge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
