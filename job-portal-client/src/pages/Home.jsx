import React from 'react';
import { Link } from 'react-router-dom';
import '../index_style.css'; 

const Home = () => {
  return (
    <div className="index-homepage">
      {/* HERO SECTION acts as full page background */}
      <div className="hero">
        
        {/* Absolute NAVBAR relative to hero */}
        <div className="navbar">
          <h2>JobConnect</h2>
          <div className="nav-links">
            {/* Wire Find Jobs → login with jobseeker intent */}
            <Link to="/login?intent=jobseeker" className="text-decoration-none" style={{ color: 'inherit' }}>
              Find Jobs
            </Link>
            {/* Wire Hire Employees → login with employer intent */}
            <Link to="/login?intent=employer" className="text-decoration-none" style={{ color: 'inherit' }}>
              Hire Employees
            </Link>


            <Link to="/login" className="login-btn">Get Started</Link>

          </div>
        </div>

        <div className="hero-content">
          <h1>
            Work meets  
            <span>Opportunity</span>  
            Effortlessly
          </h1>

          <p>
            Find workers and job opportunities easily.
            Connect without middlemen and hire faster.
          </p>

          <div className="buttons">
            {/* Hero CTAs → login with intent context */}
            <Link to="/login?intent=jobseeker" className="btn btn-primary text-decoration-none">
              Find a job
            </Link>
            <Link to="/login?intent=employer" className="btn btn-secondary text-decoration-none">
              Hire Employee
            </Link>
          </div>
        </div>
      </div>

      {/* NEW ABOUT SECTION */}

      <div id="about" className="about-section">
        <div className="about-row">
          <div className="about-content">
            <h2>About Us</h2>
            <p>
              At JobConnect, we're redefining how talent meets opportunity. 
              Our platform is crafted to provide a seamless, delightful experience 
              for both job seekers and employers, removing the complexity of modern hiring.
            </p>
          </div>
          <div className="about-image">
            <img src="img1.jpg" alt="Our Team" />
          </div>
        </div>

        <div className="about-row reverse">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              Our mission is to help millions of organizations grow better. 
              We believe growth means aligning the success of your business 
              with the success of your people. When people thrive, businesses grow.
            </p>
          </div>
          <div className="about-image">
            <img src="img2.jpg" alt="Our Mission" />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
