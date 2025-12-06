import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Layers, Calendar, Building2 } from 'lucide-react';

// Helper to handle image URLs from API
const getImageUrl = (path) => {
  if (!path) return null;
  // If it starts with /api, it's from our backend
  if (path.startsWith('/api')) {
    return path; // Let the browser handle it (will be proxied in dev, served in prod)
  }
  return path;
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

  useEffect(() => {
    if (sortedProjects.length > 0 && !activeProject) {
      setActiveProject(sortedProjects[0]);
    }
  }, [sortedProjects, activeProject]);

  if (!projects || projects.length === 0) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full px-6 md:px-12">
      {/* List / Selector */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto project-list-scrollbar pr-2 pt-8" style={{ height: 'calc(100vh - 140px)', maxHeight: 'calc(100vh - 140px)' }}>
        {sortedProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p)}
            className={`text-left p-6 border transition-all duration-300 group relative overflow-hidden shrink-0 ${
              activeProject?.id === p.id 
              ? 'border-primary bg-primary/10' 
              : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-transform duration-500 ${activeProject?.id === p.id ? 'translate-x-0' : '-translate-x-full'}`} />
            
            <div className="relative z-10">
              <span className="text-xs font-mono text-primary mb-1 block uppercase">{p.category?.name || 'Project'}</span>
              <h3 className="text-lg font-bold text-white group-hover:translate-x-2 transition-transform leading-tight">{p.title}</h3>
              <p className="text-xs text-textMuted mt-2 line-clamp-2">{p.caption}</p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                {p.skills_used?.slice(0, 3).map(skill => (
                  <span key={skill.id} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-black/50 rounded text-textMuted border border-white/5">
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
      <div className="w-full lg:w-2/3 relative overflow-y-auto project-details-scrollbar pt-8 pb-8" style={{ height: 'calc(100vh - 140px)', maxHeight: 'calc(100vh - 140px)' }}>
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="bg-surfaceHighlight/50 border border-white/10 rounded-xl overflow-hidden p-1 flex flex-col"
            >
              {/* Image Area */}
              {activeProject.images && activeProject.images.length > 0 && (
                <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-t-lg shrink-0">
                  <img 
                    src={getImageUrl(activeProject.images[0]?.image)} 
                    alt={activeProject.title} 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                     <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeProject.title}</h2>
                     <div className="flex items-center gap-4 text-xs font-mono text-textMuted">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {activeProject.organisation}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activeProject.start_date}</span>
                     </div>
                  </div>

                  <div className="flex gap-3">
                    {activeProject.github_link && (
                      <a href={activeProject.github_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white" title="View Source">
                          <Github className="w-5 h-5" />
                      </a>
                    )}
                    {activeProject.live_demo_link && (
                      <a href={activeProject.live_demo_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary rounded-full hover:bg-primaryGlow transition-colors text-white" title="Live Demo">
                          <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-textMuted leading-relaxed mb-8">
                  <p>{activeProject.description}</p>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <h4 className="text-sm font-mono text-primary mb-4 flex items-center gap-2">
                     <Layers className="w-4 h-4" /> TECH STACK
                   </h4>
                   <div className="flex flex-wrap gap-2">
                     {activeProject.skills_used?.map(skill => (
                       <span key={skill.id} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white transition-colors cursor-default">
                         {skill.name}
                       </span>
                     ))}
                   </div>
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
    {[1,2,3,4].map(i => (
      <div key={i} className="h-24 bg-white/10 rounded w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
    ))}
  </div>
);

