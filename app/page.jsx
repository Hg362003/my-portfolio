'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import projectsData from '@/src/data/projects.json';
import ContactIcons from '../components/ContactIcons';
import Butterfly from './components/Butterfly';
import TalkToProjects from './components/TalkToProjects';

// Keep SaturnCanvas lazy-loaded (client only)
const SaturnCanvas = dynamic(() => import('../components/SaturnCanvas').then(mod => mod.default ?? mod), { ssr: false });

export default function Home() {
  return (
    <>
      {/* --- Canvas background (Saturn) --- */}
      <div className="canvas-wrap pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <SaturnCanvas />
      </div>

      {/* --- Main content above the canvas --- */}
      <div className="app-content" style={{ position: 'relative', zIndex: 10 }}>

        {/* HERO: centered name + single subtitle */}
        <section id="hero" className="hero" aria-label="Hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1100 }}>
            <h1
              id="hero-name"
              style={{
                margin: 0,
                fontWeight: 900,
                color: '#ffffff',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textShadow: '0 10px 40px rgba(0,0,0,0.6)'
              }}
            >
              Harshit Gupta
            </h1>

            <p style={{ marginTop: '14px', color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.45 }}>
              Welcome to my website
            </p>
          </div>
        </section>

        {/* INTRO (keeps Download button here) */}
        <section id="intro" className="intro min-h-screen flex items-center" style={{ background: 'linear-gradient(180deg, rgba(3,3,3,0.85), rgba(12,10,16,0.95))' }}>
          <div className="container mx-auto px-6">
            <div className="bg-white/3 p-8 rounded-xl shadow-lg max-w-6xl grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6">

              <div className="intro-left">
                <h2 className="text-2xl font-semibold">Hi — I'm Harshit Gupta</h2>
                <p className="mt-3 text-gray-100 leading-relaxed">
                  I build full-stack web apps and craft editorial photography. This portfolio blends both sides —
                  interactive projects, magazine spreads, and photo essays.
                </p>

                <div className="mt-6">
                  <a
                    href="/harshit_resume.pdf?v=2"
                    download="harshit_resume.pdf"
                    className="buttonDownload"
                  >
                    Download Resume
                  </a>
                </div>

                <aside className="p-4 rounded-md bg-white/2 mt-6">
                  <div className="text-sm text-gray-300"><strong>Location</strong> — India</div>
                  <div className="text-sm text-gray-300 mt-2"><strong>Tech</strong> — React, Node.js, MongoDB, Three.js</div>
                  <div className="text-sm text-gray-300 mt-2"><strong>Design</strong> — Editorial, Photography, UI/UX</div>
                  <div className="mt-6 text-xs text-gray-400">Scroll up to see the sphere again.</div>
                </aside>
              </div>

              <div className="intro-right">
                <Butterfly />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------- PROJECTS ------------------- */}
        <section id="projects" className="px-6 py-20 bg-gradient-to-b from-[#020204] to-[#06060a]">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p className="text-gray-400 mb-8">A collection of my full-stack, AI-driven, and secure system projects.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.map((p, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-white/5 hover:bg-white/10 transition">
                  <h3 className="text-lg font-semibold">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#ffdcae]">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>

                  <p className="text-gray-300 mt-2 text-sm">{p.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.stack.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESEARCH (Not in nav) */}
        <section id="research" className="px-6 py-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">Research</h2>

            {/* Paper details pulled from your resume. Citation: resume file. */}
            <article className="bg-white/3 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">Unveiling Conscious Computing: Cultivating AI Self-awareness for Human-Like Thought and Sensibility</h3>
              <p className="text-gray-300 mt-2">
                This paper explores conscious computing — the integration of self-awareness and ethical decision-making in AI, analyzing implications, ethical risks,
                and real-world case studies to advocate for responsible development and further research across diverse data.
              </p>
              <div className="mt-4 text-sm">
                <strong>DOI:</strong>{' '}
                <a className="text-[#ffdcae] underline" href="https://link.springer.com/chapter/10.1007/978-981-97-6678-9_15" target="_blank" rel="noopener noreferrer">
                  https://link.springer.com/chapter/10.1007/978-981-97-6678-9_15
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* TALK TO PROJECTS */}
        <TalkToProjects />

        {/* DESIGN section placed just before contact */}
        <section id="design" className="art-section">
          <div className="art-overlay"></div>

          <div className="art-content">
            <h2 className="art-heading">Explore My Art</h2>

            <Link href="/design">
              <div className="art-box">
                Explore My Art
              </div>
            </Link>
          </div>
        </section>

        {/* CONTACT */}
        <ContactIcons />

        {/* ------------------- FOOTER (updated) ------------------- */}
        <footer className="px-6 py-10 text-center text-sm text-gray-500 border-t border-white/5">
          <div className="mb-3">
            <a href="mailto:harshitofficial.362003@gmail.com" className="text-gray-300 hover:text-white underline">
              harshitofficial.362003@gmail.com
            </a>
          </div>
          <div>
            © {new Date().getFullYear()} Harshit Gupta — Built with React, Next.js & Three.js
          </div>
        </footer>

      </div>
    </>
  );
}
