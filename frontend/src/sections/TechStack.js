import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GitPullRequest, Terminal } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ordinal = (d) => {
  if (d >= 11 && d <= 13) return `${d}th`;
  switch (d % 10) {
    case 1: return `${d}st`;
    case 2: return `${d}nd`;
    case 3: return `${d}rd`;
    default: return `${d}th`;
  }
};

const parseLocal = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const fmtDateObj = (d) => `${ordinal(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

const fmtDate = (dateStr) => {
  if (!dateStr) return 'Present';
  return fmtDateObj(parseLocal(dateStr));
};

export const TechStack = ({ experiences = [], opensource = [] }) => {
  const groupedExperiences = useMemo(() => {
    if (!experiences || experiences.length === 0) return [];

    const groups = [];
    [...experiences].forEach(exp => {
      const existing = groups.find(g => g.company === exp.company);
      const expStart = parseLocal(exp.start_date);
      const expEnd = exp.end_date ? parseLocal(exp.end_date) : null;
      if (existing) {
        existing.roles.push(exp);
        if (expStart > existing.latestStart) existing.latestStart = expStart;
        if (expStart < existing.earliestStart) existing.earliestStart = expStart;
        if (expEnd === null) existing.latestEnd = null;
        else if (existing.latestEnd !== null && expEnd > existing.latestEnd) existing.latestEnd = expEnd;
      } else {
        groups.push({ company: exp.company, website: exp.website, roles: [exp], latestStart: expStart, earliestStart: expStart, latestEnd: expEnd });
      }
    });

    groups.sort((a, b) => b.latestStart - a.latestStart);
    groups.forEach(g => g.roles.sort((a, b) => parseLocal(b.start_date) - parseLocal(a.start_date)));
    return groups;
  }, [experiences]);

  if ((!experiences || experiences.length === 0) && (!opensource || opensource.length === 0)) {
    return <TechStackSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-w-0">
      {/* Experience Timeline */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0">
        <h3 className="text-base md:text-xl font-bold text-white mb-6 md:mb-8 flex items-center gap-2 border-b border-white/10 pb-3">
          <Briefcase className="text-primary w-4 h-4 md:w-5 md:h-5 shrink-0" /> PROFESSIONAL TRAJECTORY
        </h3>

        <div className="space-y-8 md:space-y-12 relative border-l border-white/10 ml-3 pl-6 md:pl-8">
          {groupedExperiences.map((group, groupIndex) => (
            <motion.div
              key={group.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-background bg-primary" />

              {/* Company date span */}
              <div className="mb-2">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {fmtDateObj(group.earliestStart)} — {group.latestEnd ? fmtDateObj(group.latestEnd) : 'Present'}
                </span>
              </div>

              {/* Company name */}
              <h4 className="text-base md:text-xl font-bold text-white mb-3 md:mb-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <a href={group.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {group.company}
                </a>
              </h4>

              {group.roles.length > 1 ? (
                /* Multi-role: stacked with dividers, no inner dots/lines */
                <div>
                  {group.roles.map((role, roleIdx) => (
                    <div key={role.id} className={roleIdx > 0 ? 'border-t border-white/10 pt-5 mt-5' : ''}>
                      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                        <h5 className="text-sm md:text-base font-bold text-white text-break" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{role.title}</h5>
                        <span className="text-[10px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded shrink-0">
                          {fmtDate(role.start_date)} — {role.end_date ? fmtDate(role.end_date) : 'Present'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-textMuted mb-2 md:mb-3">{role.location}</div>

                      <ul className="space-y-2 md:space-y-3 mb-3 w-full max-w-full">
                        {role.description?.map(item => (
                          <li key={item.id} className="text-xs md:text-sm text-textMuted leading-relaxed flex items-start gap-2 md:gap-3" style={{ width: '100%' }}>
                            <span className="mt-2 w-1 h-1 bg-primary rounded-full block shrink-0" />
                            <div
                              className="text-break text-justify"
                              style={{ lineHeight: '1.5' }}
                              dangerouslySetInnerHTML={{ __html: item.point?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}
                            />
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {role.skills_used?.map(skill => (
                          <span key={skill.id} className="text-[10px] px-2 py-0.5 border border-white/5 bg-white/5 rounded text-gray-400">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single role: flat render */
                <div>
                  <div className="text-xs md:text-sm font-mono text-textMuted mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
                    <span className="text-white/80 text-break" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{group.roles[0].title}</span> • <span className="text-break">{group.roles[0].location}</span>
                  </div>

                  <ul className="space-y-2 md:space-y-3 mb-3 md:mb-4 w-full max-w-full">
                    {group.roles[0].description?.map(item => (
                      <li key={item.id} className="text-xs md:text-sm text-textMuted leading-relaxed flex items-start gap-2 md:gap-3" style={{ width: '100%' }}>
                        <span className="mt-2 w-1 h-1 bg-primary rounded-full block shrink-0" />
                        <div
                          className="text-break text-justify"
                          style={{ lineHeight: '1.5' }}
                          dangerouslySetInnerHTML={{ __html: item.point?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {group.roles[0].skills_used?.map(skill => (
                      <span key={skill.id} className="text-[10px] px-2 py-0.5 border border-white/5 bg-white/5 rounded text-gray-400">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Source Side Panel */}
      <div className="w-full lg:w-[320px] lg:min-w-[280px] lg:max-w-[360px] flex flex-col gap-8 shrink-0">
        
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
                    <p className="text-xs text-textMuted mb-3 leading-relaxed text-break">{os.caption}</p>
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

