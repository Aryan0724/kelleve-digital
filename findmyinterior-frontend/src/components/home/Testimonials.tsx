import React from "react";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Verma",
      location: "Patna, Bihar",
      image: "https://i.pravatar.cc/150?img=11",
      review: "I was struggling to find a reliable contractor for my home renovation. FindMyInterior helped me compare quotes and I ended up hiring a great team. The project was completed on time!",
      rating: 5,
    },
    {
      id: 2,
      name: "Sneha Singh",
      location: "Ranchi, Jharkhand",
      image: "https://i.pravatar.cc/150?img=9",
      review: "The modular kitchen expert we found here was exceptionally professional. They understood our requirements and delivered exactly what was promised within our budget.",
      rating: 5,
    },
    {
      id: 3,
      name: "Vikash Kumar",
      location: "Delhi NCR",
      image: "https://i.pravatar.cc/150?img=12",
      review: "As an NRI, getting work done back home was a nightmare until I used this platform. The transparency and regular updates from the interior designer gave me complete peace of mind.",
      rating: 4,
    }
  ];

  return (
    <div className="w-full flex flex-col bg-transparent lg:my-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
          Trusted by Homeowners
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          Real stories from people who transformed their spaces using our platform.
        </p>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
        {reviews.map((review) => (
          <div key={review.id} className="flex-shrink-0 w-[300px] lg:w-full snap-start bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 shadow-sm relative group hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:-translate-y-1 transition-all duration-300">
            <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100 dark:text-slate-700 group-hover:text-orange-50 dark:group-hover:text-orange-950 transition-colors" />
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-[#FF6B00] text-[#FF6B00]" : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"}`} />
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed italic relative z-10 min-h-[100px]">
              "{review.review}"
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
              <div>
                <h4 className="font-bold text-[#111827] dark:text-white leading-tight">{review.name}</h4>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{review.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
