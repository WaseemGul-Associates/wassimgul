export default function Home() {
  return (
    <main>
      


<header className="nav">
  <div className="nav-in">
    <a href="#top" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
      <img src="/wassimgul-logo.png" alt="WassimGul Logo" className="brand-img" />
      <span className="brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
    </a>
    <nav>
      <ul className="nav-menu" id="menu">
        <li><a href="#top" className="here">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="#stories">Case Study</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact" className="btn btn-solid">Contact Us</a></li>
      </ul>
    </nav>
    <button className="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>


<section className="hero" id="top">
  <div className="wrap">
    <h1>Your legal partner<br/>in every situation</h1>
    <p className="hero-sub">From complex disputes to everyday legal matters, we deliver strategic solutions with a client-first approach. We stand by you to protect what matters most.</p>
    <a href="#contact" className="btn btn-solid">Book a Free Consultation</a>

    <div className="hero-stage">
      <div className="hero-word" aria-hidden="true">LAWYER</div>

      <p className="hero-side l">Our legal team brings <b>30+ years</b> of combined expertise, having represented clients in over <b>12,000 criminal</b> matters.</p>

      <div className="hero-frame">
        <img src="assets/lady-justice.webp" alt="Bronze statue of Lady Justice holding scales and a sword" width="600" height="648" />
      </div>

      <div className="hero-side r">
        <div className="seal"><b>★★★★★</b>Top Advocate<br/>2021–2024</div>
        <div className="seal"><b>ABA</b>Trusted Lawyer<br/>2021–2024</div>
      </div>
    </div>
  </div>
</section>


<section className="mission" style={{ position: 'relative', overflow: 'hidden' }}>
  <img src="/expertise-bg.webp" alt="Legal expertise background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.12, mixBlendMode: 'luminosity' }} />
  <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
    <p><span className="dim">At WassimGul, we deliver smart legal solutions through expertise, precision, and a client&#8209;focused mindset.</span> Backed by integrity and results, we support you every step of the way.</p>
  </div>
</section>


<section className="stats-section" style={{ position: 'relative', zIndex: 10, background: 'var(--cream)', borderTop: '1px solid var(--line-light)' }}>
  <div className="stats" style={{ background: 'var(--cream)', border: 'none', position: 'relative', zIndex: 10 }}>
    <div className="stats-in" style={{ padding: '60px var(--pad) 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
      
      <div className="stat-group" style={{ display: 'flex', gap: '40px', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        <div className="stat" style={{ textAlign: 'left' }}>
          <b style={{ color: 'var(--brown-deep)', fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1 }}>18+</b>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginTop: '6px' }}>Years in Practice</span>
        </div>
        <div className="vr" style={{ background: 'var(--line)', width: '1px', height: '60px' }}></div>
        <div className="stat" style={{ textAlign: 'left', marginRight: '40px' }}>
          <b style={{ color: 'var(--brown-deep)', fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1 }}>100+</b>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginTop: '6px' }}>Legal Matters Resolved</span>
        </div>
      </div>

      <div className="stat-gap" style={{ width: '160px', flexShrink: 0 }}></div>

      <div className="stat-group" style={{ display: 'flex', gap: '40px', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <div className="stat" style={{ textAlign: 'left', marginLeft: '40px' }}>
          <b style={{ color: 'var(--brown-deep)', fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1 }}>95%</b>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginTop: '6px' }}>Client Approval</span>
        </div>
        <div className="vr" style={{ background: 'var(--line)', width: '1px', height: '60px' }}></div>
        <div className="stat" style={{ textAlign: 'left' }}>
          <b style={{ color: 'var(--brown-deep)', fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1 }}>6K+</b>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginTop: '6px' }}>Clients Worldwide</span>
        </div>
      </div>

    </div>
  </div>

  <div style={{ position: 'absolute', bottom: '-75px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
    <div className="scroller" aria-hidden="true" style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#3F2C18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '6px solid var(--cream)' }}>
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'spin 18s linear infinite', fill: 'transparent' }}>
        <defs><path id="ring-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/></defs>
        <text style={{ fontSize: '11px', fill: '#E7D8C5', letterSpacing: '2px', fontWeight: 600 }}><textPath href="#ring-path" startOffset="0">SCROLL DOWN • SCROLL DOWN • </textPath></text>
      </svg>
      <div style={{ width: '74px', height: '74px', borderRadius: '50%', background: '#F5EEE0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="#3F2C18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <a href="#contact" className="btn btn-solid">Learn More <span className="arw">↗</span></a>
      </div>
    </div>

    <div className="about-body">
      <figure className="about-fig">
        <img src="https://images.unsplash.com/photo-1505547828843-176834e42154?auto=format&fit=crop&w=900&q=70"
             alt="Stone columns of a courthouse portico" loading="lazy" width="900" height="1200" />
      </figure>

      <div className="acc" id="acc">
        <div className="acc-item open">
          <button className="acc-btn" aria-expanded="true">Integrity <span className="pm">+</span></button>
          <div className="acc-panel">
            <p>We uphold the highest ethical standards in every case we handle. Our commitment to honesty and accountability ensures trust, reliability and strong legal representation.</p>
          </div>
        </div>
        <div className="acc-item">
          <button className="acc-btn" aria-expanded="false">Transparency <span className="pm">+</span></button>
          <div className="acc-panel">
            <p>You will always know where your case stands. We explain strategy in plain language, share costs upfront and keep you informed at every stage.</p>
          </div>
        </div>
        <div className="acc-item">
          <button className="acc-btn" aria-expanded="false">Collaboration <span className="pm">+</span></button>
          <div className="acc-panel">
            <p>We work alongside you, not around you. Your priorities shape the strategy, and our specialists work as one team to reach the outcome you need.</p>
          </div>
        </div>
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
        <a href="#contact" className="btn btn-solid">All Services <span className="arw">↗</span></a>
      </div>
    </div>

    <div className="cards">
      <article className="card feature">
        <div className="card-ico">⚖</div>
        <h3>Criminal Defense</h3>
        <p>We're here to guide you through every step of your criminal case, aiming for the best possible result.</p>
        <a href="#contact" className="btn btn-line">Read More <span className="arw">↗</span></a>
      </article>
      <article className="card">
        <div className="card-ico">◈</div>
        <h3>Corporate Law</h3>
        <p>Access straightforward, professional support for contracts, compliance and governance.</p>
        <a href="#contact" className="btn btn-line">Read More <span className="arw">↗</span></a>
      </article>
      <article className="card">
        <div className="card-ico">◇</div>
        <h3>Family Law</h3>
        <p>Our team works hard to provide expert legal help in sensitive cases and achieve the best results for you.</p>
        <a href="#contact" className="btn btn-line">Read More <span className="arw">↗</span></a>
      </article>
      <article className="card">
        <div className="card-ico">✦</div>
        <h3>Legal Consultation</h3>
        <p>Need legal help? Our experts guide you clearly, keeping you confident and informed.</p>
        <a href="#contact" className="btn btn-line">Read More <span className="arw">↗</span></a>
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
        <a href="#contact" className="btn btn-light">View Our Team <span className="arw">↗</span></a>
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
        <a href="#contact" className="btn btn-solid">View Success Stories <span className="arw">↗</span></a>
      </div>
    </div>

    <div className="stories-body">
      <div className="thumbs" id="thumbs" role="tablist" aria-label="Client stories">
        <button className="thumb" role="tab" aria-selected="false" data-i="0">
          <img src="https://images.unsplash.com/photo-1581065178047-8ee15951ede6?auto=format&fit=crop&w=300&q=70" alt="Priya Raman" loading="lazy" />
        </button>
        <button className="thumb" role="tab" aria-selected="true" data-i="1">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=70" alt="Michael Anderson" loading="lazy" />
        </button>
        <button className="thumb" role="tab" aria-selected="false" data-i="2">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70" alt="Tom Whitaker" loading="lazy" />
        </button>
      </div>

      <div className="quote" role="tabpanel">
        <blockquote id="q-text">“Highly professional and reliable. The team handled my case with clarity and delivered exactly what I needed.”</blockquote>
        <p className="detail" id="q-detail">From the initial consultation to the final outcome, the process was smooth and transparent. Their attention to detail, clear communication and strategic approach made a real difference in achieving the result I was looking for.</p>
        <div className="byline">
          <div>
            <b id="q-name">Michael Anderson</b>
            <span id="q-role">Real Estate Investor · Dubai, UAE</span>
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
        <p className="p-sec" style={{"marginTop":"16px"}}>Take the first step toward resolving your legal matters with confidence. Our team is ready to provide clear guidance, strategic advice and reliable support tailored to your needs.</p>

        <form className="form" id="form" noValidate>
          <div className="f-row">
            <div className="f"><label htmlFor="fn">First Name</label><input id="fn" name="firstName" type="text" placeholder="John" required /></div>
            <div className="f"><label htmlFor="ln">Last Name</label><input id="ln" name="lastName" type="text" placeholder="Doe" required /></div>
          </div>
          <div className="f-row">
            <div className="f"><label htmlFor="em">Email Address</label><input id="em" name="email" type="email" placeholder="john@example.com" required /></div>
            <div className="f"><label htmlFor="ph">Phone Number</label><input id="ph" name="phone" type="tel" placeholder="+44 000 000 0000" /></div>
          </div>
          <div className="f-row">
            <div className="f">
              <label htmlFor="sv">Select Service</label>
              <select id="sv" name="service" required>
                <option value="">Choose a service</option>
                <option>Criminal Defense</option>
                <option>Corporate Law</option>
                <option>Family Law</option>
                <option>Legal Consultation</option>
              </select>
            </div>
            <div className="f"><label htmlFor="dt">Preferred Date</label><input id="dt" name="date" type="date" /></div>
          </div>
          <div className="f" style={{"marginBottom":"22px"}}>
            <label htmlFor="ms">Message</label>
            <textarea id="ms" name="message" rows="3" placeholder="Briefly describe your legal matter"></textarea>
          </div>
          <button type="submit" className="btn btn-solid">Confirm your appointment</button>
          <p className="form-note" id="note" role="status"></p>
        </form>
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
        <img src="/wassimgul-logo.png" alt="WassimGul Logo" className="brand-img" />
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
        <li><a href="#contact">Contact</a></li>
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
      <p className="foot-c"><i>☏</i><a href="tel:+445598210518" style={{"textDecoration":"none"}}>+44 559 821 0518</a></p>
      <p className="foot-c"><i>✉</i><a href="mailto:info@WassimGul.co.in" style={{"textDecoration":"none"}}>info@WassimGul.co.in</a></p>
      <p className="foot-c"><i>⌖</i><span>London, United Kingdom</span></p>
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