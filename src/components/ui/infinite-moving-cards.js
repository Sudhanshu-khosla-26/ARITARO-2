"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Clone items to ensure seamless continuous scroll
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "25s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "70s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap list-none m-0 p-0",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[200px] sm:w-[240px] max-w-full relative rounded-2xl border border-[rgba(255,255,255,0.08)] flex-shrink-0 px-6 py-4 bg-[rgba(15,23,42,0.5)] backdrop-blur-md hover:border-[rgba(6,182,212,0.4)] hover:bg-[rgba(15,23,42,0.7)] transition-all duration-300 group flex items-center justify-center gap-3 cursor-default"
            key={item.name || idx}
          >
            {item.icon && (
              <span className="text-gray-400 group-hover:text-[#06B6D4] transition-colors duration-300">
                {item.icon}
              </span>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-200 group-hover:text-white tracking-wide transition-colors">
                {item.name}
              </span>
              {item.category && (
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-cyan-400/80 transition-colors">
                  {item.category}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.75rem));
          }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
        }
      `}</style>
    </div>
  );
};
