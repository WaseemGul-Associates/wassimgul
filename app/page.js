"use client";
import { useState } from 'react';
import ContactForm from '@/app/_components/ContactForm';
import Header from '@/app/_components/Header';

export default function Home() {
  const [openAcc, setOpenAcc] = useState(0);
  const [activeTest, setActiveTest] = useState(1);

  const testimonials = [
    {
      img: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?auto=format&fit=crop&w=300&q=70",
      alt: "Priya Raman",
      quote: "“Exceptional service and deep understanding of corporate law.”",
      detail: "The team provided actionable insights that helped our startup navigate early-stage compliance without a hitch. Their dedication and clear communication were outstanding.",
      name: "Priya Raman",
      role: "Tech Startup Founder",
    },
    {
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=70",
      alt: "Michael Anderson",
      quote: "“Highly professional and reliable. The team handled my case with clarity and delivered exactly what I needed.”",
      detail: "From the initial consultation to the final outcome, the process was smooth and transparent. Their attention to detail, clear communication and strategic approach made a real difference in achieving the result I was looking for.",
      name: "Michael Anderson",
      role: "Real Estate Investor · Dubai, UAE",
    },
    {
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70",
      alt: "Tom Whitaker",
      quote: "“A dedicated team that fought for my rights every step of the way.”",
      detail: "I was facing a difficult family dispute, and the firm provided compassionate yet assertive representation. They truly care about their clients' well-being.",
      name: "Tom Whitaker",
      role: "Private Client",
    }
  ];

  return (
    <main>
      <Header />


      <section className="hero" id="top">
        <div className="wrap">
          <h1>Your legal partner<br />in every situation</h1>
          <p className="hero-sub">From complex disputes to everyday legal matters, we deliver strategic solutions with a client-first approach. We stand by you to protect what matters most.</p>
          <a href="/contact" className="btn btn-solid">Book a Free Consultation</a>

          <div className="hero-stage">
            <div className="hero-word" aria-hidden="true">LAWYER</div>

            <p className="hero-side l">Our legal team brings <b>30+ years</b> of combined expertise, having represented clients in over <b>12,000 criminal</b> matters.</p>

            <div className="hero-frame">
              <img src="assets/lady-justice.webp" alt="Bronze statue of Lady Justice holding scales and a sword" width="600" height="648" />
            </div>

            <div className="hero-side r">
              <div className="seal"><b>★★★★★</b>Top Advocate<br />2021–2024</div>
              <div className="seal"><b>ABA</b>Trusted Lawyer<br />2021–2024</div>
            </div>
          </div>
        </div>
      </section>


      <section className="mission">
        <div className="wrap">
          <p><span className="dim">At WassimGul, we deliver smart legal solutions through expertise, precision, and a client&#8209;focused mindset.</span> Backed by integrity and results, we support you every step of the way.</p>
        </div>
      </section>


      <section className="stats-section">
        <div className="stats">
          <div className="stats-in">

            <div className="stat-group l">
              <div className="stat">
                <b>18+</b>
                <span>Years in Practice</span>
              </div>
              <div className="vr"></div>
              <div className="stat">
                <b>100+</b>
                <span>Legal Matters Resolved</span>
              </div>
            </div>

            <div className="stat-gap"></div>

            <div className="stat-group r">
              <div className="stat">
                <b>95%</b>
                <span>Client Approval</span>
              </div>
              <div className="vr"></div>
              <div className="stat">
                <b>6K+</b>
                <span>Clients Worldwide</span>
              </div>
            </div>

          </div>
        </div>

        <div className="scroller-badge-wrap">
          <div className="scroller" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <defs><path id="ring-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs>
              <text style={{ fontSize: '11px', fill: '#E7D8C5', letterSpacing: '1.3px', fontWeight: 600 }}><textPath href="#ring-path" startOffset="0" textLength="226.19" lengthAdjust="spacingAndGlyphs">SCROLL DOWN • SCROLL DOWN • </textPath></text>
            </svg>
            <div className="scroller-inner">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="#3F2C18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>


      <div className="band">
        <img src="/library-bg.webp"
          alt="Law library shelves lined with legal volumes" loading="lazy" />
      </div>


      <section className="about" id="about">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">About Us</p>
              <h2 className="h-sec">Delivering trusted legal expertise with integrity and precision</h2>
            </div>
            <div className="side">
              <p className="p-sec">Driven by integrity and backed by experience, WassimGul offers personalised legal support designed to guide you through every challenge with confidence.</p>
              <a href="/contact" className="btn btn-solid">Learn More <span className="arw">↗</span></a>
            </div>
          </div>

          <div className="about-body">
            <figure className="about-fig">
              <img src="/about-bg.webp"
                alt="About WassimGul" loading="lazy" />
            </figure>

            <div className="acc" id="acc">
              {[
                { title: "Integrity", text: "We uphold the highest ethical standards in every case we handle. Our commitment to honesty and accountability ensures trust, reliability and strong legal representation." },
                { title: "Transparency", text: "You will always know where your case stands. We explain strategy in plain language, share costs upfront and keep you informed at every stage." },
                { title: "Collaboration", text: "We work alongside you, not around you. Your priorities shape the strategy, and our specialists work as one team to reach the outcome you need." }
              ].map((item, idx) => (
                <div key={idx} className={`acc-item ${openAcc === idx ? 'open' : ''}`}>
                  <button className="acc-btn" aria-expanded={openAcc === idx} onClick={() => setOpenAcc(openAcc === idx ? -1 : idx)}>
                    {item.title} <span className="pm">{openAcc === idx ? '−' : '+'}</span>
                  </button>
                  <div className="acc-panel" style={{ display: openAcc === idx ? 'block' : 'none' }}>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="services" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">What We Offer</p>
              <h2 className="h-sec">Effective legal defense backed by experience and precision</h2>
            </div>
            <div className="side">
              <p className="p-sec">With a commitment to excellence, we deliver defense solutions that are thoughtful, precise and focused on achieving the best possible results for our clients.</p>
              <a href="/contact" className="btn btn-solid">All Services <span className="arw">↗</span></a>
            </div>
          </div>

          <div className="cards">
            <article className="card feature">
              <div className="card-ico">⚖</div>
              <h3>Criminal Defense</h3>
              <p>We're here to guide you through every step of your criminal case, aiming for the best possible result.</p>
              <a href="/contact" className="btn btn-line">Contact Us <span className="arw">↗</span></a>
            </article>
            <article className="card">
              <div className="card-ico">◈</div>
              <h3>Corporate Law</h3>
              <p>Access straightforward, professional support for contracts, compliance and governance.</p>
              <a href="/contact" className="btn btn-line">Contact Us <span className="arw">↗</span></a>
            </article>
            <article className="card">
              <div className="card-ico">◇</div>
              <h3>Family Law</h3>
              <p>Our team works hard to provide expert legal help in sensitive cases and achieve the best results for you.</p>
              <a href="/contact" className="btn btn-line">Contact Us <span className="arw">↗</span></a>
            </article>
            <article className="card">
              <div className="card-ico">✦</div>
              <h3>Legal Consultation</h3>
              <p>Need legal help? Our experts guide you clearly, keeping you confident and informed.</p>
              <a href="/contact" className="btn btn-line">Contact Us <span className="arw">↗</span></a>
            </article>
          </div>
        </div>
      </section>


      <section className="team" id="team">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow on-dark">Our Legal Experts</p>
              <h2 className="h-sec">Meet the professionals delivering trusted legal support</h2>
            </div>
            <div className="side">
              <p className="p-sec">We bring together expertise, clarity and strategic thinking to deliver effective legal solutions. Every step is guided by trust, transparency and a commitment to your success.</p>
              <a href="/contact" className="btn btn-light">View Our Team <span className="arw">↗</span></a>
            </div>
          </div>

          <div className="team-grid">
            <article className="member">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=70"
                alt="Alexander Reed" loading="lazy" width="600" height="800" />
              <h3>Alexander Reed</h3><span>Senior Advocate</span>
            </article>
            <article className="member">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=70"
                alt="Olivia Bennett" loading="lazy" width="600" height="800" />
              <h3>Olivia Bennett</h3><span>Legal Advisor</span>
            </article>
            <article className="member">
              <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=70"
                alt="Daniel Carter" loading="lazy" width="600" height="800" />
              <h3>Daniel Carter</h3><span>Associate Lawyer</span>
            </article>
          </div>
        </div>
      </section>


      <section className="stories" id="stories">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Success Stories</p>
              <h2 className="h-sec">Powerful success stories driven by strategy and experience</h2>
            </div>
            <div className="side">
              <p className="p-sec">We approach every case with strategy and experience, turning complex challenges into successful outcomes through focused and effective legal solutions.</p>
              <a href="/contact" className="btn btn-solid">View Success Stories <span className="arw">↗</span></a>
            </div>
          </div>

          <div className="stories-body">
            <div className="thumbs" id="thumbs" role="tablist" aria-label="Client stories">
              {testimonials.map((test, idx) => (
                <button
                  key={idx}
                  className="thumb"
                  role="tab"
                  aria-selected={activeTest === idx}
                  onClick={() => setActiveTest(idx)}
                >
                  <img src={test.img} alt={test.alt} loading="lazy" />
                </button>
              ))}
            </div>

            <div className="quote" role="tabpanel">
              <blockquote id="q-text">{testimonials[activeTest].quote}</blockquote>
              <p className="detail" id="q-detail">{testimonials[activeTest].detail}</p>
              <div className="byline">
                <div>
                  <b id="q-name">{testimonials[activeTest].name}</b>
                  <span id="q-role">{testimonials[activeTest].role}</span>
                </div>
                <div className="stars" aria-label="5 out of 5">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="contact" id="contact">
        <div className="wrap">
          <div className="contact-body">
            <div>
              <h2 className="h-sec">Schedule a consultation with our legal experts</h2>
              <p className="p-sec" style={{ "marginTop": "16px" }}>Take the first step toward resolving your legal matters with confidence. Our team is ready to provide clear guidance, strategic advice and reliable support tailored to your needs.</p>

              <ContactForm />
            </div>

            <figure className="contact-fig">
              <img src="https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=900&q=70"
                alt="A lawyer reviewing documents with a client" loading="lazy" width="900" height="1200" />
            </figure>
          </div>
        </div>
      </section>


      <footer className="foot">
        <div className="foot-top">
          <div>
            <a href="#top" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px', textDecoration: 'none' }}>
              <img src="/wassim-gul-logo.png" alt="WassimGul Logo" className="brand-img" />
              <span className="brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
            </a>
            <p className="foot-tag">Reliable legal solutions focused on protecting your rights, with clarity, integrity and results.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="X">𝕏</a>
              <a href="#" aria-label="Instagram">ig</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="foot-links">
              <li><a href="#top">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#team">Our Team</a></li>
              <li><a href="#stories">Case Study</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="foot-links">
              <li><a href="#services">Criminal Defense</a></li>
              <li><a href="#services">Civil Litigation</a></li>
              <li><a href="#services">Corporate Law</a></li>
              <li><a href="#services">Family Law</a></li>
              <li><a href="#services">Property Law</a></li>
              <li><a href="#services">Legal Consultation</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact Info</h4>
            <p className="foot-c"><i>☏</i><a href="tel:+919324689553" style={{ "textDecoration": "none" }}>+91-9324689553</a></p>
            <p className="foot-c"><i>☏</i><a href="tel:+917006323003" style={{ "textDecoration": "none" }}>+91-7006323003</a></p>
            <p className="foot-c"><i>✉</i><a href="mailto:Waseemgll@gmail.com" style={{ "textDecoration": "none" }}>Waseemgll@gmail.com</a></p>
            <p className="foot-c"><i>⌖</i><span>J&amp;K and Ladakh High Court, Srinagar</span></p>
          </div>
        </div>

        <div className="foot-mark" aria-hidden="true">WassimGul.</div>

        <div className="foot-bar">
          <div className="foot-bar-in">
            <span>Designed &amp; built by Nexa Solutions</span>
            <span>© 2026 WassimGul Legal. All rights reserved.</span>
          </div>
        </div>
      </footer>



    </main>
  );
}
