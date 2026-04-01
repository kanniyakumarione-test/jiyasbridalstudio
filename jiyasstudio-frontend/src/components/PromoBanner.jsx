import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  const [promo, setPromo] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

  useEffect(() => {
    const fetchPromo = async () => {
      if (!scriptUrl) return;
      try {
        const resp = await fetch(`${scriptUrl}?entity=Promotions`);
        const data = await resp.json();
        if (data.status === 'success' && data.data && data.data.length > 0) {
          // Find the most recent active promotion
          const activePromos = data.data.filter(p => String(p.isActive).toLowerCase() === 'true');
          if (activePromos.length > 0) {
            setPromo(activePromos[activePromos.length - 1]);
          }
        }
      } catch (err) {
        console.error('Error fetching promo:', err);
      }
    };
    fetchPromo();
  }, [scriptUrl]);

  if (!promo || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[10000] bg-[#CBB279] py-2 px-4 shadow-lg overflow-hidden"
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        
        <div className="relative flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-black/10">
              <Megaphone className="h-3 w-3 text-black" />
            </div>
            <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.15em] text-black">
              {promo.text}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {promo.link && (
              <Link 
                to={promo.link} 
                className="group flex items-center gap-1.5 text-[0.6rem] sm:text-[0.7rem] font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors"
                onClick={() => setIsVisible(false)}
              >
                Learn More
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="h-3.5 w-3.5 text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;
