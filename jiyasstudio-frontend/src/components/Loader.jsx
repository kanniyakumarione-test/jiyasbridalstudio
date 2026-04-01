import React from 'react';
import { motion as Motion } from 'framer-motion';

const Loader = () => {
  return (
    <Motion.div 
      key="global-loader-component"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100%', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center transform origin-top"
    >
       <Motion.img 
         src="/logo.png" 
         alt="Jiya's Studio"
         initial={{ scale: 0.85, opacity: 0, filter: 'blur(20px)' }}
         animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
         transition={{ duration: 0.7, ease: 'easeOut' }}
         className="w-[200px] md:w-[350px] drop-shadow-[0_0_40px_rgba(212,175,55,0.3)] mb-8"
         onError={(e) => e.target.style.display = 'none'}
       />
       <Motion.div 
         initial={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ delay: 0.15, duration: 0.6, ease: 'easeInOut' }}
         className="w-[250px] md:w-[400px] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent origin-center opacity-70"
       />
       <Motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.45 }}
           className="mt-[40px] font-heading tracking-[0.4em] text-accent/60 uppercase text-[0.8rem]"
       >
           Evoking Elegance
       </Motion.div>
    </Motion.div>
  );
};

export default Loader;
