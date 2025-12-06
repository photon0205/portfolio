import React, { useState, useEffect } from 'react';
import { Slice } from './components/nexus/Slice';
import { CustomCursor } from './components/nexus/CustomCursor';
import { Hero, HeroBackground } from './sections/Hero';
import { Projects, ProjectsBackground } from './sections/Projects';
import { TechStack, TechBackground } from './sections/TechStack';
import { About, AboutBackground } from './sections/About';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { fetchPortfolioData } from './services/portfolioService';
import logoImage from './assets/logo.png';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio data on mount
    useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Listen for section activation events
    const handleActivateSection = (e) => {
      setActiveSection(e.detail);
    };
    window.addEventListener('activateSection', handleActivateSection);
    return () => window.removeEventListener('activateSection', handleActivateSection);
  }, []);


  // Generate brand name from user's name (first letter of first name + last name initial)
  const getBrandName = (name) => {
    if (!name) return 'PORTFOLIO';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const brandName = portfolioData?.about?.name ? getBrandName(portfolioData.about.name) : 'SS';
  const displayName = portfolioData?.about?.name || 'Portfolio';

  const handleNavigateToProjects = () => {
    setActiveSection('work');
  };

  const sections = [
    { 
      id: 'hero', 
      title: 'INTRODUCTION', 
      subtitle: 'PROFILE', 
      component: <Hero about={portfolioData?.about} projectCount={portfolioData?.projects?.length} experiences={portfolioData?.experiences} onNavigateToProjects={handleNavigateToProjects} />, 
      bg: <HeroBackground /> 
    },
    { 
      id: 'work', 
      title: 'PROJECTS', 
      subtitle: 'PORTFOLIO', 
      component: <Projects projects={portfolioData?.projects} />, 
      bg: <ProjectsBackground />,
      disableParentScroll: true
    },
    { 
      id: 'career', 
      title: 'EXPERIENCE', 
      subtitle: 'CAREER', 
      component: <TechStack experiences={portfolioData?.experiences} opensource={portfolioData?.opensource} />, 
      bg: <TechBackground /> 
    },
    { 
      id: 'about', 
      title: 'CONTACT', 
      subtitle: 'CONNECT', 
      component: <About about={portfolioData?.about} projectCount={portfolioData?.projects?.length} experienceCount={portfolioData?.experiences?.length} />, 
      bg: <AboutBackground /> 
    },
  ];

  // Extract social links for header
  const githubLink = portfolioData?.about?.social_links?.find(l => l.platform === 'Github')?.url || '#';
  const twitterLink = portfolioData?.about?.social_links?.find(l => l.platform === 'Twitter')?.url || '#';
  const linkedinLink = portfolioData?.about?.social_links?.find(l => l.platform === 'LinkedIn')?.url || '#';
  
  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden font-sans text-textMain selection:bg-primary selection:text-white">
      <CustomCursor />
      
      {/* Background Noise Texture */}
      <div className="bg-noise pointer-events-none" />

      {/* Floating Header (Always Visible) - Top Left Brand */}
      <div className="fixed top-6 left-8 z-[100] pointer-events-none mix-blend-difference">
        <div className="flex items-center gap-2.5">
          <img 
            src={logoImage} 
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
            onError={() => {
              // Fallback to brand name if logo fails to load
              const img = document.querySelector('img[src*="logo.png"]');
              if (img) {
                img.style.display = 'none';
                const brandEl = document.createElement('h1');
                brandEl.className = 'text-lg font-bold tracking-tighter whitespace-nowrap';
                brandEl.innerHTML = `${brandName}<span class="text-primary">.</span>DEV`;
                img.parentElement?.appendChild(brandEl);
              }
            }}
          />
        </div>
      </div>

      <div className="fixed top-6 right-8 z-[100] flex gap-4 pointer-events-auto mix-blend-difference">
         <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors"><Github size={20} /></a>
         <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors"><Linkedin size={20} /></a>
         <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors"><Twitter size={20} /></a>
      </div>
      
      {/* Main Flex Container - The "Deck" */}
      <div className="h-full w-full flex flex-col md:flex-row relative z-10 pt-16 md:pt-0">
        {sections.map((section, index) => (
          <Slice
            key={section.id}
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            isActive={activeSection === section.id}
            isHovered={hoveredSection === section.id}
            index={index}
            total={sections.length}
            onActivate={setActiveSection}
            onHover={setHoveredSection}
            bgContent={section.bg}
            disableParentScroll={section.disableParentScroll}
          >
            {section.component}
          </Slice>
        ))}
      </div>
      
      {/* Footer / Copyright - Only visible if hero is active */}
      <div className={`fixed bottom-4 left-8 text-[10px] font-mono text-white/30 transition-opacity duration-500 z-50 pointer-events-none ${activeSection === 'hero' ? 'opacity-100' : 'opacity-0'}`}>
        SYSTEM STATUS: {loading ? 'LOADING...' : 'ONLINE'} <br/>
        © 2025 {portfolioData?.about?.name?.toUpperCase() || 'SAHAJPREET SINGH'}
      </div>
    </div>
  );
}

export default App;
