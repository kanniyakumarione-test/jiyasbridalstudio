import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Play, ZoomIn } from 'lucide-react';

const CinematicGrid = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Lock scroll when theater mode is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItem]);

  // Bento Logic: Assign specific layout classes based on index/type to create a visual rhythm
  const getBentoClass = (index) => {
    const patterns = [
      'col-span-2 row-span-2', // Large feature
      'col-span-1 row-span-1', // Standard
      'col-span-1 row-span-2', // Tall
      'col-span-2 row-span-1', // Wide
      'col-span-1 row-span-1', // Standard
      'col-span-1 row-span-1', // Standard
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="relative px-[5%] py-20 bg-[#050505]">
      {/* Editorial Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.015 }}
            className={`group relative rounded-3xl overflow-hidden cursor-pointer transform-gpu ${item.type === 'text' ? 'bg-transparent border-none' : 'bg-[#0a0a0a] border border-white/5'} ${getBentoClass(idx)}`}
            onClick={() => item.type !== 'text' && setSelectedItem(item)}
          >
            {/* Conditional Rendering: Media vs Text Content */}
            {item.type === 'text' ? (
              <div className="w-full h-full flex flex-col justify-center p-8 md:p-12 border border-accent/20 bg-accent/[0.03] rounded-3xl backdrop-blur-sm">
                <div className="text-accent text-[0.6rem] font-bold uppercase tracking-[0.4em] mb-6">{item.label}</div>
                <h3 className="text-2xl md:text-3xl font-heading text-white leading-tight mb-6">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">{item.description}</p>
                <div className="mt-auto h-px w-12 bg-accent/30" />
              </div>
            ) : (
              <div className="w-full h-full relative overflow-hidden">
                {item.type === 'video' ? (
                  <SmartVideo src={item.src} />
                ) : (
                  <SmartImage src={item.src} alt={item.title} />
                )}
                
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Label on Hover */}
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[0.55rem] font-bold uppercase tracking-[0.4em] text-accent mb-2">{item.category}</div>
                        <div className="text-base font-heading text-white tracking-wide">{item.title}</div>
                      </div>
                      <div className="p-3.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                        {item.type === 'video' ? <Play className="h-4 w-4 text-white fill-white" /> : <Maximize2 className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Theater Mode (Lightbox) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/90"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full aspect-video md:aspect-auto md:h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.src}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <SmartImage src={selectedItem.src} alt={selectedItem.title} className="object-contain" />
              )}

              {/* Lightbox Controls */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all text-white group"
              >
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none">
                <div className="text-accent text-[0.7rem] font-bold uppercase tracking-[0.4em] mb-2">{selectedItem.category}</div>
                <h3 className="text-3xl font-heading text-white">{selectedItem.title}</h3>
                <p className="mt-4 text-white/40 text-sm max-w-2xl">Studio archive capture from the Jiya's Unisex Salon & Hair Studio collection.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SmartImage = ({ src, alt, className = "object-cover" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative">
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`w-full h-full ${className} transition-transform duration-1000 group-hover:scale-110`}
        loading="lazy"
      />
      {/* Skeleton / Shimmer Effect */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />
      )}
    </div>
  );
};

const SmartVideo = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      muted
      loop
      playsInline
    />
  );
};

export default CinematicGrid;
