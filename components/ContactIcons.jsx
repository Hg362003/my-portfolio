// components/ContactIcons.jsx
'use client';

export default function ContactIcons() {
  const email = 'harshitofficial.362003@gmail.com';
  const githubUrl = 'https://github.com/Hg362003?tab=repositories';
  const linkedinUrl = 'https://www.linkedin.com/in/harshit-gupta-794791223/';

  // Warm glow to match your Saturn particles
  const glowColor = 'rgba(255,214,174,0.95)';
  const iconSize = 40; // smaller, cleaner size

  return (
    <section id="contact" className="px-6 py-20">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-400 mb-8">Connect with me through email and social links.</p>

        <div className="flex justify-center gap-8 items-center">

          {/* GMAIL - uses gmail.png from /public */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent('Portfolio Contact')}`}
            className="icon-link"
            title="Email Me"
            aria-label="Email"
          >
            <img
              src="/gmail.png"
              alt="Email"
              style={{ width: iconSize, height: iconSize, display: 'block', borderRadius: 8 }}
            />
          </a>

          {/* GITHUB */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            title="GitHub"
            aria-label="GitHub"
          >
            <img
              src="/github.png"
              alt="GitHub"
              style={{ width: iconSize, height: iconSize, display: 'block', borderRadius: 8 }}
            />
          </a>

          {/* LINKEDIN */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <img
              src="/linkedin.png"
              alt="LinkedIn"
              style={{ width: iconSize, height: iconSize, display: 'block', borderRadius: 8 }}
            />
          </a>

        </div>
      </div>

      <style jsx>{`
        .icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 10px;
          transition: transform 150ms ease, box-shadow 200ms ease;
          cursor: pointer;
        }

        .icon-link:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 26px -8px ${glowColor}, 0 3px 10px -6px ${glowColor};
        }

        .icon-link img { display: block; }

        @media (max-width: 640px) {
          .icon-link {
            width: 34px;
            height: 34px;
          }

          .icon-link img {
            width: 34px;
            height: 34px;
          }
        }
      `}</style>
    </section>
  );
}