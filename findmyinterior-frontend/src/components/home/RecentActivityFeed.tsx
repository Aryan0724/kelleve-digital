"use client";

import React, { useEffect, useState } from "react";
import ActivityFeedItem from "./ActivityFeedItem";

type Activity = {
  id: number | string;
  type: "requirement_posted" | "bid_placed" | "project_awarded" | "professional_verified";
  title: string;
  location?: string;
  amount?: number;
  timestamp: string; // already-formatted like "15 mins ago"
};

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/homepage/activity-feed?limit=12", { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setActivities(data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load activity");
      // Fallback: keep existing activities
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const id = setInterval(fetchActivities, 1000 * 60 * 5); // refresh every 5 minutes
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Marketplace Activity</h2>
          <p className="text-sm text-gray-500">Live updates from project postings, bids and awards</p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-center text-gray-500">Loading activity…</div>
          )}

          {!loading && activities.length === 0 && (
            <div className="p-6 text-center text-gray-600">No recent activity. Check back soon.</div>
          )}

          {!loading && activities.length > 0 && (
            <ul className="divide-y">
              {activities.map((a) => (
                <li key={a.id}>
                  <ActivityFeedItem activity={a} />
                </li>
              ))}
            </ul>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
}
