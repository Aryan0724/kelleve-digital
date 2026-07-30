"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, Loader2, X } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface Notification {
  id: string;
  type: string;
  data: {
    message: string;
    [key: string]: any;
  };
  read_at: string | null;
  created_at: string;
}

export function NotificationDropdown() {
  const { user, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("pointerdown", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("pointerdown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-[#0a1c3a] transition-colors rounded-full hover:bg-gray-50"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.6rem] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Full-screen fixed transparent backdrop at z-[9998] so clicking anywhere outside on the screen area always closes popup */}
          <div 
            className="fixed inset-0 w-screen h-screen z-[9998] bg-transparent cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-100 z-[9999] overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b bg-slate-50">
              <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No notifications yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 flex gap-3 ${!notif.read_at ? 'bg-orange-50/50' : 'bg-white'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 leading-snug">
                        {notif.data?.message || "You have a new notification"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notif.read_at && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-orange-600 hover:text-orange-800 shrink-0 self-start p-1"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
