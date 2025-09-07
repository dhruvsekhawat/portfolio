"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { useFloatingNavigation } from "@/components/custom/floating-navigation-bar/floating-navigation-provider";
import { cn } from "@/lib/utils";

type NavigationBarItemProps = {
  children: React.ReactNode;
  href: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function NavigationBarItem(props: NavigationBarItemProps) {
  const segment = useSelectedLayoutSegment();
  const resolvedSegment =
    props.href === "/" ? "about" : props.href.split("/")[1];
  const isCurrentPath = segment === resolvedSegment;
  const { isOpen, setIsOpen } = useFloatingNavigation();

  return (
    <Link
      href={props.href}
      data-nav-item
      className={cn(
        "relative z-20 rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
        "hover:text-foreground/90",
        isCurrentPath 
          ? "font-semibold text-foreground" 
          : "font-normal text-foreground/70 hover:text-foreground/90"
      )}
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </Link>
  );
}
