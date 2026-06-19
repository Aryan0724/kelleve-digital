"use client";

import React from "react";

type Activity = {
  id: number | string;
  type: "requirement_posted" | "bid_placed" | "project_awarded" | "professional_verified";
  title: string;
  location?: string;
  amount?: number;
  timestamp: string;
};

export default function ActivityFeedItem({ activity }: { activity: Activity }) {
  const icon = (() => {
    switch (activity.type) {
      case "requirement_posted":
        return "📢";
      case "bid_placed":
        return "💬";
      case "project_awarded":
        return "🏆";
      case "professional_verified":
        return "🛡️";
      default:
        return "ℹ️";
    }
  })();

  return (
    <div className="flex items-start gap-4 p-4">
      <div className="text-2xl leading-none">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-800">{activity.title}</div>
        <div className="mt-1 text-xs text-gray-500 flex items-center gap-3">
          {activity.location && <span>{activity.location}</span>}
          {activity.amount && <span>• ₹{activity.amount.toLocaleString()}</span>}
          <span className="ml-auto">{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
