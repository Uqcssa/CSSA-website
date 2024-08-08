"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";

export function ImagesSliderDemo() {
  const images = [
    "/assets/uq/T1.jpg",
    "/assets/uq/T2.jpg",
    "/assets/uq/T3.jpg"
  ];
  return (
    <ImagesSlider className="h-[52rem] w-full" overlayClassName images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-normal  text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
        昆州最具号召力 <br />
        </motion.p>
        <motion.p className="font-normal my-1 text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
        口碑最好的华人学生团体
        </motion.p>
        {/* <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button> */}
      </motion.div>
    </ImagesSlider>
  );
}
export default ImagesSliderDemo;