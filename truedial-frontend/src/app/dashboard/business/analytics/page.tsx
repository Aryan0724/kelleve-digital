import React from "react";
import AnalyticsDashboard from "@/components/vendor/AnalyticsDashboard";

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">Analytics</h1>
        <p className="text-muted-foreground">Monitor your listing performance and engagement</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
