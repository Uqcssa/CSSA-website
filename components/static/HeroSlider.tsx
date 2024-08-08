'use client';

// import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';

// import swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// components
import CustomButton from './CustomButton';
import SwiperNavButtons from './SwiperNavButtons';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/variants';

const HeroSlider = () => {
  return (
    <Swiper className='h-full'>
      <SwiperSlide>
        <div className='h-full flex justify-end pt-48'>
          <div className='flex flex-col items-center lg:items-start lg:max-w-[700px]'>
            <motion.h1
              variants={fadeIn('up', 0.4)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className='h1 text-center lg:text-left mb-2'
            >
              <span className='text-red-600'>Where hard</span> work meets success
            </motion.h1>
            <motion.p
              variants={fadeIn('up', 0.6)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className='text-gray-600 italic text-center lg:text-left mb-4'
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad dolor
              quo tenetur.
            </motion.p>
            <motion.div
              variants={fadeIn('up', 0.8)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
            >
              <CustomButton
                text='Get started'
                containerStyles='w-[196px] h-[62px]'
              />
            </motion.div>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className='h-full flex justify-end pt-48'>
          <div className='flex flex-col items-center lg:items-start lg:max-w-[700px]'>
            <motion.h1
              variants={fadeIn('up', 0.4)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className='h1 text-center lg:text-left mb-2'
            >
              <span className='text-red-600'>Where hard</span> work meets success
            </motion.h1>
            <motion.p
              variants={fadeIn('up', 0.6)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className='text-gray-600 italic text-center lg:text-left mb-4'
            >
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad dolor
              quo tenetur.
            </motion.p>
            <motion.div
              variants={fadeIn('up', 0.8)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
            >
              <CustomButton
                text='Get started'
                containerStyles='w-[196px] h-[62px]'
              />
            </motion.div>
          </div>
        </div>
      </SwiperSlide>

      {/* swiper nav buttons */}
      <SwiperNavButtons
        containerStyles='absolute bottom-2 lg:bottom-0 right-0 h-[130px] w-full lg:w-[700px] z-50 flex justify-center lg:justify-start gap-1'
        btnStyles='border border-accent text-white w-[56px] h-[56px] flex justify-center items-center hover:bg-accent transition-all duration-300'
        iconStyles='text-2xl'
      />
    </Swiper>
  );
};

export default HeroSlider;
