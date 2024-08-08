
import React from 'react';

import Classes from "@/components/Home/Classes";
import { BackgroundBoxesDemo } from '@/components/EachDepartment/BackgroundBoxes';
import IntroductionDepartment from '@/components/EachDepartment/introduction';
export default async function Members() {
  
    return (
      <main className='max-auto mx-40 mt-10'>
       <BackgroundBoxesDemo/>
       <IntroductionDepartment text='部门介绍'/>
      </main>
    );
}