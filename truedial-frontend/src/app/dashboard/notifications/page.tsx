'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { 
  Bell, Briefcase, FileText, CheckCircle2, MessageSquare, 
  ShieldCheck, AlertTriangle, Trash2, CheckCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { isCustomer, isVendor } = useRole();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching notifications
    setTimeout(() => {
      if (isCustomer) {
        setNotifications([
          {
            id: 1,
            type: 'bid_received',
            title: 'New Bid Received!',
            message: 'SpaceCrafters Interiors has submitted a bid for your 3BHK Renovation.',
            time: '10 mins ago',
            read: false,
            link: '/dashboard/requirements/101',
            icon: FileText,
            color: 'text-blue-500 bg-blue-500/10'
          },
          {
            id: 2,
            type: 'message',
            title: 'New Message',
            message: 'You have a new message from Modern Living Studio regarding Modular Kitchen Upgrade.',
            time: '2 hours ago',
            read: true,
            link: '/dashboard/messages/2',
            icon: MessageSquare,
            color: 'text-green-500 bg-green-500/10'
          }
        ]);
      } else if (isVendor) {
        setNotifications([
          {
            id: 3,
            type: 'project_awarded',
            title: 'Project Awarded! 🎉',
            message: 'Congratulations! You have been awarded the 3BHK Renovation project by John Doe.',
            time: 'Just now',
            read: false,
            link: '/dashboard/requirements/101',
            icon: Briefcase,
            color: 'text-amber-500 bg-amber-500/10'
          },
          {
            id: 4,
            type: 'verification',
            title: 'Documents Verified',
            message: 'Your Trade License and Aadhar Card have been verified. You now have the Verified Badge.',
            time: '1 day ago',
            read: true,
            link: '/dashboard/vendor/profile',
            icon: ShieldCheck,
            color: 'text-emerald-500 bg-emerald-500/10'
          },
          {
            id: 5,
            type: 'wallet',
            title: 'Low Wallet Balance',
            message: 'Your wallet balance is low (20 Credits). Recharge to continue bidding.',
            time: '2 days ago',
            read: true,
            link: '/dashboard/vendor/wallet',
            icon: AlertTriangle,
            color: 'text-red-500 bg-red-500/10'
          }
        ]);
      }
      setLoading(false);
    }, 600);
  }, [isCustomer, isVendor]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated on your projects, bids, and profile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-muted-foreground">
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30">
            <Trash2 className="w-4 h-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      {/* Main List */}
      <div className="premium-card rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center animate-pulse text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-bold text-foreground">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              You have no new notifications. We'll alert you when something important happens.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(notification => {
              const Icon = notification.icon;
              return (
                <Link 
                  href={notification.link}
                  key={notification.id}
                  className={`flex items-start gap-4 p-5 hover:bg-muted/50 transition relative group ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 ml-4">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
