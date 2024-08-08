'use client';

import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from './CustomButton';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';

const trainerData = [
  {
    image: '/assets/uq/主席团/钱稳之.jpg',
    name: '钱稳之',
    role: 'UQCSSA 主席',
    description:
      '有高水平的集体，才有高水平的个人',
    social: [
      { icon: FaFacebook, href: 'http://facebook.com' },
      { icon: FaTwitter, href: 'http://twitter.com' },
      { icon: FaYoutube, href: 'http://youtube.com' },
    ],
  },
  {
    image: "/assets/uq/主席团/杨皓.jpg",
    name: '杨昊',
    role: 'UQCSSA 副主席',
    description:
      '善待你的爱好，别让它们为学习让路 要让它们替学习服务。',
    social: [
      { icon: FaFacebook, href: 'http://facebook.com' },
      { icon: FaTwitter, href: 'http://twitter.com' },
      { icon: FaYoutube, href: 'http://youtube.com' },
    ],
  },
  {
    image: '/assets/uq/主席团/李雨琪.jpg',
    name: '李雨琪',
    role: 'UQCSSA 副主席',
    description:
      '总想赢者必输，不怕输者必赢。',
    social: [
      { icon: FaFacebook, href: 'http://facebook.com' },
      { icon: FaTwitter, href: 'http://twitter.com' },
      { icon: FaYoutube, href: 'http://youtube.com' },
    ],
  },
  {
    image: '/assets/uq/主席团/陈诺.jpg',
    name: '陈诺',
    role: 'UQCSSA 财长',
    description:
      '向竞争挑战，向压力挑战，更要向自己挑战。',
    social: [
      { icon: FaFacebook, href: 'http://facebook.com' },
      { icon: FaTwitter, href: 'http://twitter.com' },
      { icon: FaYoutube, href: 'http://youtube.com' },
    ],
  },
  {
    image: '/assets/uq/主席团/刘威.jpg',
    name: '刘威',
    role: 'UQCSSA 秘书长',
    description:
      '选择你所喜欢的，喜欢你所选择的。',
    social: [
      { icon: FaFacebook, href: 'http://facebook.com' },
      { icon: FaTwitter, href: 'http://twitter.com' },
      { icon: FaYoutube, href: 'http://youtube.com' },
    ],
  },
 
];

const Team = () => {
  return (
    <section className='py-12 xl:h-[110vh]' id='team'>
      <div className='container mx-auto h-full flex flex-col items-center justify-center'>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <motion.h2
          variants={fadeIn('up', 0.4)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
          className='h2 text-center mb-6 text-6xl text-bold my-32'
        >
          主席团
        </motion.h2>
        {/* trainers grid */}
        <motion.div
          variants={fadeIn('up', 0.6)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
          className='grid grid-cols-1 mt-11 md:grid-cols-2 xl:grid-cols-4 gap-12 mb-12'
        >
          {trainerData.map((trainer, index) => {
            return (
              <div
                className='flex flex-col items-center text-center'
                key={index}
              >
                {/* image */}
                <div className='relative w-[320px] h-[360px] mx-auto mb-4'>
                  <Image src={trainer.image} fill alt='' />
                </div>
                {/* name */}
                <h4 className='h4 mb-2'>{trainer.name}</h4>
                {/* role */}
                <p className='uppercase text-xs tracking-[3px] mb-2'>
                  {trainer.role}
                </p>
                {/* description */}
                <p className='mb-6 max-w-[320px] mx-auto'>
                  {trainer.description}
                </p>
                {/* socials */}
                {/* <div className='flex gap-12 justify-center'>
                  {trainer.social.map((social, index) => {
                    return (
                      <div key={index}>
                        <Link
                          href={social.href}
                          className='hover:text-accent transition-all'
                        >
                          <social.icon className='text-lg' />
                        </Link>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            );
          })}
        </motion.div>
        {/* btn */}
        <motion.div
          variants={fadeIn('up', 0.6)}
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.2 }}
        >
          <CustomButton
            containerStyles='w-[196px] h-[62px]'
            text='了解更多'
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
