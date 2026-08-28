"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Clock, ExternalLink, ChevronRight, Headphones, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Founder Stories", "Retail Growth", "Restaurant Hacks", "Scaling Services", "B2B Insights", "Digital Marketing"];

const EPISODES = [
  {
    id: 1,
    title: "How Rajesh Scaled His Salon Chain from 1 to 12 Outlets",
    guest: "Rajesh Sharma",
    guestTitle: "Founder, GlowUp Salons",
    category: "Founder Stories",
    duration: "42 min",
    date: "Aug 20, 2026",
    description: "From a single chair in Lucknow to 12 premium salons across 4 cities — Rajesh shares the raw truth about hiring, cash flow, and customer retention.",
    color: "from-[#E8701A] to-[#f59e0b]",
    episode: "EP 24",
    audioUrl: null,
  },
  {
    id: 2,
    title: "The Restaurant Owner's Guide to Getting Google Reviews",
    guest: "Priya Malhotra",
    guestTitle: "Co-founder, SpiceRoute Restaurants",
    category: "Restaurant Hacks",
    duration: "35 min",
    date: "Aug 14, 2026",
    description: "Priya grew her restaurant's reviews from 47 to 1,200+ in 8 months. She breaks down exactly how she did it — without paying for a single fake review.",
    color: "from-[#7c3aed] to-[#4f46e5]",
    episode: "EP 23",
    audioUrl: null,
  },
  {
    id: 3,
    title: "B2B Leads on a Shoestring: What Actually Works in Tier-2 Cities",
    guest: "Amit Gupta",
    guestTitle: "Director, BuildRight Contractors",
    category: "B2B Insights",
    duration: "48 min",
    date: "Aug 7, 2026",
    description: "Amit closed ₹2Cr in B2B contracts last year from Jaipur — using WhatsApp, referrals, and one local directory. No paid ads. Hear the full strategy.",
    color: "from-[#0891b2] to-[#1d4ed8]",
    episode: "EP 22",
    audioUrl: null,
  },
  {
    id: 4,
    title: "Digital Marketing for Offline Businesses: Stop Wasting Your Budget",
    guest: "Sneha Kapoor",
    guestTitle: "Growth Consultant, MarketWise",
    category: "Digital Marketing",
    duration: "39 min",
    date: "Jul 30, 2026",
    description: "Most small businesses waste 70% of their digital marketing spend. Sneha reveals the exact mistakes and the 3-step framework that actually drives footfall.",
    color: "from-[#059669] to-[#0d9488]",
    episode: "EP 21",
    audioUrl: null,
  },
  {
    id: 5,
    title: "From Freelancer to 20-Person Agency: The Messy Middle",
    guest: "Vikram Nair",
    guestTitle: "CEO, DesignLabs India",
    category: "Scaling Services",
    duration: "55 min",
    date: "Jul 23, 2026",
    description: "Vikram went from solo freelancer to running a 20-person design agency. He's brutally honest about the failures, the near-bankruptcy, and the pivot that saved it all.",
    color: "from-[#dc2626] to-[#9333ea]",
    episode: "EP 20",
    audioUrl: null,
  },
  {
    id: 6,
    title: "How a Kirana Store Added ₹40,000/Month with Zero Capex",
    guest: "Suresh Patel",
    guestTitle: "Owner, Patel General Stores",
    category: "Retail Growth",
    duration: "31 min",
    date: "Jul 16, 2026",
    description: "Suresh partnered with 3 delivery apps and added a WhatsApp ordering system. Now his neighbourhood store ships to a 5km radius. No investment, just hustle.",
    color: "from-[#d97706] to-[#b45309]",
    episode: "EP 19",
    audioUrl: null,
  },
];

const PLATFORMS = [
  { name: "Spotify", color: "#1DB954", icon: "🎵", url: "#" },
  { name: "Apple Podcasts", color: "#9333ea", icon: "🎙️", url: "#" },
  { name: "YouTube", color: "#FF0000", icon: "▶️", url: "#" },
  { name: "Google Podcasts", color: "#4285F4", icon: "🎧", url: "#" },
];

interface Episode {
  id: number;
  title: string;
  guest: string;
  guestTitle: string;
  category: string;
  duration: string;
  date: string;
  description: string;
  color: string;
  episode: string;
  audioUrl: string | null;
}

function MiniPlayer({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speeds = [0.75, 1, 1.5, 2];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1c3a] border-t border-white/10 shadow-2xl px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${episode.color} flex items-center justify-center shrink-0`}>
          <Mic className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold line-clamp-1">{episode.title}</p>
          <p className="text-white/50 text-xs">{episode.guest}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/60 hover:text-white transition">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying((v) => !v)}
            className="w-9 h-9 rounded-full bg-[#E8701A] flex items-center justify-center hover:bg-[#c95d13] transition"
          >
            {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
          </button>
          <button className="text-white/60 hover:text-white transition">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => {
            const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
            setSpeed(next);
          }}
          className="text-white/60 hover:text-white text-xs font-bold w-10 text-center transition"
        >
          {speed}x
        </button>
        <Volume2 className="w-4 h-4 text-white/40 hidden sm:block" />
        <button onClick={onClose} className="text-white/40 hover:text-white transition text-xs">✕</button>
      </div>
    </div>
  );
}

export default function PodcastPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);

  const filtered = activeCategory === "All"
    ? EPISODES
    : EPISODES.filter((e) => e.category === activeCategory);

  const featured = EPISODES[0];

  return (
    <div className="min-h-screen bg-[#050f24]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1c3a] via-[#0d1f3c] to-[#050f24] pt-16 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#E8701A]/10 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8701A]/10 border border-[#E8701A]/30 rounded-full px-4 py-1.5 mb-6">
            <Radio className="w-3.5 h-3.5 text-[#E8701A]" />
            <span className="text-[#E8701A] text-sm font-bold">TrueDial Podcast</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
            Real Stories.<br />
            <span className="text-[#E8701A]">Real Growth.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Conversations with India's most ambitious entrepreneurs — the strategies, failures, and breakthroughs behind their success.
          </p>

          {/* Platform links */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 rounded-full px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-all hover:scale-105"
              >
                <span>{p.icon}</span>
                {p.name}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>

          <div className="flex justify-center gap-8 text-center">
            {[["24+", "Episodes"], ["15k+", "Monthly Listeners"], ["100%", "Free to Listen"]].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-extrabold text-white">{num}</div>
                <div className="text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Episode */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className={`rounded-2xl bg-gradient-to-r ${featured.color} p-0.5 shadow-2xl`}>
          <div className="bg-[#0a1c3a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${featured.color} flex items-center justify-center shrink-0 shadow-lg`}>
              <Headphones className="w-10 h-10 md:w-14 md:h-14 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/10 text-white text-xs border-0 mb-3">🎙 LATEST EPISODE · {featured.episode}</Badge>
              <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2 leading-snug">{featured.title}</h2>
              <p className="text-white/60 text-sm mb-4">{featured.guest} — {featured.guestTitle}</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => setPlayingEpisode(featured)}
                  className="flex items-center gap-2 bg-[#E8701A] hover:bg-[#c95d13] text-white rounded-full px-6 py-2.5 font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-[#E8701A]/30"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Play Episode
                </button>
                <span className="flex items-center gap-1.5 text-white/40 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Episodes */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Category Filter */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-2xl font-extrabold text-white">All Episodes</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#E8701A] text-white"
                    : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((ep) => (
            <div
              key={ep.id}
              className="group bg-white/5 border border-white/8 hover:border-white/20 rounded-xl p-5 flex flex-col sm:flex-row gap-4 transition-all hover:bg-white/8 cursor-pointer"
              onClick={() => setPlayingEpisode(ep)}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${ep.color} flex items-center justify-center shrink-0`}>
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#E8701A] text-xs font-bold">{ep.episode}</span>
                  <Badge className="bg-white/10 text-white/60 text-[10px] border-0 px-1.5 py-0">{ep.category}</Badge>
                </div>
                <h3 className="text-white font-bold text-base leading-snug group-hover:text-[#E8701A] transition-colors line-clamp-2">{ep.title}</h3>
                <p className="text-white/50 text-sm mt-1 line-clamp-1">{ep.guest} · {ep.guestTitle}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                <button
                  className="w-10 h-10 rounded-full bg-[#E8701A]/10 group-hover:bg-[#E8701A] flex items-center justify-center transition-all"
                  onClick={(e) => { e.stopPropagation(); setPlayingEpisode(ep); }}
                >
                  <Play className="w-4 h-4 text-[#E8701A] group-hover:text-white ml-0.5" />
                </button>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock className="w-3 h-3" />
                    {ep.duration}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">{ep.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#E8701A]/10 to-purple-600/10 border border-white/10 rounded-2xl p-8 text-center">
          <Mic className="w-10 h-10 text-[#E8701A] mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-white mb-2">Want to be on TrueDial Podcast?</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">We're looking for entrepreneurs, operators, and hustlers with stories worth sharing. Apply to be a guest.</p>
          <a
            href="mailto:podcast@truedial.com"
            className="inline-flex items-center gap-2 bg-[#E8701A] hover:bg-[#c95d13] text-white rounded-full px-8 py-3 font-bold transition-all hover:scale-105"
          >
            Apply as a Guest <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Floating mini player */}
      {playingEpisode && (
        <MiniPlayer episode={playingEpisode} onClose={() => setPlayingEpisode(null)} />
      )}
    </div>
  );
}
