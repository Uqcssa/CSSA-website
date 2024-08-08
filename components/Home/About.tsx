'use client';

import { FaUsers } from 'react-icons/fa';
import { IoIosPricetags } from 'react-icons/io';
import { FaDumbbell } from 'react-icons/fa6';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';


import Achievements from './Achievements';

const featured = [
  {
    image: "/assets/uq/about1.jpg",
    title: 'UQ-QUT CSSA联合团建',
    subtitle:
      '2024年4月20日',
  },
  {
    image: "/assets/uq/about2.jpg",

    title: '参观州议院活动',
    subtitle:
      '2024年8月3日',
  },
  {
    image: "/assets/uq/about3.jpg",

    title: '新老生见面会',
    subtitle:
      '2024年2月17日',
  },
];

const About = () => {
  return (
    <section className='pt-8 pb-14 lg:pt-16 lg:pb-28' id='about'>
      <div className='container mx-auto'>
        <div className='flex flex-col items-center justify-center gap-16 mb-8'>
          <motion.div
            variants={fadeIn('up', 0.8)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='h2 text-center font-mono font-bold text-4xl my-10 -mb-2'
          >
            
          </motion.div>
          <Image src={"/assets/uq/uqLogo.jpg"} alt="image" width={260} height={260} className="h-200 w-200" />
          <motion.h2
            variants={fadeIn('up', 0.4)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='h2 text-center font-mono font-bold text-4xl my-8'
          >
             U Q C S S A
            昆士兰大学中国学生学者联合会 
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.6)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='max-w-[660px] mx-auto text-center text-1xl'
          >
            昆士兰大学中国学生学者联合会于1988年8月8日正式成立，<br/>是布里斯班中国总领馆以及昆大学生总会（UQU）正式注册登记的非盈利，非宗教，非政治的华人学生学者社团。UQCSSA目前已经成长为昆州最具号召力，口碑最好的华人学生团体。
          </motion.p>
          <motion.p
            variants={fadeIn('up', 0.6)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='max-w-[660px] mx-auto text-center text-1xl'
          >
            UQCSSA致力于促进文化交流和培养社群意识的承诺是坚定不移的。<br/>通过各种各样的活动，包括文化节庆、学术讨论、社交聚会和慈善倡议，UQCSSA丰富了大学和布里斯班地区的文化格局。 这种对文化丰富的承诺不仅使其成员受益，还作为国际学生和当地社区之间的桥梁，促进了跨文化的理解与合作。 
          </motion.p>
          <motion.p
            variants={fadeIn('up', 0.6)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className='max-w-[660px] mx-auto text-center text-1xl'
          >
            作为昆士兰大学最大的学生组织之一，UQCSSA继续在促进其成员之间的归属感<br/>和友情方面发挥着至关重要的作用。它为个人成长、领导力发展和共同兴趣的探索提供了一个平台。UQCSSA不仅仅是一个学生组织；它是一个重视多样性、包容性和知识追求的社群。
          </motion.p>
        </div>
        {/* featured items */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
          className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16'
        >
          {featured.map((feature, index) => {
            return (
              <div
                className='flex flex-col justify-center items-center gap-4 border p-10'
                key={index}
              >
                <div className='text-4xl bg-primary-300 text-white w-[600px] h-[200px] rounded-full flex justify-center items-center'>
                  <Image src={`${feature.image}`} alt={feature.title} width={330} height={300} className="h-50 w-50" />
                  
                </div>
                <div className='flex flex-col justify-center items-center gap-2 text-center'>
                  <br/>
                  <h4 className='h4 text-2xl my-2 font-bold'>{feature.title}</h4>
                  <p>{feature.subtitle}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
        {/* achievements */}
        <motion.div
          variants={fadeIn('up', 1)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Achievements />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
