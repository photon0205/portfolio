import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Layers, Calendar, Building2, ChevronDown } from 'lucide-react';

// Helper to handle image URLs from API
const getImageUrl = (path) => {
  if (!path) return null;
  // If it starts with /api, it's from our backend
  if (path.startsWith('/api')) {
    return path; // Let the browser handle it (will be proxied in dev, served in prod)
  }
  return path;
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

export const Projects = ({ projects = [] }) => {
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

  useEffect(() => {
    if (sortedProjects.length > 0 && !activeProject) {
      setActiveProject(sortedProjects[0]);
    }
  }, [sortedProjects, activeProject]);

  // Reset description collapse when switching projects
  useEffect(() => {
    setShowFullDesc(false);
  }, [activeProject?.id]);

  if (!projects || projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="projects-container gap-4 xl:gap-8 px-4 md:px-6 xl:px-12 min-w-0">
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
      <div className="hidden xl:flex xl:w-[320px] xl:min-w-[320px] xl:max-w-[360px] flex-col gap-4 overflow-y-auto project-list-scrollbar pr-2 pt-8 shrink-0 max-h-full flex-1">
        {sortedProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p)}
            className={`text-left p-6 border transition-all duration-300 group relative overflow-hidden shrink-0 ${activeProject?.id === p.id
                ? 'border-primary bg-primary/10'
                : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-transform duration-500 ${activeProject?.id === p.id ? 'translate-x-0' : '-translate-x-full'}`} />

            <div className="relative z-10">
              <span className="text-xs font-mono text-primary mb-1 block uppercase">{p.category?.name || 'Project'}</span>
              <h3 className="text-lg font-bold text-white group-hover:translate-x-2 transition-transform leading-tight text-break">{p.title}</h3>
              <p className="text-sm text-textMuted mt-2 line-clamp-3 leading-relaxed text-break">{p.caption}</p>

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
          </button>
        ))}
      </div>

      {/* Details View */}
      <div className="flex-1 min-w-0 relative overflow-y-auto project-details-scrollbar pt-0 xl:pt-8 pb-8 xl:max-h-none xl:h-full project-details-visible">
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="bg-surfaceHighlight/50 border border-white/10 rounded-xl overflow-visible p-1 flex flex-col w-full"
              style={{ minWidth: '0', maxWidth: '100%' }}
            >
              {/* Image Area */}
              {activeProject.images && activeProject.images.length > 0 && (
                <div className="relative h-40 xl:h-64 w-full overflow-hidden rounded-t-lg shrink-0">
                  <img
                    src={getImageUrl(activeProject.images[0]?.image)}
                    alt={activeProject.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
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
                  <div className="mb-6 border-l-2 border-primary bg-primary/5 rounded-r-lg p-4 xl:p-5">
                    <div className="text-[11px] font-mono text-primary uppercase tracking-wider mb-3">Highlights</div>
                    <ul className="space-y-2">
                      {getHighlights(activeProject).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/90 leading-snug">
                          <span className="mt-1.5 w-1 h-1 bg-primary rounded-full shrink-0" />
                          <span className="text-break">{h}</span>
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
                            <div className="prose prose-invert prose-enhanced text-textMuted leading-relaxed mb-6 xl:mb-8 w-full overflow-hidden">
                              {/* Intro section */}
                              {intro && (
                                <div className="mb-6 text-sm xl:text-base text-break leading-relaxed">
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
                                        className="text-textMuted text-sm xl:text-base leading-relaxed text-break"
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
                                  <div className="text-sm xl:text-base text-break leading-relaxed">
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

