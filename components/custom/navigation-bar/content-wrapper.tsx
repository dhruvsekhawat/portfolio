"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";

type ContentWrapperProps = {
  children: React.ReactNode;
};

export function ContentWrapper({ children }: ContentWrapperProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "relative mx-auto h-full w-screen [&>article]:mx-auto transition-all duration-500 ease-in-out",
        "px-8 pt-24 pb-40", // phone
        "md:max-w-md md:pb-24", // tablet
        "lg:max-w-xl lg:pb-24", // laptop
        "xl:max-w-2xl xl:pb-24", // large desktop
        // Adjust margin based on sidebar state
        isOpen ? "lg:ml-64 xl:ml-64" : "lg:ml-0 xl:ml-0"
      )}
    >
      {children}
    </div>
  );
}
