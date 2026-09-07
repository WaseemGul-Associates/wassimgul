import './contact.css';
import ContactForm from '@/app/_components/ContactForm';
import Header from '@/app/_components/Header';

export const metadata = {
  title: 'Contact Us | WassimGul — Legal Expertise',
  description: 'Schedule a consultation with our legal experts today. Our team is ready to provide clear guidance and strategic advice tailored to your needs.',
};

export default function Contact() {
  return (
    <main>
      <Header />

      {/* HERO SECTION */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We are here to provide the legal support you need. Contact us to schedule a consultation.</p>
        </div>
      </section>

      {/* CONTACT FORM & MAP */}
      <section className="contact contact-page-sec">
        <div className="wrap">
          <div className="contact-body">
            <div>
              <h2 className="h-sec">Schedule a consultation</h2>
              <p className="p-sec" style={{marginTop:"16px", marginBottom:"32px"}}>Take the first step toward resolving your legal matters with confidence. Our team is ready to provide clear guidance, strategic advice and reliable support tailored to your needs.</p>

              <ContactForm />
            </div>

            <div className="contact-map-wrap">
              <iframe
                src="https://www.google.com/maps?q=J%26K%20and%20Ladakh%20High%20Court%2C%20Srinagar&output=embed"
                width="100%"
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="contact-map-iframe"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#team">Our Team</a></li>
              <li><a href="/#stories">Case Study</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="foot-links">
              <li><a href="/#services">Criminal Defense</a></li>
              <li><a href="/#services">Civil Litigation</a></li>
              <li><a href="/#services">Corporate Law</a></li>
              <li><a href="/#services">Family Law</a></li>
              <li><a href="/#services">Property Law</a></li>
              <li><a href="/#services">Legal Consultation</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact Info</h4>
            <p className="foot-c"><i>☏</i><a href="tel:+919324689553" style={{"textDecoration":"none"}}>+91-9324689553</a></p>
            <p className="foot-c"><i>☏</i><a href="tel:+917006323003" style={{"textDecoration":"none"}}>+91-7006323003</a></p>
            <p className="foot-c"><i>✉</i><a href="mailto:Waseemgll@gmail.com" style={{"textDecoration":"none"}}>Waseemgll@gmail.com</a></p>
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
