"use client";

import React from "react";
import { TrueDialAPI } from "@/lib/api";

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType: string;
  entityType: string;
  entityId: number;
  metadata?: Record<string, any>;
  children: React.ReactNode;
}

export default function TrackedLink({ eventType, entityType, entityId, metadata, children, ...props }: TrackedLinkProps) {
  const handleClick = () => {
    TrueDialAPI.trackEvent(eventType, entityType, entityId, metadata || {});
    if (props.onClick) {
      props.onClick(null as any);
    }
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
