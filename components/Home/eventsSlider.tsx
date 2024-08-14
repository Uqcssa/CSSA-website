"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';


export function EventsSlider() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <motion.h2
          variants={fadeIn('up', 0.4)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
          className='h2 text-center mb-6 text-6xl text-bold my-32'
        >
        <div className="w-full  py-20 mt-64 ">
        
            <Carousel items={cards} />
        </div>
    </motion.h2>
  );
}

const DummyContent = ({
  title,
  description,
  isrc,
}: {
  title: string;
  description: string;
  isrc: string;
})  => {
  return (
          <div
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <Image
              src={isrc}
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
            <p className="text-neutral-600 dark:text-neutral-400 py-9 text-2xl md:text-3xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                {title}
              </span>{" "}
              {description}
            </p>
          </div>
       

  );
};

// this is the after clicked the events card
const ClickCard = () =>{
  return(
    <>
      {data.map((data, index) => {
        
      })}
    </>
  )
}

const data = [
  {
    category: "",
    title: "中秋晚会节目征集",
    src: "/assets/uq/活动简介/中秋.jpg",
    content: <DummyContent 
    title="中秋晚会节目征集" 
    description="中秋十五月圆，天地人间接团圆。借此花好月圆知己，UQCSSA2024年中秋晚会的大幕即将拉开。为了弘扬中华文化，展现东方大国之美。UQSSA在此向全昆州的华人留学生征集中秋晚会的节目。" 
    isrc="/assets/uq/活动简介/中秋.jpg" />,
    
  },
  {
    category: "",
    title: "MarketDay!",
    src: "/assets/uq/活动简介/MarketDay.jpg",
    content: <DummyContent 
    title="" 
    description="" 
    isrc="" />,
  },

  {
    category: "",
    title: "参观昆士兰州议会",
    src: "/assets/uq/活动简介/州议院.jpg",
    content: <DummyContent 
    title="" 
    description="" 
    isrc="" />,
  },
  {
    category: "",
    title: "招聘分享会",
    src: "/assets/uq/活动简介/招聘会.jpg",
    content: <DummyContent 
    title="" 
    description="" 
    isrc="" />,
  },
  {
    category: "",
    title: "猫鼠大战",
    src: "/assets/uq/活动简介/猫鼠大战.jpg",
    content: <DummyContent 
    title="" 
    description="" 
    isrc="" />,
  },
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent 
    title="" 
    description="" 
    isrc="" />,
  },
];
