"use client";

import { useEffect, useRef, useState } from "react";

// Background video that only plays while on screen, respects reduced motion,
// and falls back to a still image if the video can't load.
export default function LiveVideo({
  src,
  poster,
  fallback,
  className = "",
  rate = 1,
  alt = "",
}: {
  src: string;
  poster: string;
  fallback?: string;
  className?: string;
  rate?: number;
  alt?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    v.playbackRate = rate;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [rate, reduced]);

  if (failed || reduced) {
    return (
      <img
        src={failed && fallback ? fallback : poster}
        alt={alt}
        className={className}
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        }}
      />
    );
  }

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      onError={() => setFailed(true)}
      onLoadedMetadata={(e) => (e.currentTarget.playbackRate = rate)}
    />
  );
}
