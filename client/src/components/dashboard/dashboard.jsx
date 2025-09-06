import React from 'react';

const ImpactHubLanding = () => {
  return (
    <div>
      <div className="logo">
        <div className="mainlogo"></div>
        <div className="tagline">
          <h3>impactHub Says ~</h3>
          <p>"When volunteers and NGOs unite, small actions turn into lasting change."</p>
        </div>
      </div>

      <div className="panel">
        <div id="home" className="main">Home</div>
        <div id="about" className="main">About</div>
        <div id="Testimony" className="main">Testimony</div>
        <div id="login" className="main">Login/Sign-Up</div>
      </div>

      <div className="content-wrapper">
        <div className="details">
          <div className="projects">
            <h2>Some of our featured Projects</h2>
            
            <div className="project">
              <h3>Clean Water Initiative, Bihar</h3>
              <div className="images">
                <div className="image1"></div>
                <div className="image2"></div>
                <div className="image3"></div>
                <div className="image4"></div>
              </div>
              <div className="describe">
                <p>This project focuses on providing safe and accessible drinking water to rural communities in Bihar. Volunteers work alongside local NGOs to install water filtration systems and maintain wells. The initiative aims to improve health, hygiene, and overall quality of life for families. By raising awareness about clean water practices, the project empowers communities to sustain these resources for the long term.</p>
              </div>
            </div>

            <div className="project">
              <h3>Education for All, Delhi</h3>
              <div className="images">
                <div className="image5"></div>
                <div className="image6"></div>
                <div className="image7"></div>
                <div className="image8"></div>
              </div>
              <div className="describe">
                <p>This initiative brings quality education to underprivileged children in Delhi. Volunteers mentor students after school, helping them with homework, literacy, and skill development. The project also organizes interactive learning sessions to make education engaging and fun. By empowering children with knowledge and confidence, it aims to open doors to better opportunities and a brighter future.</p>
              </div>
            </div>
          </div>

          <div className="quickstats">
            <h2>See How We are Making an Impact Together</h2>
            <ul>
              <li>1,200+ Verified NGOs on our platform</li>
              <li>15,000+ Volunteers signed up</li>
              <li>250+ Ongoing and completed projects</li>
              <li>75,000+ Hours of volunteering contributed</li>
              <li>10,000+ Lives positively impacted</li>
            </ul>
          </div>

          <div className="joinus">
            <h2>Want To Join Us?</h2>
            <ul>
              <li>Go To <a href="login.html">Login-SignUp</a> Page</li>
              <li>List Yourself as Volunteer or NGO</li>
              <li>If NGO, register and authenticate yourself</li>
              <li>If Volunteer Choose the projects according to your preferred location</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer">
        <div id="contact">Contact Us</div>
        
        <div className="footer1">
          <div id="phn" className="sec">📞 Call us: 962532XXXX</div>
          <div id="email" className="sec">✉️ <a href="mailto:Teentigada@gmail.com">Teentigada@gmail.com</a></div>
        </div>

        <div className="footer2">
          <div id="insta" className="sec2"><a href="https://www.instagram.com/kumar_amit_b/">📷</a></div>
          <div id="linkedin" className="sec2"><a href="https://www.linkedin.com/in/amit-kumar-behera-446bab281/">💼</a></div>
          <div id="twitter" className="sec2"><a href="https://x.com/Shagun14Nagpal">🐦</a></div>
          <div id="Facebook" className="sec2"><a href="https://www.facebook.com/">📘</a></div>
        </div>
      </div>

      <div className="ending">
        <div className="written">
          Made with ♥ by the impactHub Team <br />
          © 2025 impactHub <br />
          <a href="/terms">Terms & Conditions</a> | 
          <a href="/privacy">Privacy Policy</a> | 
          Empowering NGOs & Volunteers to create impact together 
        </div>
      </div>
    </div>
  );
};

export default ImpactHubLanding;