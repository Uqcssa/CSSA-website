
import React from 'react';

import Classes from "@/components/Home/Classes";
import { BackgroundBoxesDemo } from '@/components/EachDepartment/BackgroundBoxes';
import IntroductionDepartment from '@/components/EachDepartment/introduction';
import Image from 'next/image';
import DrawerButton from '@/components/EachDepartment/DrawerButton';


const memberData = [
  {
    img: "/assets/部门成员/外联部/mi笑.jpg",
    date: 'March 10, 2024',
    title: 'Maintain a perfect structure after workout',
    href: '',
  },
  {
    img: '/assets/部门成员/传媒部/祝梓若.jpg',
    date: 'March 10, 2024',
    title: 'Maintain a perfect structure after workout',
    href: '',
  },
  {
    img: '/assets/部门成员/传媒部/吉羽翔.jpg',
    date: 'March 10, 2024',
    title: 'Maintain a perfect structure after workout',
    href: '',
  },
  
];
export default async function Marketing() {

    return (
      <main className='max-auto mx-40 mt-10'>
       <BackgroundBoxesDemo/>
       <IntroductionDepartment text='部门介绍' 
       Description='我们是UQCSSA的形象护卫者！无论是大到UQCSSA各个活动的宣传和记录，还是小到为同学种草好吃不贵的高性价比店铺，都是传媒的业务内容。'/>
        <div className='flex-col mt-20'>
          <p className='text-center text-4xl font-bold my-16'>部员介绍</p>
          <div className='flex justify-center items-center gap-2'>
            {memberData.map((post, index) => {
                    return (
                        <div className='flex sm:flex-col justify-start h-full max-w-[320px] mx-auto'>
                          <Image
                            src={post.img}
                            width={320}
                            height={566}
                            alt=''
                            className='mb-6 shadow-md rounded-md'
                          />
                          <div className='flex flex-col items-start'>
                            <p className='max-w-[380px] uppercase text-[12px] tracking-[3px] mb-1'>
                              {post.date}
                            </p>

                              <h5 >{post.title}</h5> 
                          </div>
                        </div>
                      
                    );
                  })}
          </div>
        </div>  
        <div className='flex items-center justify-center mt-16'>
          <DrawerButton/>
        </div>
        
      </main>
    );
}