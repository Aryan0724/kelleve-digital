"use client";

import { Bell, CheckCircle2, MessageSquare, Target, UserPlus } from "lucide-react";

export default function VendorNotificationsPage() {
  const notifications = [
    { id: 1, type: "lead", title: "New Lead from John Doe", description: "John Doe requested a callback regarding your interior design services.", time: "10 mins ago", unread: true, icon: UserPlus, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
    { id: 2, type: "review", title: "New 5-Star Review", description: "Sarah Smith left a new 5-star review on your profile.", time: "2 hours ago", unread: true, icon: MessageSquare, color: "text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400" },
    { id: 3, type: "system", title: "Profile Approved", description: "Your business profile has been approved and is now live on TrueDial.", time: "1 day ago", unread: false, icon: CheckCircle2, color: "text-primary bg-primary/10" },
    { id: 4, type: "campaign", title: "Campaign Completed", description: "Your 'Summer Sale' SMS campaign has finished sending to 450 users.", time: "2 days ago", unread: false, icon: Target, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay updated with leads, reviews, and system alerts.</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="premium-card rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div key={notification.id} className={`p-4 sm:p-6 flex gap-4 transition hover:bg-secondary/20 ${notification.unread ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${notification.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1">
                    <h4 className={`font-semibold ${notification.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${notification.unread ? 'text-foreground/90 font-medium' : 'text-muted-foreground'}`}>
                    {notification.description}
                  </p>
                </div>
                {notification.unread && (
                  <div className="shrink-0 flex items-center justify-center w-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
