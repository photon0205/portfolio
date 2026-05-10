import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Terminal, Cpu, MapPin } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return null;
  return path;
};

const ProfileFlip = ({ photo, avatar }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative shrink-0 w-[88px] h-[88px] md:w-[108px] md:h-[108px] cursor-pointer group/flip"
      style={{ perspective: '800px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
      title="Hover / click to toggle"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — real photo */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-primary/40 shadow-lg shadow-primary/10"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {photo ? (
            <img
              src={photo}
              alt="Profile photo"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">S</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
          <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-mono text-white/50 tracking-widest uppercase">photo</span>
        </div>

        {/* Back — avatar */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-accent/50 shadow-lg shadow-accent/10"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent text-3xl font-bold">S</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
          <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-mono text-white/50 tracking-widest uppercase">avatar</span>
        </div>
      </motion.div>

      {/* Animated ring hint on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover/flip:ring-white/25 transition-all duration-300 pointer-events-none" />
      <div className="absolute -bottom-5 left-0 right-0 text-center text-[8px] font-mono text-white/25 opacity-0 group-hover/flip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        ← flip →
      </div>
    </div>
  );
};

export const Hero = ({ about, projectCount, experiences, onNavigateToProjects }) => {
  if (!about) return <HeroSkeleton />;

  const currentExp = experiences?.find(exp => !exp.end_date);
  const location = currentExp?.location || experiences?.[0]?.location;

  return (
    <div className="max-w-4xl min-w-[320px] w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Profile header — flip card + name/role */}
        <div className="flex items-center gap-5 mb-7">
          <ProfileFlip
            photo={getImageUrl(about.profile_picture)}
            avatar={getImageUrl(about.avatar)}
          />
          <div className="min-w-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-tight">
              {about.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-mono mt-1">
              {about.current_role}
            </p>
          </div>
        </div>

        <p className="text-lg md:text-xl text-textMuted font-light mb-10 leading-relaxed max-w-2xl border-l-2 border-primary/50 pl-6">
          {about.subtitle}
        </p>

        {about.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

        <div className="flex flex-wrap gap-4 mb-10">
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
        <div className="mt-14 pt-6 border-t border-white/10 font-mono text-xs text-textMuted flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" />
              <span>LOCATION: {location.toUpperCase()}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const HeroSkeleton = () => (
  <div className="max-w-4xl animate-pulse">
    <div className="flex items-center gap-5 mb-5">
      <div className="w-24 h-24 bg-white/10 rounded-2xl shrink-0" />
      <div className="flex-1">
        <div className="h-12 bg-white/10 rounded w-3/4 mb-3" />
        <div className="h-6 bg-primary/20 rounded w-1/2" />
      </div>
    </div>
    <div className="h-24 bg-white/5 rounded w-full border-l-2 border-primary/50 pl-6 mb-12" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="h-40 bg-white/5 rounded border border-white/10" />
      <div className="h-40 bg-white/5 rounded border border-white/10" />
    </div>
    <div className="flex gap-4">
      <div className="h-14 w-40 bg-primary/30 rounded" />
      <div className="h-14 w-40 bg-white/10 rounded" />
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
