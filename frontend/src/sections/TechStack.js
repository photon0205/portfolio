import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GitPullRequest, Terminal } from 'lucide-react';

export const TechStack = ({ experiences = [], opensource = [] }) => {
  // Sort experiences by start_date (most recent first)
  const sortedExperiences = useMemo(() => {
    if (!experiences || experiences.length === 0) return [];
    return [...experiences].sort((a, b) => 
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [experiences]);

  if ((!experiences || experiences.length === 0) && (!opensource || opensource.length === 0)) {
    return <TechStackSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Experience Timeline */}
      <div className="w-full lg:w-3/5 overflow-y-auto custom-scrollbar pr-4">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b border-white/10">
          <Briefcase className="text-primary" /> PROFESSIONAL TRAJECTORY
        </h3>
        
        <div className="space-y-12 relative border-l border-white/10 ml-3 pl-8">
          {sortedExperiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-background bg-primary" />
              
              <div className="mb-2">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                   {exp.start_date} — {exp.end_date || 'PRESENT'}
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-white">{exp.title}</h4>
              <div className="text-sm font-mono text-textMuted mb-4 flex items-center gap-2">
                <span className="text-white">{exp.company}</span> • {exp.location}
              </div>
              
              <ul className="space-y-2 mb-4">
                {exp.description?.map((item) => (
                  <li key={item.id} className="text-sm text-textMuted leading-relaxed flex items-start gap-2">
                    <span className="text-primary mt-1.5 w-1 h-1 bg-primary rounded-full block shrink-0"></span>
                    {item.point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                 {exp.skills_used?.map(skill => (
                    <span key={skill.id} className="text-[10px] px-2 py-0.5 border border-white/5 bg-white/5 rounded text-gray-400">
                        {skill.name}
                    </span>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Source Side Panel */}
      <div className="w-full lg:w-2/5 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        
        {/* Open Source Block */}
        {opensource && opensource.length > 0 && (
          <div className="bg-surfaceHighlight/20 border border-white/10 rounded-xl p-6">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <GitPullRequest className="text-accent" /> OPEN SOURCE
             </h3>
             
             <div className="space-y-6">
               {opensource.map(os => (
                 <div key={os.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-white group-hover:text-accent transition-colors">
                          <a href={os.repo_link} target="_blank" rel="noopener noreferrer">{os.name}</a>
                      </h5>
                      <ExternalLinkIcon />
                    </div>
                    <p className="text-xs text-textMuted mb-3">{os.caption}</p>
                    <div className="space-y-2">
                      {os.contributions?.map(c => (
                          <a 
                              key={c.id} 
                              href={c.pr_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-black/40 hover:bg-white/5 rounded border border-white/5 hover:border-white/20 transition-all text-xs"
                          >
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  c.contribution_type?.slug === 'bfix' ? 'bg-red-500' :
                                  c.contribution_type?.slug === 'feat' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                              <span className="text-gray-300">{c.description}</span>
                          </a>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExternalLinkIcon = () => (
    <svg className="w-3 h-3 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const TechStackSkeleton = () => (
  <div className="flex flex-col lg:flex-row h-full gap-8 animate-pulse">
    <div className="w-full lg:w-3/5 space-y-8">
      <div className="h-8 bg-white/10 rounded w-1/3"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="border-l border-white/10 ml-3 pl-8">
          <div className="h-6 bg-primary/20 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
          <div className="h-20 bg-white/5 rounded w-full"></div>
        </div>
      ))}
    </div>
    <div className="w-full lg:w-2/5">
      <div className="h-64 bg-white/5 rounded-xl border border-white/10"></div>
    </div>
  </div>
);

export const TechBackground = () => (
  <div className="w-full h-full relative opacity-20 overflow-hidden">
     <div className="absolute inset-0 flex items-center justify-center">
        <Terminal className="w-96 h-96 text-white/5" />
     </div>
     <svg className="absolute inset-0 w-full h-full">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
     </svg>
  </div>
);

