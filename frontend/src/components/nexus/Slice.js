import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const Slice = ({
  id,
  title,
  subtitle,
  isActive,
  isHovered,
  index,
  total,
  onActivate,
  onHover,
  children,
  bgContent,
  disableParentScroll = false,
  ...props
}) => {
  return (
    <motion.div
      layout
      onMouseEnter={() => !isActive && onHover(id)}
      onMouseLeave={() => !isActive && onHover(null)}
      onClick={(e) => {
        // Only activate if click is not on an interactive element
        if (!e.target.closest('button, a, [role="button"]')) {
          onActivate(id);
        }
      }}
      className={`
        relative h-full flex flex-col border-r border-white/5 overflow-hidden
        transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isActive ? 'flex-[12]' : 'flex-[1] hover:flex-[2] cursor-pointer'}
        bg-background/80 backdrop-blur-sm group
      `}
      {...props}
    >
      {/* Inactive State Visuals (Vertical Label) */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-transparent to-black/80"
          >
            {/* Background Abstract Visuals for inactive state */}
            <div className="absolute inset-0 opacity-20 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500">
               {bgContent}
            </div>

            {/* Vertical Text */}
            <div className="h-full flex flex-col justify-between py-12 items-center z-20 mix-blend-screen">
              <span className="text-xs font-mono text-textMuted/50">0{index + 1}</span>
              <h2 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-white to-white/50 whitespace-nowrap tracking-tighter"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                {title}
              </h2>
              <ChevronRight className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active State Content */}
      <div className={`relative w-full h-full ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`w-full h-full overflow-x-hidden ${disableParentScroll ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
          >
             {/* Sticky Header inside the slice */}
            <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-white/10" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
              <div className="flex items-center" style={{ paddingLeft: id === 'hero' ? 'calc(2rem + 1.75rem + 1rem)' : '2rem' }}>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tighter leading-[1.75rem] whitespace-nowrap" style={{ display: 'flex', alignItems: 'center', height: '1.75rem' }}>
                  {title}
                </h2>
              </div>
            </div>
            
            {disableParentScroll ? (
              <div className="h-full flex flex-col">
                {children}
              </div>
            ) : (
              <div className="p-6 md:p-12 pb-20">
                {children}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

