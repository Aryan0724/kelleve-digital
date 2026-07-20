import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, MapPin, Phone, Mail, Globe, Clock, ShieldCheck, Share2, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function BusinessProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Gallery Area */}
      <div className="h-[40vh] md:h-[50vh] bg-navy relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="w-full md:w-auto animate-fade-in-up">
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 mb-4 backdrop-blur-md border border-primary/20"><Star className="w-3 h-3 mr-1 fill-primary"/> TRUEDIAL Premium</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-navy dark:text-white mb-2">The Grand Palace Restaurant</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Kankarbagh, Patna</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary"/> 4.9 (128 Reviews)</span>
                <span className="flex items-center gap-1"><Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-0 h-6"><ShieldCheck className="w-3 h-3 mr-1"/> Verified</Badge></span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <Button size="icon" variant="outline" className="bg-background/50 backdrop-blur-md border-border text-foreground hover:bg-background/80 rounded-full h-12 w-12"><Share2 className="w-5 h-5"/></Button>
              <Button size="icon" variant="outline" className="bg-background/50 backdrop-blur-md border-border text-foreground hover:bg-background/80 rounded-full h-12 w-12"><Heart className="w-5 h-5"/></Button>
              <Button size="lg" className="rounded-full h-12 px-8 shadow-lg shadow-primary/20">Contact Business</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-background py-12 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="premium-card p-8 rounded-xl animate-fade-in">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">About the Business</h2>
            <p className="text-muted-foreground leading-relaxed">
              Premium dining experience offering authentic North Indian, Chinese, and Continental cuisines. Perfect for family gatherings and corporate events. We pride ourselves on sourcing the freshest ingredients and providing world-class hospitality to our guests.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline">Fine Dining</Badge>
              <Badge variant="outline">Valet Parking</Badge>
              <Badge variant="outline">Private Dining</Badge>
              <Badge variant="outline">Live Music</Badge>
            </div>
          </section>

          <section className="premium-card p-8 rounded-xl animate-fade-in">
            <h2 className="text-xl font-bold text-navy dark:text-white mb-6">Ratings & Reviews</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-navy dark:text-white">4.9</div>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <div className="text-sm text-muted-foreground">128 Ratings</div>
              </div>
              <div className="flex-1 space-y-2">
                {/* Rating bars */}
                {[5,4,3,2,1].map(num => (
                  <div key={num} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{num}</span>
                    <Star className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{width: num === 5 ? '80%' : num === 4 ? '15%' : '2%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full"><MessageSquare className="w-4 h-4 mr-2" /> Write a Review</Button>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="premium-card p-6 rounded-xl animate-fade-in-up" style={{animationDelay: "0.2s"}}>
            <h3 className="font-bold text-navy dark:text-white mb-6 border-b border-border pb-2">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Plot 42, Main Road, Kankarbagh, Patna, Bihar 800020</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">contact@grandpalace.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-primary cursor-pointer hover:underline">www.grandpalace.com</span>
              </li>
            </ul>
          </div>

          <div className="premium-card p-6 rounded-xl animate-fade-in-up" style={{animationDelay: "0.3s"}}>
            <h3 className="font-bold text-navy dark:text-white mb-6 border-b border-border pb-2">Operating Hours</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between items-center"><span className="font-medium">Monday</span> <span>11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">Tuesday</span> <span>11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">Wednesday</span> <span>11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">Thursday</span> <span>11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">Friday</span> <span>11:00 AM - 11:30 PM</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">Saturday</span> <span>11:00 AM - 11:30 PM</span></li>
              <li className="flex justify-between items-center text-primary"><span className="font-medium">Sunday</span> <span>11:00 AM - 11:30 PM</span></li>
            </ul>
          </div>
          
          <div className="premium-card p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border-primary/20 animate-fade-in-up" style={{animationDelay: "0.4s"}}>
             <h3 className="font-bold text-navy dark:text-white mb-2">Request a Quote</h3>
             <p className="text-xs text-muted-foreground mb-4">Send a direct message to this business for specific inquiries.</p>
             <div className="space-y-3">
               <Input placeholder="Your Name" className="bg-background" />
               <Input placeholder="Phone Number" className="bg-background" />
               <textarea className="w-full bg-background border border-border rounded-md p-3 text-sm outline-none focus:ring-1 focus:ring-primary h-24 resize-none" placeholder="Message / Requirement"></textarea>
               <Button className="w-full">Send Message</Button>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
