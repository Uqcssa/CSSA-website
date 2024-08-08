"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";
import  { motion } from "framer-motion";
import { fadeIn } from '@/lib/variants';

const content = [
  {
    title: "中秋晚会节目征集",
    description:
      "中秋十五月圆，天地人间接团圆。借此花好月圆知己，UQCSSA2024年中秋晚会的大幕即将拉开。为了弘扬中华文化，展现东方大国之美。UQSSA在此向全昆州的华人留学生征集中秋晚会的节目。",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/assets/uq/活动简介/中秋.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "MarketDay!",
    description:
      "一年一度的Market Day又来啦！让我们欢聚在UQ校园的大草坪，一起欢庆这一年一度的盛大庆典吧！记得是2024年7月24日9：00—12:00，让我们不见不散！",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/assets/uq/活动简介/MarketDay.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "报名持续进行中",
    description:
      "昆士兰州首位华人议员蔡伟民先生特别与我UQCSSA进行合作，邀请我们参观昆士兰州议会。机不可失时不再来！快快找我们报名吧！",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/assets/uq/活动简介/州议院.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  // {
  //   title: "招聘分享会",
  //   description:
  //     "快来吧！这里有海量岗位，有名企云集，更能为您打造个性化的精准规划！快带上你的简历，一同见证这场求职盛宴吧！",
  //   content: (
  //     <div className="h-full w-full  flex items-center justify-center text-white">
  //       <Image
  //         src="/assets/uq/活动简介/招聘会.jpg"
  //         width={300}
  //         height={300}
  //         className="h-full w-full object-cover"
  //         alt="linear board demo"
  //       />
  //     </div>
  //   ),
  // },
  
];
export function StickyScrollRevealDemo() {
  return (
    
          <div className="p-10 mt-80">
            <motion.div
            variants={fadeIn('up', 0.8)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='h2 text-center font-mono font-bold text-6xl mt-64'
          >
            <h1 className="text-center text-6xl font-bold ">活动简介</h1>
          </motion.div>
              
            <StickyScroll content={content} contentClassName />
          </div>         
    
  );
}
export default StickyScrollRevealDemo;