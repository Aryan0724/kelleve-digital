"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { BidComparisonMatrix } from "@/components/bids/BidComparisonMatrix";
import { GitCompare, PlusCircle, ArrowRight, ShieldCheck, Star, Trophy, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<number | null>(null);
  const [selectedReqType, setSelectedReqType] = useState<string>("");
  const [bids, setBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchRequirementsAndBids = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/dashboard");
        const data = res.data.data || {};
        const allReqs = (data.projects || []).concat(data.rfqs || []).concat(data.jobs || []);
        const allBids = data.received_bids || [];

        // Filter requirements that have at least 1 bid
        const reqsWithBids = allReqs.filter((req: any) => {
          const count = allBids.filter((b: any) => b.requirement_id === req.id).length;
          return count > 0 || (req.bids_count && req.bids_count > 0);
        });

        setRequirements(reqsWithBids);

        if (reqsWithBids.length > 0) {
          const firstReq = reqsWithBids[0];
          const typeStr = firstReq.material_type ? "rfq" : firstReq.skill_required ? "job" : "project";
          setSelectedReqId(firstReq.id);
          setSelectedReqType(typeStr);
          await loadComparison(firstReq.id, typeStr);
        }
      } catch (err) {
        console.error("Failed to fetch compare data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirementsAndBids();
  }, [user, token, _hasHydrated]);

  const loadComparison = async (reqId: number, reqType: string) => {
    try {
      setLoadingBids(true);
      const typeStr = reqType ? `?requirement_type=${reqType}` : "";
      const res = await api.get(`/requirements/${reqId}/bids/compare${typeStr}`);
      setBids(res.data.comparison_matrix || []);
    } catch (err) {
      console.error("Failed to load bid comparison matrix:", err);
      setBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleRequirementSelect = async (req: any) => {
    const typeStr = req.material_type ? "rfq" : req.skill_required ? "job" : "project";
    setSelectedReqId(req.id);
    setSelectedReqType(typeStr);
    await loadComparison(req.id, typeStr);
  };

  const handleAward = async (bidId: number) => {
    try {
      await api.patch(`/bids/${bidId}/award`);
      alert("Project awarded successfully!");
      if (selectedReqId) {
        router.push(`/requirements/${selectedReqId}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to award project.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Checking available bids to compare...</p>
      </div>
    );
  }

  // State: Has Requirements with Bids
  if (requirements.length > 0 && selectedReqId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background py-10 transition-colors">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <GitCompare className="w-3.5 h-3.5" />
                <span>SIDE-BY-SIDE BID COMPARISON</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Compare Received Bids</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Evaluate quotations on pricing, experience, warranty, and timeline to hire the best professional.
              </p>
            </div>
            <Link href="/post-requirement">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Post Another Requirement
              </Button>
            </Link>
          </div>

          {requirements.length > 1 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Select Requirement:</span>
              {requirements.map((req) => (
                <button
                  key={req.id}
                  onClick={() => handleRequirementSelect(req)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedReqId === req.id
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {req.title || `${req.city} Requirement`}
                </button>
              ))}
            </div>
          )}

          {loadingBids ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border dark:border-slate-800 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading bid matrix...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 shadow-sm">
              <BidComparisonMatrix
                bids={bids}
                onAward={handleAward}
                reqType={selectedReqType}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // State: No Bids Posted or No Requirement Posted (or logged out)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center px-4 py-16 transition-colors">
      <div className="max-w-xl w-full text-center">
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <GitCompare className="w-10 h-10 text-orange-600" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-orange-200 dark:border-orange-800">
          ✦ SMART BID COMPARISON ENGINE
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
          No Bids Available to Compare Yet
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-base mb-8 max-w-lg mx-auto">
          You need to post a requirement and receive quotes from verified interior designers, architects, or contractors before you can compare bids side-by-side.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm p-6 mb-8 text-left space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider text-center border-b dark:border-slate-800 pb-3">
            Why compare bids on Find My Interior?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-orange-600">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Smart Bid Score</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI scoring evaluates pricing, experience, and warranty together.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Verified Professionals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">100% background and business credential verification.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Side-by-Side Matrix</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Compare pricing, duration, and warranty side-by-side.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Save Up to 30%</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Competitive bidding ensures fair market rates for your project.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/post-requirement" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all text-base flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Post Requirement to Compare
            </Button>
          </Link>

          <Link href="/professionals" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-700 font-bold px-6 py-6 rounded-xl text-base">
              Browse Verified Pros
            </Button>
          </Link>
        </div>

        {user && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
            Already posted a requirement? <Link href="/dashboard" className="text-orange-600 underline font-semibold">Check your dashboard</Link> for incoming bids.
          </p>
        )}
      </div>
    </div>
  );
}
