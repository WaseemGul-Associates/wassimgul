import './about.css';

export const metadata = {
  title: 'About Us | WassimGul — Legal Expertise',
  description: 'Learn about WassimGul’s legacy, our philosophy, and the core values that drive our commitment to delivering strategic, client-focused legal solutions.',
};

export default function About() {
  return (
    <main>
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-in">
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/wassimgul-logo.png" alt="WassimGul Logo" className="brand-img" />
            <span className="brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
          </a>
          <nav>
            <ul className="nav-menu" id="menu">
              <li><a href="/">Home</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#team">Attorneys</a></li>
              <li><a href="/#contact" className="btn btn-solid">Contact Us <span className="arw">↗</span></a></li>
            </ul>
          </nav>
          <button className="burger" aria-label="Menu" aria-expanded="false" id="burger">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="about-hero">
        <img 
          src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80" 
          alt="Elegant law office" 
          className="about-hero-bg" 
        />
        <div className="about-hero-content">
          <h1>Our Legacy</h1>
          <p>Rooted in excellence and driven by an unwavering commitment to our clients, WassimGul stands as a beacon of strategic legal advocacy.</p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="about-philosophy">
        <div className="wrap">
          <p className="eyebrow">Our Philosophy</p>
          <blockquote>
            “We don't just handle cases; we solve problems. Our approach merges rigorous legal strategy with a profound understanding of our clients' unique goals.”
          </blockquote>
          <p className="p-sec" style={{ margin: '0 auto' }}>
            At WassimGul, we believe that exceptional legal representation requires more than just knowing the law. It requires knowing the people behind the cases, understanding the industries they operate in, and anticipating the challenges they face.
          </p>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="about-journey">
        <div className="about-journey-grid">
          <div className="about-journey-content">
            <p className="eyebrow">The Journey</p>
            <h2>Built on a foundation of trust and proven results.</h2>
            <p className="p-sec" style={{ marginBottom: '24px' }}>
              Since our inception, WassimGul has been dedicated to providing high-caliber legal services across corporate, family, and criminal law. We started with a simple vision: to offer legal counsel that is both fiercely protective in the courtroom and thoughtfully strategic at the negotiating table.
            </p>
            <p className="p-sec">
              Over the years, we have successfully navigated complex legal landscapes for individuals and corporations alike, earning a reputation for meticulous preparation and relentless advocacy. Our team of seasoned attorneys brings decades of collective experience, ensuring that every client receives the premium representation they deserve.
            </p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80" 
            alt="Attorneys collaborating" 
            className="about-journey-img" 
          />
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="about-values">
        <p className="eyebrow on-dark">What Drives Us</p>
        <h2>Our Core Values</h2>
        <p>The principles that guide our practice and define our relationships with clients.</p>
        
        <div className="about-values-grid">
          <div className="value-card">
            <div className="value-ico">✧</div>
            <h3>Integrity</h3>
            <p>We hold ourselves to the highest ethical standards, providing honest, transparent advice even when it's difficult to hear. Trust is our most valuable asset.</p>
          </div>
          <div className="value-card">
            <div className="value-ico">◈</div>
            <h3>Precision</h3>
            <p>The law is in the details. We approach every contract, brief, and negotiation with meticulous attention to detail to ensure flawless execution.</p>
          </div>
          <div className="value-card">
            <div className="value-ico">✦</div>
            <h3>Client-Focused</h3>
            <p>Your goals are our goals. We tailor our strategies to meet your specific needs, providing personalized attention and dedicated support.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-top">
          <div>
            <a href="/" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px', textDecoration: 'none' }}>
              <img src="/wassimgul-logo.png" alt="WassimGul Logo" className="brand-img" />
              <span className="brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
            </a>
            <p className="foot-tag">Reliable legal solutions focused on protecting your rights, with clarity, integrity and results.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div>
            <h4>Practice Areas</h4>
            <ul className="foot-links">
              <li><a href="/#services">Corporate Law</a></li>
              <li><a href="/#services">Criminal Defense</a></li>
              <li><a href="/#services">Family Law</a></li>
              <li><a href="/#services">Legal Consultation</a></li>
            </ul>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="foot-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/#team">Our Team</a></li>
              <li><a href="/#about">Careers</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact Info</h4>
            <p className="foot-c"><i>⚲</i>123 Legal Avenue, London, UK</p>
            <p className="foot-c"><i>☏</i>+44 559 821 0518</p>
            <p className="foot-c"><i>✉</i><a href="mailto:info@WassimGul.co.in" style={{textDecoration: 'none'}}>info@WassimGul.co.in</a></p>
          </div>
        </div>
        <div className="foot-mark" aria-hidden="true">WassimGul.</div>
        <div className="foot-bar">
          <div className="foot-bar-in">
            <span>© 2026 WassimGul Legal. All rights reserved.</span>
            <span>Privacy Policy &nbsp;&middot;&nbsp; Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
