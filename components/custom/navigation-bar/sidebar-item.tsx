"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  children: React.ReactNode;
  href: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function SidebarItem(props: SidebarItemProps) {
  const segment = useSelectedLayoutSegment();
  const resolvedSegment =
    props.href === "/" ? "about" : props.href.split("/")[1];
  const isCurrentPath = segment === resolvedSegment;

  return (
    <Link
      href={props.href}
      data-nav-item
      className={cn(
        "relative z-20 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group",
        "hover:text-foreground/90 flex items-center gap-2.5",
        isCurrentPath 
          ? "font-medium text-foreground" 
          : "font-normal text-foreground/70 hover:text-foreground/90"
      )}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {/* Minimal icon placeholder */}
      <div className={cn(
        "w-3 h-3 rounded-full transition-all duration-200",
        isCurrentPath 
          ? "bg-primary/30" 
          : "bg-muted/40 group-hover:bg-primary/15"
      )} />
      
      <span className="flex-1">{props.children}</span>
      
      {/* Subtle active indicator */}
      {isCurrentPath && (
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
      )}
    </Link>
  );
}
