"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/lib/utils";

export function BackgroundBoxesDemo() {
  return (
    <div className="h-96 bg-media-photo relative w-full overflow-hidden bg-purple-400 flex flex-col items-center justify-center rounded-none  ">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes className={""}/>
      <h1 className={cn("md:text-6xl text-xl text-white relative z-20")}>
        传媒部
      </h1>
      <p className="text-center text-2xl mt-6 text-neutral-300 relative z-20">
      各部门对内对外显示的窗口
      </p>
    </div>
  );
}
