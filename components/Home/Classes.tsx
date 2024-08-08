'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';

import Department from './Department';

const classes = [
  {
    name: '传媒部',
    img: "/assets/uq/media1.jpg",
    description:
      '我们是UQCSSA的形象护卫者！,无论是大到UQCSSA各个活动的宣传和记录，还是小到为同学种草好吃不贵的高性价比店铺，都是传媒的业务内容。',
    herfs: "/members/media"
  },
  {
    name: '活动部',
    img: "/assets/uq/introduction/eventsDepartment.webp",
    description:
      '我们是UQCSSA的社（交）恐（怖）人基地。只要有活动，就归我们管！活动部负责UQCSSA中大型的活动的举办，为UQ学生带来各种各样有趣的活动就是我们的目标！',
    herfs: "/members/eventG"
  },
  {
    name: '职规部',
    img: "/assets/uq/introduction/Working.webp",
    description:
      '我们作为UQCSSA的核心部门之一，一直在为UQ华人学生提供有关学业以及日后职业方面的规划服务。无论是昆州移民政策，还是学业选课指导，职规部成员都可以为所有求助的华人学生提供专业的指导。',
    herfs: "/members/working"
  },
  {
    name: '外联部',
    img: "/assets/uq/introduction/marketing.webp",
    description:
      '我们作为UQCSSA背后的财政后盾， 旨在于保证学联财政和日常支出，沟通联络商家，让UQCSSA与布里斯班多家企业和商家保持良好合作关系。',
    herfs: "/members/marketing"
  },
];

const Classes = () => {
  return (
    <section id='class'>
      <motion.div
        variants={fadeIn('up', 0.6)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: false, amount: 0.2 }}
        className='grid grid-cols-1 lg:grid-cols-2'
      >
        {classes.map((item, index) => {
          return (
            <div
              className='relative w-full h-[300px] lg:h-[485px] flex flex-col justify-center items-center'
              key={index}
            >
              {/* overlay */}
              <div className='bg-black/50 absolute w-full h-full top-0 z-10'></div>
              <Image src={item.img} fill className='object-cover' alt='' />
              {/* text & btn */}
              <div className='z-30 max-w-[380px] text-center flex flex-col items-center justify-center gap-4'>
                <motion.h3
                  variants={fadeIn('up', 0.4)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{ once: false, amount: 0.2 }}
                  className='h3 text-4xl text-white'
                >
                  {item.name}
                </motion.h3>
                <motion.p
                  variants={fadeIn('up', 0.6)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{ once: false, amount: 0.2 }}
                  className='text-white'
                >
                  {item.description}
                </motion.p>
                <motion.div
                  variants={fadeIn('up', 0.8)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Department
                    containerStyles='w-[164px] h-[46px]'
                    text='Read more'
                    hrefs={`${item.herfs}`}
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Classes;
