import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Layers, Calendar, Building2, ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

// Helper to handle image URLs from API
const getImageUrl = (path) => {
  if (!path) return null;
  // If it starts with /api, it's from our backend
  if (path.startsWith('/api')) {
    return path; // Let the browser handle it (will be proxied in dev, served in prod)
  }
  return path;
};

// Helper to get thumbnail: prefer "Overview" category, fallback to first image
const getThumbnail = (project) => {
  if (!project.images || project.images.length === 0) return null;
  return project.images.find(img => img.category === 'Overview') || project.images[0];
};

// Helper to get project highlights with fallback to bold phrases
const getHighlights = (project) => {
  if (Array.isArray(project.highlights) && project.highlights.length > 0) {
    return project.highlights.slice(0, 5);
  }
  // Fallback: extract first 4 unique **bold** phrases from description
  const matches = [...(project.description || '').matchAll(/\*\*(.+?)\*\*/g)];
  const seen = new Set();
  const bullets = [];
  for (const m of matches) {
    const phrase = m[1].trim();
    if (phrase.length > 4 && phrase.length < 140 && !seen.has(phrase.toLowerCase())) {
      seen.add(phrase.toLowerCase());
      bullets.push(phrase);
    }
    if (bullets.length >= 4) break;
  }
  return bullets;
};

// Helper to parse structured sections from project description
const parseProjectSections = (description) => {
  if (!description) return { intro: '', sections: [] };
  
  // Common section patterns (case insensitive, flexible punctuation)
  const sectionPatterns = [
    /\*\*(The [Cc]hallenge|Challenge):\*\*/g,
    /\*\*(Architecture & [Ee]xecution|Architecture & Execution|Architecture):\*\*/g,
    /\*\*(Impact|Results|Outcome):\*\*/g,
    /\*\*(Implementation|Technical Details):\*\*/g,
    /\*\*(Features|Key Features):\*\*/g,
    /\*\*(Challenges|Problems Solved):\*\*/g
  ];
  
  // Find all section headers
  const sectionMatches = [];
  sectionPatterns.forEach(pattern => {
    const matches = [...description.matchAll(pattern)];
    matches.forEach(match => {
      sectionMatches.push({
        title: match[1],
        start: match.index,
        fullMatch: match[0]
      });
    });
  });
  
  // Sort by position in text
  sectionMatches.sort((a, b) => a.start - b.start);
  
  if (sectionMatches.length === 0) {
    // No structured sections found, return as-is
    return {
      intro: description,
      sections: []
    };
  }
  
  // Extract intro (everything before first section)
  const intro = description.substring(0, sectionMatches[0].start).trim();
  
  // Extract sections
  const sections = [];
  for (let i = 0; i < sectionMatches.length; i++) {
    const current = sectionMatches[i];
    const next = sectionMatches[i + 1];
    
    const sectionStart = current.start + current.fullMatch.length;
    const sectionEnd = next ? next.start : description.length;
    const content = description.substring(sectionStart, sectionEnd).trim();
    
    sections.push({
      title: current.title,
      content: content
    });
  }
  
  return { intro, sections };
};

export const Projects = ({ projects = [], isActive = false }) => {
  // Sort projects by display_order
  const sortedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return [...projects].sort((a, b) => {
      const orderA = a.display_order !== undefined ? a.display_order : 999;
      const orderB = b.display_order !== undefined ? b.display_order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.start_date) - new Date(a.start_date);
    });
  }, [projects]);

  const [activeProject, setActiveProject] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (sortedProjects.length > 0 && !activeProject) {
      setActiveProject(sortedProjects[0]);
    }
  }, [sortedProjects, activeProject]);

  // Reset description collapse and carousel index when switching projects
  useEffect(() => {
    setShowFullDesc(false);
    setCurrentImageIndex(0);
  }, [activeProject?.id]);

  // Close lightbox on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setLightboxImage(null);
  }, []);
  useEffect(() => {
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxImage, handleKeyDown]);

  if (!projects || projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  return (
    <>
    <div className="projects-container projects-layout-stable gap-4 xl:gap-8 px-4 md:px-6 xl:px-12 min-w-0">
      {/* Mobile: Horizontal Tabs */}
      <div className="xl:hidden pt-4">
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
          {sortedProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeProject?.id === p.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-textMuted hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden xl:flex project-sidebar-stable flex-col gap-4 overflow-y-auto project-list-scrollbar pr-2 pt-8 shrink-0 max-h-full hover-stable">
        {sortedProjects.map((p) => {
          const isSelected = activeProject?.id === p.id;
          return (
            <motion.button
              key={p.id}
              onClick={() => setActiveProject(p)}
              whileHover={isActive && !isSelected ? { y: -3, transition: { duration: 0.18, ease: 'easeOut' } } : {}}
              className={`text-left p-6 border transition-colors duration-300 group relative overflow-hidden shrink-0 hover-stable ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-transform duration-500 ${isSelected ? 'translate-x-0' : '-translate-x-full'}`} />

              <div className="relative z-10">
                {/* Thumbnail preview */}
                {getThumbnail(p) && (
                  <div className="-mx-6 -mt-6 mb-3 overflow-hidden h-[72px] relative rounded-t-sm">
                    <img
                      src={getImageUrl(getThumbnail(p).image)}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                      onError={(e) => { e.target.closest('div').style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
                  </div>
                )}

                {/* Category label:
                    • section inactive → purple (text-primary)
                    • section active, this card selected → purple (contrasting with white title)
                    • section active, not selected → dimmed purple, brightens on hover */}
                <span className={`text-xs font-mono mb-1 block uppercase transition-colors duration-300 ${
                  !isActive
                    ? 'text-primary'
                    : isSelected
                      ? 'text-primary'
                      : 'text-primary/50 group-hover:text-primary'
                }`}>{p.category?.name || 'Project'}</span>

                {/* Title:
                    • section inactive → purple (both purple, no contrast)
                    • section active, selected → white (contrasting with purple category)
                    • section active, not selected → muted, brightens to white on hover */}
                <h3 className={`text-lg font-bold leading-tight text-break text-stable transition-colors duration-300 ${
                  !isActive
                    ? 'text-primary'
                    : isSelected
                      ? 'text-white'
                      : 'text-textMuted group-hover:text-white'
                }`}>{p.title}</h3>
                <p className="text-sm text-textMuted mt-2 leading-relaxed text-break text-stable">{p.caption}</p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {p.skills_used?.slice(0, 3).map(skill => (
                    <span key={skill.id} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-black/50 rounded text-textMuted border border-white/5 text-break">
                      {skill.name}
                    </span>
                  ))}
                  {p.skills_used?.length > 3 && (
                    <span className="text-[10px] px-2 py-1 bg-black/50 rounded text-textMuted border border-white/5">+{p.skills_used.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Details View */}
      <div className="project-content-stable relative overflow-y-auto project-details-scrollbar pt-0 xl:pt-8 pb-8 xl:max-h-none xl:h-full project-details-visible hover-stable">
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="bg-surfaceHighlight/50 border border-white/10 rounded-xl overflow-visible p-1 flex flex-col w-full max-w-full"
              style={{ minWidth: '0' }}
            >
              {/* Image Carousel */}
              {activeProject.images && activeProject.images.length > 0 && (
                <div
                  className="relative w-full overflow-hidden rounded-t-lg shrink-0 group/carousel"
                  style={{ aspectRatio: '16/10' }}
                >
                  {/* Current image */}
                  <img
                    key={currentImageIndex}
                    src={getImageUrl(activeProject.images[currentImageIndex]?.image)}
                    alt={`${activeProject.title} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-500 cursor-zoom-in"
                    onClick={() => setLightboxImage(getImageUrl(activeProject.images[currentImageIndex]?.image))}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

                  {/* Zoom hint */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 text-[11px] text-white/60 bg-black/40 px-2 py-0.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn className="w-3 h-3" /> click to zoom
                  </div>

                  {activeProject.images.length > 1 && (
                    <>
                      {/* Prev button */}
                      <button
                        onClick={() => setCurrentImageIndex(i => (i - 1 + activeProject.images.length) % activeProject.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10 opacity-0 group-hover/carousel:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Next button */}
                      <button
                        onClick={() => setCurrentImageIndex(i => (i + 1) % activeProject.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10 opacity-0 group-hover/carousel:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Counter badge */}
                      <div className="absolute top-3 right-3 text-[11px] text-white/70 bg-black/50 px-2 py-0.5 rounded-full font-mono">
                        {currentImageIndex + 1} / {activeProject.images.length}
                      </div>

                      {/* Dot indicators */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {activeProject.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`rounded-full transition-all duration-200 ${
                              i === currentImageIndex
                                ? 'w-4 h-1.5 bg-white'
                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="p-4 xl:p-8 w-full overflow-hidden">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-4 xl:mb-6 gap-3 xl:gap-4 w-full">
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="xl:hidden mb-2">
                      <span className="text-xs font-mono text-primary uppercase bg-primary/10 px-2 py-1 rounded">{activeProject.category?.name || 'Project'}</span>
                    </div>
                    <h2 className="text-xl xl:text-3xl font-bold text-white mb-2 text-break w-full">{activeProject.title}</h2>
                    <div className="flex items-center gap-2 xl:gap-4 text-xs font-mono text-textMuted flex-wrap">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3 shrink-0" /> <span className="text-break">{activeProject.organisation}</span></span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" /> {activeProject.start_date}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    {activeProject.github_link && (
                      <a href={activeProject.github_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white shrink-0" title="View Source">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {activeProject.live_demo_link && (
                      <a href={activeProject.live_demo_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary rounded-full hover:bg-primaryGlow transition-colors text-white shrink-0" title="Live Demo">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Highlights — skim layer */}
                {getHighlights(activeProject).length > 0 && (
                  <div className="mb-6 border-l-2 border-primary bg-primary/5 rounded-r-lg p-4 xl:p-5 hover-stable shrink-0">
                    <div className="text-[11px] font-mono text-primary uppercase tracking-wider mb-3">Highlights</div>
                    <ul className="space-y-2">
                      {getHighlights(activeProject).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/90 leading-snug">
                          <span className="mt-1.5 w-1 h-1 bg-primary rounded-full shrink-0" />
                          <span className="text-break text-stable text-justify flex-1 min-w-0">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack - part of skim layer */}
                <div className="mb-6 w-full">
                  <h4 className="text-sm font-mono text-primary mb-3 xl:mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> TECH STACK
                  </h4>
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {activeProject.skills_used?.map(skill => (
                      <span key={skill.id} className="px-2 xl:px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white transition-colors cursor-default text-break">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collapsible full description */}
                <div className="mb-6 xl:mb-8">
                  <button
                    onClick={() => setShowFullDesc(v => !v)}
                    className="flex items-center gap-2 text-sm font-mono text-primary hover:text-primaryGlow transition-colors mb-3"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullDesc ? 'rotate-180' : ''}`} />
                    {showFullDesc ? 'Hide full breakdown' : 'Read full breakdown'}
                  </button>

                  <AnimatePresence initial={false}>
                    {showFullDesc && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {(() => {
                          const { intro, sections } = parseProjectSections(activeProject.description);
                          
                          return (
                            <div className="prose prose-invert prose-enhanced text-textMuted leading-relaxed mb-6 xl:mb-8 w-full overflow-hidden shrink-0">
                              {/* Intro section */}
                              {intro && (
                                <div className="mb-6 text-sm xl:text-base text-break leading-relaxed text-justify">
                                  <div
                                    dangerouslySetInnerHTML={{ 
                                      __html: intro
                                        .replace(/\n\n/g, '<br/><br/>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Structured sections */}
                              {sections.length > 0 ? (
                                <div className="space-y-6">
                                  {sections.map((section, index) => (
                                    <div key={index} className="border-l-2 border-white/20 pl-4 xl:pl-6">
                                      <h4 className="text-primary font-semibold text-sm xl:text-base mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        {section.title}
                                      </h4>
                                      <div 
                                        className="text-textMuted text-sm xl:text-base leading-relaxed text-break text-justify"
                                        dangerouslySetInnerHTML={{ 
                                          __html: section.content
                                            .replace(/\n\n/g, '<br/><br/>')
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                // Fallback for projects without structured sections
                                intro ? null : (
                                  <div className="text-sm xl:text-base text-break leading-relaxed text-justify">
                                    <div
                                      dangerouslySetInnerHTML={{ 
                                        __html: activeProject.description
                                          ?.replace(/\n\n/g, '<br/><br/>')
                                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Lightbox overlay */}
    <AnimatePresence>
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            src={lightboxImage}
            alt="Project screenshot"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

const ProjectsSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-12 h-full animate-pulse">
    <div className="w-full lg:w-1/3 flex flex-col gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-40 bg-white/5 rounded border border-white/10"></div>
      ))}
    </div>
    <div className="w-full lg:w-2/3">
      <div className="h-full bg-white/5 rounded-xl border border-white/10"></div>
    </div>
  </div>
);

export const ProjectsBackground = () => (
  <div className="w-full h-full flex flex-col gap-4 p-4 opacity-20">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-24 bg-white/10 rounded w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
    ))}
  </div>
);

