"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/lib/utils";
import { PiLineVerticalBold } from "react-icons/pi";
import Image from "next/image";
import Blog from "./Blog";

export const IntroductionDepartment = ({
    text,
  }: {
    text: string;
    
  }) =>{
    return(
        <div className="mt-6">
            <HighlightText text={`${text}`}/>
            <Blog/>
        </div>
    )
}
type HighlightTextProps = {
    text: string;
  };
  
  const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
    return (
      <div className="flex justify-start items-center">
        
        <h1 className="text-4xl font-bold text-black">{text}</h1>
      </div>
    );
  };

  export default IntroductionDepartment;