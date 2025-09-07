"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import Image from "next/image";
import { X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { isOpen, setIsOpen } = useSidebar();
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const segment = useSelectedLayoutSegment();

  // Get current active route
  const routes = [
    { path: "/about", name: "about me" },
    { path: "/experiences", name: "experiences" },
    { path: "/projects", name: "projects" },
    { path: "/playground", name: "playground" },
    { path: "/craft", name: "craft" },
    { path: "/hobbies", name: "hobbies" },
    { path: "/posts", name: "posts" },
    { path: "/contacts", name: "contacts" },
  ];

  // Find current active index
  useEffect(() => {
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
    <>
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 z-50 hidden lg:block transition-all duration-500 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Glassmorphism Background with subtle gradient and texture */}
        <div className="h-full w-full bg-gradient-to-b from-background/95 via-background/90 to-background/85 backdrop-blur-md border-r border-border/30 shadow-lg relative overflow-hidden">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255)_1px,transparent_0)] bg-[length:20px_20px]" />
          <div className="flex flex-col h-full relative z-10">
          {/* Profile Section */}
          <div className="flex flex-col items-center pt-8 pb-6 px-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-all duration-300",
                "hover:bg-background/20 hover:scale-110 active:scale-95",
                "text-muted-foreground hover:text-foreground",
                "backdrop-blur-sm border border-border/20"
              )}
              aria-label="Close sidebar"
            >
              <X size={16} className="transition-transform duration-200" />
            </button>

            {/* Profile Image Container */}
            <div className="relative mb-4">
              {/* Subtle glow effect behind profile */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-lg scale-105 opacity-40" />
              
              {/* Profile Image */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border/40 shadow-lg">
                <Image
                  src="/profile/me.jpeg"
                  alt="Dhruv Sekhawat"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Name and Title */}
            <div className="text-center">
              <h2 className="text-lg font-medium text-foreground mb-1">
                Dhruv Sekhawat
              </h2>
              <p className="text-xs text-muted-foreground">
                Software Engineer
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 px-3">
            <nav className="relative" ref={navRef}>
              {/* Subtle Liquid Blob Background */}
              <div
                ref={blobRef}
                className={cn(
                  "absolute rounded-lg",
                  "bg-gradient-to-br from-primary/8 to-accent/8",
                  "backdrop-blur-sm border border-primary/20",
                  "shadow-sm",
                  // Active state styling
                  hoveredIndex !== null && "scale-[1.02] shadow-md",
                  // Spring physics simulation
                  "transform-gpu will-change-transform"
                )}
                style={{
                  left: "0.25rem",
                  top: 0,
                  width: "calc(100% - 0.5rem)",
                  height: "2.5rem",
                  transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              />
              
              {/* Very subtle glow effect */}
              <div
                ref={glowRef}
                className={cn(
                  "absolute rounded-lg opacity-0 transition-all duration-300",
                  "bg-gradient-to-br from-primary/15 to-accent/15",
                  "blur-sm -z-10",
                  hoveredIndex !== null && "opacity-60"
                )}
                style={{
                  left: "0.25rem",
                  top: 0,
                  width: "calc(100% - 0.5rem)",
                  height: "2.5rem",
                  transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out",
                }}
              />

              {/* Navigation Items */}
              <div className="relative z-10 flex flex-col gap-0.5">
                {childrenWithHandlers}
              </div>
            </nav>
          </div>

          {/* Footer Section */}
          <div className="px-4 pb-4">
            <div className="text-center text-xs text-muted-foreground">
              <p>© 2024 Dhruv Sekhawat</p>
              <p className="mt-1">Built with Next.js & Tailwind</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Toggle Button - Show when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed left-4 top-4 z-50 p-3 rounded-full transition-all duration-300",
            "bg-background/80 backdrop-blur-md border border-border/30",
            "hover:bg-background/90 hover:scale-110 active:scale-95",
            "text-muted-foreground hover:text-foreground",
            "shadow-lg hover:shadow-xl",
            "hidden lg:flex items-center justify-center"
          )}
          aria-label="Open sidebar"
        >
          <ChevronLeft 
            size={20} 
            className="transition-transform duration-200 rotate-180" 
          />
        </button>
      )}
    </>
  );
}
