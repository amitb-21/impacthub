import React from 'react';

const Footer = () => {
  return (
    <>
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #25274D 0%, #464866 50%, #29648A 100%);
          color: #AAABB8;
          font-family: 'Arial', sans-serif;
          padding: 3rem 0 1rem 0;
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2E9CCA, transparent);
          opacity: 0.6;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          font-size: 2rem;
          font-weight: bold;
          color: #2E9CCA;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .footer-tagline {
          color: #AAABB8;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .footer-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: #2E9CCA;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-link {
          color: #AAABB8;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          padding: 0.3rem 0;
          position: relative;
        }

        .footer-link:hover {
          color: #2E9CCA;
          transform: translateX(5px);
        }

        .footer-link::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2E9CCA, #29648A);
          transition: width 0.3s ease;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #2E9CCA, #29648A);
          border-radius: 50%;
          color: white;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(46, 156, 202, 0.4);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #AAABB8;
          font-size: 0.95rem;
        }

        .contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #464866, #25274D);
          border-radius: 8px;
          color: #2E9CCA;
          flex-shrink: 0;
        }

        .newsletter {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .newsletter-input {
          padding: 0.8rem 1rem;
          border: 2px solid rgba(170, 171, 184, 0.3);
          border-radius: 8px;
          background: rgba(37, 39, 77, 0.3);
          color: #AAABB8;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #2E9CCA;
          box-shadow: 0 0 15px rgba(46, 156, 202, 0.2);
        }

        .newsletter-input::placeholder {
          color: rgba(170, 171, 184, 0.6);
        }

        .newsletter-btn {
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #2E9CCA, #29648A);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(46, 156, 202, 0.3);
        }

        .footer-bottom {
          border-top: 1px solid rgba(170, 171, 184, 0.2);
          margin-top: 2rem;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          color: rgba(170, 171, 184, 0.7);
          font-size: 0.9rem;
        }

        .footer-legal {
          display: flex;
          gap: 2rem;
        }

        .footer-legal a {
          color: rgba(170, 171, 184, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: #2E9CCA;
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-legal {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .contact-item {
            justify-content: center;
          }
        }

        .fade-in {
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        .fade-in:nth-child(1) { animation-delay: 0.1s; }
        .fade-in:nth-child(2) { animation-delay: 0.2s; }
        .fade-in:nth-child(3) { animation-delay: 0.3s; }
        .fade-in:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section fade-in">
            <div className="footer-logo">ImpactHub</div>
            <p className="footer-tagline">
              Connecting passionate volunteers with meaningful causes. Together, we create lasting change in communities around the world.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">f</a>
              <a href="#" className="social-link" aria-label="Twitter">t</a>
              <a href="#" className="social-link" aria-label="Instagram">i</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-section fade-in">
            <h3 className="footer-title">Get In Touch</h3>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <span>hello@impacthub.org</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <span>Bhubaneswar, Odisha, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 ImpactHub. All rights reserved.
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;