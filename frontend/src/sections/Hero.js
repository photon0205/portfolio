import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Terminal, Cpu, MapPin } from 'lucide-react';

export const Hero = ({ about, projectCount, experiences, onNavigateToProjects }) => {
  if (!about) return <HeroSkeleton />;

  return (
    <div className="max-w-4xl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tighter">
          {about.name}
        </h1>
        <p className="text-xl md:text-2xl text-primary font-mono mb-6">
          {about.current_role}
        </p>

        <p className="text-lg md:text-xl text-textMuted font-light mb-8 leading-relaxed max-w-2xl border-l-2 border-primary/50 pl-6">
          {about.subtitle}
        </p>

        {about.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border border-white/10 bg-white/5 p-5 rounded-lg backdrop-blur-sm hover:border-primary/50 transition-colors group">
              <Terminal className="w-7 h-7 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">Full-Stack Development</h3>
              <p className="text-textMuted text-sm">
                Building scalable web applications with modern frameworks and robust backend architectures.
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-5 rounded-lg backdrop-blur-sm hover:border-accent/50 transition-colors group">
              <Cpu className="w-7 h-7 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">AI & Systems</h3>
              <p className="text-textMuted text-sm">
                Integrating AI/ML solutions and building intelligent systems for production environments.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onNavigateToProjects) {
                onNavigateToProjects();
              } else {
                window.dispatchEvent(new CustomEvent('activateSection', { detail: 'work' }));
              }
            }}
            className="px-8 py-4 bg-primary text-white font-mono font-bold rounded-sm hover:bg-primaryGlow transition-all flex items-center gap-2 group cursor-pointer"
          >
            VIEW PROJECTS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          {about.resume && (
            <a 
              href={about.resume}
              target="_blank"
              rel="noopener noreferrer" 
              className="px-8 py-4 border border-white/20 text-white font-mono rounded-sm hover:bg-white/5 transition-all flex items-center gap-2"
            >
              RESUME <Download className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Status Stream */}
        <div className="mt-12 pt-6 border-t border-white/10 font-mono text-xs text-textMuted flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>
          {(() => {
            // Get current location from most recent experience
            const currentExp = experiences?.find(exp => !exp.end_date);
            const location = currentExp?.location || experiences?.[0]?.location;
            return location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary" />
                <span>LOCATION: {location.toUpperCase()}</span>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
};

const HeroSkeleton = () => (
  <div className="max-w-4xl animate-pulse">
    <div className="h-16 bg-white/10 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-primary/20 rounded w-1/2 mb-8"></div>
    <div className="h-24 bg-white/5 rounded w-full border-l-2 border-primary/50 pl-6 mb-12"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="h-40 bg-white/5 rounded border border-white/10"></div>
      <div className="h-40 bg-white/5 rounded border border-white/10"></div>
    </div>
    <div className="flex gap-4">
      <div className="h-14 w-40 bg-primary/30 rounded"></div>
      <div className="h-14 w-40 bg-white/10 rounded"></div>
    </div>
  </div>
);

export const HeroBackground = () => (
  <div className="w-full h-full flex items-center justify-center opacity-30">
    <div className="relative w-48 h-48">
      <div className="absolute inset-0 border-2 border-primary rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-4 border-2 border-accent rounded-full animate-[spin_15s_linear_infinite_reverse]" />
      <div className="absolute inset-8 border border-white/50 rounded-full" />
    </div>
  </div>
);

