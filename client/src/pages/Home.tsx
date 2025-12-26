import React, { useState, useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import {
  Menu,
  X,
  Download,
  ExternalLink,
  ChevronDown,
  Cpu,
  MapPin,
  Zap,
  Bot,
  Laptop,
  Brain,
  Wrench,
  Target,
  Satellite,
  Mail,
  Linkedin,
  Github,
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'experience', 'skills', 'projects', 'about', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const orderedSectionIds = ['hero', 'experience', 'skills', 'projects', 'about', 'contact'] as const;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const targetTag = target?.tagName?.toLowerCase();
      const isEditable =
        target?.isContentEditable ||
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        targetTag === 'select';

      if (isEditable) return;

      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'] as const;
      if (!keys.includes(e.key as any)) return;

      e.preventDefault();

      const currentIndex = Math.max(0, orderedSectionIds.indexOf(activeSection as any));
      const lastIndex = orderedSectionIds.length - 1;

      if (e.key === 'Home') {
        scrollToSection(orderedSectionIds[0]);
        return;
      }

      if (e.key === 'End') {
        scrollToSection(orderedSectionIds[lastIndex]);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const next = Math.min(currentIndex + 1, lastIndex);
        scrollToSection(orderedSectionIds[next]);
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const prev = Math.max(currentIndex - 1, 0);
        scrollToSection(orderedSectionIds[prev]);
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown as any);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const downloadCV = () => {
    // Try to download a local PDF first; fall back to a remote link (e.g. Google Docs)
    const publicPdf = '/CV-Armin-Mehrvar.pdf';
    const cvLink = import.meta.env.VITE_CV_LINK || 'https://docs.google.com/document/d/1w_dummy_link_for_placeholder/view';

    (async () => {
      try {
        // Use HEAD to check if the public PDF exists
        const res = await fetch(publicPdf, { method: 'HEAD' });
        if (res.ok) {
          const a = document.createElement('a');
          a.href = publicPdf;
          a.download = 'Armin-Mehrvar-CV.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
      } catch (e) {
        // ignore and fallback
      }

      // Fallback: open provided CV link (set VITE_CV_LINK) or a Google Docs URL
      window.open(cvLink, '_blank', 'noopener');
    })();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-semibold leading-none flex items-center gap-2">
            <span className="text-white">Armin Mehrvar</span>
            <span className="text-gray-400">|</span>
            <span className="text-cyan-400 font-mono font-bold">&lt;Robotics.dev&gt;</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Experience', 'Skills', 'Projects', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`inline-flex items-center h-10 text-base md:text-lg font-semibold leading-none transition-colors ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={downloadCV}
              className="inline-flex items-center h-10 px-4 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-base md:text-lg font-semibold leading-none transition"
            >
              CV
            </button>
          </div>
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {['Experience', 'Skills', 'Projects', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-left text-lg font-semibold leading-none text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={downloadCV}
                className="inline-flex items-center justify-center h-11 px-4 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-semibold leading-none transition w-full"
              >
                Download CV
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Centered */}
      <AnimatedSection id="hero" animate className="relative flex items-center justify-center pt-20">
        <div className="px-4 text-center z-10">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text text-center mb-4 animate-fade-in-scale">
            Robotics Software Engineer
          </h1>
          <p className="text-cyan-400 font-semibold text-3xl md:text-4xl text-center mt-4 neon-text animate-slide-in-up stagger-1">
            ROS 2 autonomy. Navigation. Deployment support.
          </p>

          <div className="mt-8 max-w-3xl mx-auto text-left md:text-center">
            <ul className="space-y-3">
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">ROS 2 integration. Field debugging. Fleet issue triage.</li>
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">Navigation tuning. SLAM. Localization. Planning.</li>
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">C++ and Python. Linux. Docker. Simulation.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4 mt-8 animate-slide-in-up stagger-3">
            <button onClick={() => scrollToSection('projects')} className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-lg md:text-xl font-semibold transition-all duration-300 hover-lift neon-glow">
              View Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="px-8 py-3 rounded-full border-2 border-cyan-400 text-cyan-400 text-lg md:text-xl hover:text-white hover:bg-cyan-400 transition-all duration-300 hover-lift glass">
              Get in Touch
            </button>
          </div>

          <div className="mt-12 w-full flex flex-col items-center animate-slide-in-up stagger-4">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6 rounded-full" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <ChevronDown size={24} className="text-accent" />
        </div>
      </AnimatedSection>

      

      {/* Experience Section */}
      <AnimatedSection id="experience" animate className="border-t border-border/30 flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex flex-col items-center w-fit max-w-full mb-16">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight mb-3">Experience</h2>
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full animate-shimmer" />
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {[
              {
                role: 'Robotics Consultant',
                company: 'Ottonomy Inc.',
                location: 'Milton Keynes, UK',
                achievements: [
                  'Owned ROS 2 Nav stack tuning. SLAM +15% (internal metric).',
                  'Debugged autonomy and connectivity issues on deployed robots. Fleet uptime 95%.',
                  'Built SQL diagnostics for fleet logs. Triage time -20%.',
                  'Validated behaviour changes in C++ and Python. Reduced regressions.'
                ]
              },
              {
                role: 'Robotics Consultant',
                company: 'Embodied AI Ltd',
                location: 'London, UK',
                achievements: [
                  'Set up WX250 arms and RealSense rigs. Data capture +20%.',
                  'Wrote Linux teleop and capture tools in C++ and Python.',
                  'Ran dataset checks for ACT/Pi0 experiments. Evaluation errors -20%.',
                  'Calibrated sensors and fixed lab rigs. Uptime 95%.'
                ]
              },
              {
                role: 'R&D Engineer (Medical Devices)',
                company: 'ANIC Medical Instrument Co.',
                location: 'Iran',
                achievements: [
                  'Configured SCADA/MES for ISO 13485. Improved traceability.',
                  'Optimised CNC setups and GD&T. Machining errors -20%.',
                  'Delivered production setup. Throughput +15%. Waste -26%.',
                  'Supported embedded tests for sensors and actuators.'
                ]
              }
            ].map((job, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 text-left hover-lift">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-cyan-400 mb-2">{job.role}</h3>
                  <p className="text-xl md:text-2xl font-semibold text-white">{job.company}</p>
                  <p className="text-base md:text-lg text-gray-400">{job.location}</p>
                </div>
                <ul className="space-y-3">
                  {job.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-300">
                      <span className="text-cyan-400 font-bold mt-1">→</span>
                      <span className="text-lg md:text-xl">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection id="skills" animate={false} className="border-t border-border/30 flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex flex-col items-center w-fit max-w-full mb-16">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight mb-3">Skills</h2>
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full animate-shimmer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Bot size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">ROS 2</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['ROS 2', 'rclcpp', 'Nav2', 'MoveIt 2', 'TF2', 'Lifecycle'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-cyan-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target size={28} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Autonomy</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['SLAM', 'Localization', 'Planning', 'Control', 'State Machines', 'Tuning'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-blue-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Brain size={28} className="text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Perception</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['OpenCV', 'Point Clouds', 'Sensor Fusion', 'Calibration', 'Logging', 'Evaluation'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-teal-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Laptop size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['C++', 'Python', 'Bash', 'CMake', 'SQL', 'MATLAB'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-cyan-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Satellite size={28} className="text-sky-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Hardware</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['LiDAR', 'RGB-D', 'IMU', 'Encoders', 'GNSS', 'Arms/AGVs'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-sky-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Wrench size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Tooling</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Linux', 'Docker', 'Git', 'CI/CD', 'Gazebo', 'Isaac Sim'].map((s) => (
                  <span key={s} className="px-4 py-2 rounded-lg bg-gray-800/80 text-white text-lg md:text-xl font-bold hover:bg-cyan-600 transition-colors">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection id="projects" animate className="border-t border-border/30 flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex flex-col items-center w-fit max-w-full mb-16">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight mb-3">Featured Projects</h2>
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full animate-shimmer" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Integrated Data Collection & Monitoring System',
                subtitle: 'MSc Thesis',
                description: 'Problem, approach, and results.',
                highlights: [
                  'Problem: production monitoring with weak data integrity.',
                  'Approach: Node-RED + SQL pipeline. Dashboards. Alarms.',
                  'Result: 99.9% uptime. Latency -30%.',
                  'Constraints: IEC compliance. Limited hardware access.'
                ]
              },
              {
                title: 'Enhanced Integration for Modular Production Systems',
                subtitle: 'Unified Festo MPS with Siemens PLCs',
                description: 'Problem, approach, and results.',
                highlights: [
                  'Problem: mixed controllers and brittle station integration.',
                  'Approach: PLC standardisation. SQL dashboards. SOPs.',
                  'Result: hardware cost -86%. Uptime improved.',
                  'Constraints: legacy Siemens PLCs. IEC 61131-3.'
                ]
              },
              {
                title: 'Robot Placement & Kinematic Optimisation',
                subtitle: 'Inverse Kinematics Engineering',
                description: 'Problem, approach, and results.',
                highlights: [
                  'Problem: reach limits and cycle-time constraints in a cell layout.',
                  'Approach: IK analysis. Trajectory optimisation in ABB RobotStudio.',
                  'Result: workspace +40%. Power -25%. Setup time -35%.',
                  'Constraints: joint limits. Collision constraints.'
                ]
              },
              {
                title: 'Digital Product Modelling and Sorting System',
                subtitle: 'PLC/HMI Programming',
                description: 'Problem, approach, and results.',
                highlights: [
                  'Problem: sorting line needed scalable PLC and HMI behaviour.',
                  'Approach: TIA Portal. SCL logic. Alarms.',
                  'Result: throughput +30%. Process efficiency +15%.',
                  'Constraints: operator UX. Real-time scan timing.'
                ]
              }
            ].map((project, index) => (
              <div key={index} className="border border-border/50 rounded-lg p-8 bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-colors group">
                <h3 className="text-3xl font-bold text-accent mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                <p className="text-base md:text-lg font-mono text-secondary mb-4">{project.subtitle}</p>
                <p className="text-lg md:text-xl text-foreground mb-6 font-semibold">{project.description}</p>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 text-base md:text-lg text-foreground font-semibold">
                      <span className="text-accent">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection id="about" animate={false} className="border-t border-border/30 flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex flex-col items-center w-fit max-w-full mb-12">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight mb-3 animate-slide-in-up">About</h2>
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full animate-shimmer" />
          </div>

          <div className="max-w-4xl mx-auto text-left md:text-center">
            <ul className="space-y-3">
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">ROS 2 nodes. Launch. TF. Diagnostics.</li>
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">Navigation stack tuning. Field issue triage.</li>
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">Sensors: LiDAR, IMU, RGB-D. Calibration and logging.</li>
              <li className="text-xl md:text-2xl text-gray-300 font-semibold">C++17 and Python. Linux tooling. Reproducible builds.</li>
            </ul>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
{/* Contact Section */}
<AnimatedSection id="contact" animate={false} className="border-t border-border/30 flex items-center">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <div className="inline-flex flex-col items-center w-fit max-w-full mb-12">
      <h2 className="text-6xl md:text-6xl font-bold gradient-text tracking-tight mb-3">Let's Connect</h2>
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 rounded-full animate-shimmer" />
    </div>

    <p className="text-xl md:text-3xl text-white font-semibold leading-relaxed mb-6 max-w-6xl mx-auto">
      Interested in collaborating on robotics projects or discussing opportunities?
    </p>

    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-12 md:p-24 border-2 border-cyan-500/30">
        <p className="text-2xl md:text-3xl text-white font-semibold leading-snug tracking-tight mb-16 text-center">
          Contact for ROS 2 autonomy work, deployment support, or technical reviews.
        </p>

        <div className="space-y-6">
          <div className="pt-6 border-t border-gray-700">
            <p className="text-lg md:text-2xl font-bold text-cyan-400 uppercase tracking-wider mb-4">CONNECT</p>
            <div className="flex items-center justify-center gap-6">
                    <a href="mailto:armin.mehrvar@gmail.com" aria-label="Email Armin Mehrvar" className="group">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all group-hover:scale-110">
                        <Mail size={36} className="text-cyan-400" />
                      </div>
                    </a>

                    <a href="https://www.linkedin.com/in/armin-mehrvar" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all group-hover:scale-110">
                        <Linkedin size={36} className="text-cyan-400" />
                      </div>
                    </a>

                    <a href="https://github.com/ArminEng24/" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all group-hover:scale-110">
                        <Github size={36} className="text-cyan-400" />
                      </div>
                    </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </AnimatedSection>

    </div>
  );
}
