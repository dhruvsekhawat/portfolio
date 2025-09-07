"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

type LiquidBlobProps = {
  children: React.ReactNode;
};

export function LiquidBlob({ children }: LiquidBlobProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const segment = useSelectedLayoutSegment();

  // Get current active route
  const routes = [
    { path: "/about", name: "about me" },
    { path: "/projects", name: "projects" },
    { path: "/playground", name: "playground" },
    { path: "/hobbies", name: "hobbies" },
    { path: "/posts", name: "posts" },
    { path: "/contacts", name: "contacts" },
  ];

  // Find current active index
  useEffect(() => {
    // Handle the root path "/" which redirects to "/about"
    const currentPath = segment ? `/${segment}` : "/about";
    const currentIndex = routes.findIndex(
      (route) => route.path === currentPath
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [segment]);

  // Update blob position
  useEffect(() => {
    if (!blobRef.current || !navRef.current) return;

    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const navItems = navRef.current.querySelectorAll('[data-nav-item]');
    
    
    if (navItems[targetIndex]) {
      const targetItem = navItems[targetIndex] as HTMLElement;
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();
      
      const y = itemRect.top - navRect.top;
      const height = itemRect.height;


      // Use requestAnimationFrame to ensure smooth animation
      requestAnimationFrame(() => {
        if (blobRef.current) {
          blobRef.current.style.transform = `translateY(${y}px)`;
          blobRef.current.style.height = `${height}px`;
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translateY(${y}px)`;
          glowRef.current.style.height = `${height}px`;
        }
      });
    }
  }, [activeIndex, hoveredIndex]);

  // Initial positioning
  useEffect(() => {
    if (!blobRef.current || !navRef.current) return;
    
    // Set initial position after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const navItems = navRef.current?.querySelectorAll('[data-nav-item]');
      if (navItems && navItems[activeIndex]) {
        const targetItem = navItems[activeIndex] as HTMLElement;
        const navRect = navRef.current?.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        
        if (navRect) {
          const y = itemRect.top - navRect.top;
          const height = itemRect.height;

          if (blobRef.current) {
            blobRef.current.style.transform = `translateY(${y}px)`;
            blobRef.current.style.height = `${height}px`;
          }
          if (glowRef.current) {
            glowRef.current.style.transform = `translateY(${y}px)`;
            glowRef.current.style.height = `${height}px`;
          }
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Clone children and add hover handlers
  const childrenWithHandlers = Array.isArray(children) 
    ? children.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            onMouseEnter: () => {
              setHoveredIndex(index);
            },
            onMouseLeave: () => {
              setHoveredIndex(null);
            },
          });
        }
        return child;
      })
    : React.isValidElement(children)
    ? React.cloneElement(children as any, {
        onMouseEnter: () => {
          setHoveredIndex(0);
        },
        onMouseLeave: () => {
          setHoveredIndex(null);
        },
      })
    : children;

  return (
    <div className="relative" ref={navRef}>
      {/* Liquid Blob Background */}
      <div
        ref={blobRef}
        className={cn(
          "absolute rounded-lg",
          "bg-gradient-to-br from-secondary/30 to-secondary/20",
          "backdrop-blur-sm border border-secondary/30",
          "shadow-md shadow-secondary/20",
          // Active state styling
          hoveredIndex !== null && "scale-105 shadow-xl shadow-secondary/40",
          // Spring physics simulation
          "transform-gpu will-change-transform"
        )}
        style={{
          left: "0.5rem",
          top: 0,
          width: "calc(100% - 1rem)",
          height: "2.5rem", // Default height for one item
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
      
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={cn(
          "absolute rounded-lg opacity-0 transition-all duration-300",
          "bg-gradient-to-br from-primary/20 to-accent/20",
          "blur-sm -z-10",
          hoveredIndex !== null && "opacity-100"
        )}
        style={{
          left: "0.5rem",
          top: 0,
          width: "calc(100% - 1rem)",
          height: "2.5rem",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out",
        }}
      />

      {/* Navigation Items */}
      <div className="relative z-10 flex flex-col gap-2">
        {childrenWithHandlers}
      </div>
    </div>
  );
}

