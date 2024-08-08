"use client";
import React from "react";
import { Boxes } from "../ui/background-boxes";
import { cn } from "@/lib/utils";
import { PiLineVerticalBold } from "react-icons/pi";
import Image from "next/image";
import Blog from "./Blog";

export const IntroductionDepartment = ({
    text,
    Description,
  }: {
    text: string;
    Description: string;
  }) =>{
    return(
        <div className="mt-10">
            <HighlightText text={`${text}`} Description ={`${Description}`}/>
            
            
        </div>
    )
}
type HighlightTextProps = {
    text: string;
    Description: string;
  };
  
  const HighlightText: React.FC<HighlightTextProps> = ({ text, Description }) => {
    return (
      <div className="flex-col my-9  items-center"> 
        <h1 className="text-4xl font-bold text-black text-center">{text}</h1>
        <div className="mt-6">
          <p className="text-2xl">{Description}</p>
        </div>
      </div>
    );
  };

  export default IntroductionDepartment;