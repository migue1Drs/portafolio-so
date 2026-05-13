"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/progress-context";

interface ReadMarkerProps {
  topicId: string;
}

/**
 * Invisible component placed at the bottom of each topic page.
 * When it enters the viewport (user scrolled to bottom), it marks the topic as read.
 */
export function ReadMarker({ topicId }: ReadMarkerProps) {
  const { markRead, progress } = useProgress();
  const markerRef = useRef<HTMLDivElement>(null);
  const alreadyRead = progress[topicId]?.read;

  useEffect(() => {
    if (alreadyRead) return;
    const el = markerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markRead(topicId);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [topicId, markRead, alreadyRead]);

  return <div ref={markerRef} className="h-1 w-full" aria-hidden="true" />;
}
