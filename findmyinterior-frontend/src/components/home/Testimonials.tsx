"use client";

import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Rohit Sharma",
      city: "Patna",
      role: "Homeowner",
      text: "I was struggling to find a reliable contractor for my 3BHK interior in Patna. FindMyInterior helped me get 3 quotes within a day. The team I hired was professional and delivered on time.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=10"
    },
    {
      name: "Anjali Gupta",
      city: "Ranchi",
      role: "Restaurant Owner",
      text: "The platform's verified professionals badge gave me the confidence to hire an architect for my new cafe. The entire process was transparent, and the best price guarantee actually saved me money.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=11"
    },
    {
      name: "Vikram Singh",
      city: "Delhi NCR",
      role: "Real Estate Developer",
      text: "As a builder, I constantly need reliable suppliers and contractors. This platform has become my go-to marketplace for sourcing quality talent and materials quickly.",
      rating: 4.5,
      avatar: "https://i.pravatar.cc/150?u=12"
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-4">
          Trusted by Thousands
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our customers have to say about their experience finding professionals on our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {testimonials.map((test, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-300 relative group">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-100 dark:text-slate-800 group-hover:text-orange-50 dark:group-hover:text-orange-900/30 transition-colors" />
            
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, idx) => (
                <Star 
                  key={idx} 
                  className={`w-4 h-4 ${idx < Math.floor(test.rating) ? 'text-[#FF6B00] fill-[#FF6B00]' : 'text-slate-300 dark:text-slate-700 fill-slate-300 dark:fill-slate-700'}`} 
                />
              ))}
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8 relative z-10">
              "{test.text}"
            </p>
            
            <div className="flex items-center gap-4 mt-auto">
              <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover bg-slate-100" />
              <div>
                <h4 className="font-bold text-[#111827] dark:text-white text-sm">{test.name}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{test.role}, {test.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
