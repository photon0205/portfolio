import React, { useState } from 'react';
import { Mail, Linkedin, Twitter, Github, Instagram, Send } from 'lucide-react';
import emailjs from 'emailjs-com';

const SocialIcon = ({ platform }) => {
  switch (platform.toLowerCase()) {
    case 'linkedin': return <Linkedin size={20} />;
    case 'github': return <Github size={20} />;
    case 'twitter': return <Twitter size={20} />;
    case 'instagram': return <Instagram size={20} />;
    default: return <Mail size={20} />;
  }
};

export const About = ({ about, projectCount = 0, experienceCount = 0 }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSending(true);
    try {
      // EmailJS configuration - you'll need to set these up
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: about?.email,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    setSending(false);
  };

  if (!about) {
    return <AboutSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-w-0">
      {/* Bio */}
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 space-y-6 md:space-y-8">
        <div
            className="prose prose-sm md:prose-base prose-invert text-textMuted leading-relaxed [&>p]:mb-4 [&>p]:text-justify [&>p]:shrink-0 [&>p>span]:text-white/90"
            dangerouslySetInnerHTML={{ __html: about.summary }}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white/5 p-3 md:p-4 rounded border border-white/10 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{projectCount}+</div>
                <div className="text-xs text-textMuted uppercase tracking-widest">Projects Shipped</div>
            </div>
            <div className="bg-white/5 p-3 md:p-4 rounded border border-white/10 text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{experienceCount}</div>
                <div className="text-xs text-textMuted uppercase tracking-widest">Roles Held</div>
            </div>
        </div>
      </div>

      {/* Contact Form & Socials */}
      <div className="w-full lg:w-[360px] lg:min-w-[320px] lg:max-w-[400px] flex flex-col gap-6 shrink-0">
        <div className="bg-surfaceHighlight/20 border border-white/10 p-5 md:p-8 rounded-xl backdrop-blur-md">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-5 md:mb-6">Initialize Connection</h3>

            <form className="space-y-3 md:space-y-4 mb-6 md:mb-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="NAME"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/30 border border-white/10 p-3 text-white text-sm focus:border-primary focus:outline-none transition-colors rounded-sm"
                />
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-black/30 border border-white/10 p-3 text-white text-sm focus:border-primary focus:outline-none transition-colors rounded-sm"
                />
              </div>
              <textarea
                placeholder="MESSAGE PROTOCOL..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-black/30 border border-white/10 p-3 text-white text-sm focus:border-primary focus:outline-none transition-colors rounded-sm"
              />
              <button
                type="submit"
                disabled={sending || sent}
                className={`w-full font-bold py-3 transition-colors rounded-sm uppercase tracking-wider text-sm flex items-center justify-center gap-2 ${
                  sent
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:bg-primary hover:text-white'
                }`}
              >
                {sent ? 'Signal Transmitted!' : sending ? 'Transmitting...' : (
                  <>Transmit Signal <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-3 md:gap-4 border-t border-white/10 pt-5 md:pt-6">
                <div className="text-sm text-textMuted">
                  Direct Link: <a href={`mailto:${about.email}`} className="text-white select-all hover:text-primary transition-colors break-all">{about.email}</a>
                </div>
                <div className="flex gap-3 md:gap-4">
                    {about.social_links?.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-textMuted hover:text-white"
                            title={link.platform}
                        >
                            <SocialIcon platform={link.platform} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const AboutSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full animate-pulse">
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-4 bg-white/10 rounded w-4/6"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-white/5 rounded border border-white/10"></div>
        <div className="h-24 bg-white/5 rounded border border-white/10"></div>
      </div>
    </div>
    <div className="h-96 bg-white/5 rounded-xl border border-white/10"></div>
  </div>
);

export const AboutBackground = () => (
    <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
        <div className="text-9xl font-bold text-white/5 -rotate-90 whitespace-nowrap absolute right-0">
            CONTACT
        </div>
    </div>
);

