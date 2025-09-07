import { cn } from "@/lib/utils";
import { LiquidBlob } from "./liquid-blob";

type NavigationBarProps = {
  children: React.ReactNode;
};

export function NavigationBar(props: NavigationBarProps) {
  return (
    <div
      className={cn(
        "absolute top-0 -left-28 h-full w-36 md:-left-36 lg:-left-44 xl:-left-48",
        "hidden md:block"
      )}
    >
      <nav
        className={cn(
          "sticky top-24 flex flex-col gap-2 rounded-lg p-2",
          "transition-[transform_box-shadow] ease-out"
        )}
      >
        <LiquidBlob>
          {props.children}
        </LiquidBlob>
      </nav>
    </div>
  );
}
