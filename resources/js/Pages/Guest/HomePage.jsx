import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import WorkIcon from '@mui/icons-material/Work';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../css/homepage.css';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const slides = [
    {
      title: "Education for All. Anytime. Anywhere.",
      subtitle: "Empowering learners through flexible education opportunities",
      image: "/images/image1.jpg"
    },
    {
      title: "Transform Your Future",
      subtitle: "Join thousands of successful ALS graduates",
      image: "/images/image2.jpg"
    },
    {
      title: "Community-Based Learning",
      subtitle: "Learn in your community, at your own pace",
      image: "/images/image3.jpg"
    }
  ];

  const programs = [
    {
      icon: <BookIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: "Basic Literacy Program",
      description: "For non-literate learners who want to develop fundamental reading, writing, and numeracy skills.",
      color: "#3b82f6"
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      title: "Accreditation & Equivalency (A&E)",
      description: "Complete Elementary and Secondary education at your own pace with flexible learning schedules.",
      color: "#10b981"
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: "Life Skills & Skills Training",
      description: "Vocational and livelihood training programs designed to enhance employability and entrepreneurship.",
      color: "#f59e0b"
    }
  ];

  const benefits = [
    {
      icon: <ScheduleIcon sx={{ fontSize: 30, color: '#3b82f6' }} />,
      title: "Flexible Schedule",
      description: "Learn at your own pace and convenience"
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 30, color: '#10b981' }} />,
      title: "Community-Based Learning",
      description: "Access education right in your community"
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 30, color: '#f59e0b' }} />,
      title: "Pathway to Success",
      description: "Clear route to employment and higher education"
    },
    {
      icon: <WorkIcon sx={{ fontSize: 30, color: '#ef4444' }} />,
      title: "Inclusive & Learner-Centered",
      description: "Education designed around your needs and goals"
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "ALS Graduate",
      quote: "Thanks to ALS, I was able to finish high school and now I'm working toward college!",
      avatar: "MS"
    },
    {
      name: "Juan Dela Cruz",
      role: "Basic Literacy Graduate",
      quote: "ALS gave me the confidence to read and write. Now I can help my children with their homework.",
      avatar: "JD"
    },
    {
      name: "Ana Rodriguez",
      role: "A&E Graduate",
      quote: "The flexible schedule allowed me to work while studying. I'm now pursuing my dream career.",
      avatar: "AR"
    }
  ];

  const announcements = [
    {
      title: "Enrollment Schedule",
      content: "New enrollment period starts January 15, 2024",
      date: "Jan 15, 2024",
      type: "enrollment"
    },
    {
      title: "Online Orientation",
      content: "Virtual orientation for new learners on January 20, 2024",
      date: "Jan 20, 2024",
      type: "orientation"
    },
    {
      title: "Community Event",
      content: "ALS Community Day celebration on February 1, 2024",
      date: "Feb 1, 2024",
      type: "event"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', contactForm);
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="als-homepage">
      {/* Header */}
      <header className="als-header">
        <div className="header-top">
          <div className="header-left">
            <div className="logo-container">
              <img src="/images/als-logo.png" alt="ALS Logo" className="als-logo" />
            </div>
            <h1 className="center-name">ALS Center Opol West</h1>
          </div>
          <div className="header-right">
            <IconButton className="social-icon">
              <a href="https://www.facebook.com/als.centre.opol.west"><FacebookIcon /></a>
              
            </IconButton>
            <IconButton className="social-icon">
              <InstagramIcon />
            </IconButton>
          </div>
        </div>
        <nav className="als-nav">
          <Link href="/" className="nav-link">Home</Link>
          <div className="nav-dropdown">
            <span className="nav-link dropdown-trigger">
              Enrollment <span className="dropdown-arrow">▼</span>
            </span>
            <div className="dropdown-menu">
              <Link href="#" className="dropdown-item">Schedules</Link>
              <Link href="#howtoEnroll" className="dropdown-item">How to Enroll</Link>
            </div>
          </div>
          <Link href="#contact" className="nav-link">Contact</Link>
          <Link href="#about" className="nav-link">About</Link>
          <Link href={route('login')} className="nav-link">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="slide-container">
            {slides.map((slide, index) => (
              <img 
                key={index}
                src={slide.image} 
                alt="ALS Education" 
                className={`slide-image ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
            <div className="slide-content">
              <h2 className="slide-title">{slides[currentSlide].title}</h2>
              <p className="slide-subtitle">{slides[currentSlide].subtitle}</p>
            </div>
            <button className="slide-nav prev" onClick={prevSlide}>
              <ArrowBackIcon />
            </button>
            <button className="slide-nav next" onClick={nextSlide}>
              <ArrowForwardIcon />
            </button>
          </div>
          <div className="slide-pagination">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
        <div className="hero-sidebar">
          <Card className="cta-card">
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                Start Your Journey
              </Typography>
                <div className="schedule-header">
              <Typography variant="h6" component="h4" style={{ color: 'white', margin: 0 }}>
                📅 Enrollment Schedule
              </Typography>
            </div>
            <div className="schedule-content">
              <div className="schedule-item">
                <span className="schedule-label">Start Date:</span>
                <span className="schedule-value">January 15, 2024</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-label">Time:</span>
                <span className="schedule-value">8:00 AM - 5:00 PM</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-label">End Date:</span>
                <span className="schedule-value">March 31, 2024</span>
              </div>
              <div className="schedule-deadline">
                ⏰ Enrollment ends in 45 days
              </div>
            </div>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ready to transform your future? Enroll now and join our community of learners.
              </Typography>
              <Button 
                component={Link}
                href={route('enrollment.page')}
                variant="contained" 
                fullWidth
                className="cta-button"
              >
                Enroll Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Learn More About ALS
          </Typography>
          <div className="video-container">
            <div className="video-placeholder">
              <Typography variant="h6" align="center" color="text.secondary">
                Video here
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Introduction to Alternative Learning System
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* About ALS Section */}
      <section id="about" className="about-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                About ALS
              </Typography>
              <Typography variant="body1" paragraph>
                The Alternative Learning System (ALS) is a parallel learning system in the Philippines that provides a practical option to the existing formal instruction.
              </Typography>
              <Typography variant="body1" paragraph>
                ALS offers both <strong>Accreditation & Equivalency (A&E)</strong> and <strong>Basic Literacy Programs</strong> designed to fit learners' needs, schedules, and learning styles.
              </Typography>
              <Button variant="outlined" className="learn-more-btn">
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <img 
                src="/images/image1.jpg" 
                alt="ALS Students" 
                className="about-image"
              />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Programs Section */}
      <section className="programs-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Programs Offered
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {programs.map((program, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="program-card" elevation={3}>
                  <CardContent className="program-content">
                    <div className="program-icon">
                      {program.icon}
                    </div>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {program.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {program.description}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      className="read-more-btn"
                      style={{ borderColor: program.color, color: program.color }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Why Choose ALS?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="benefit-card" elevation={2}>
                  <CardContent className="benefit-content">
                    <div className="benefit-icon">
                      {benefit.icon}
                    </div>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Success Stories
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="testimonial-card" elevation={3}>
                  <CardContent className="testimonial-content">
                    <div className="testimonial-avatar">
                      {testimonial.avatar}
                    </div>
                    <Typography variant="body1" paragraph className="testimonial-quote">
                      "{testimonial.quote}"
                    </Typography>
                    <Typography variant="subtitle1" component="h4">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Announcements & Events
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {announcements.map((announcement, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="announcement-card" elevation={2}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {announcement.content}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {announcement.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* How to Enroll Section */}
      <section id="howtoEnroll" className="enroll-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            How to Enroll
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6} lg={4}>
              <Card className="step-card" elevation={3}>
                <CardContent className="step-content">
                  <div className="step-number">1</div>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Contact an ALS Teacher
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reach out to a Learning Facilitator in your area to discuss your educational goals.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="step-card" elevation={3}>
                <CardContent className="step-content">
                  <div className="step-number">2</div>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Submit Requirements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete and submit all necessary documents and requirements for enrollment.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="step-card" elevation={3}>
                <CardContent className="step-content">
                  <div className="step-number">3</div>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Start Your ALS Journey
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Begin your learning experience with personalized guidance and support.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Contact & Support
          </Typography>
          <Grid container spacing={4} justifyContent="center">  
            <Grid item xs={12} md={8} lg={6}>
              <Card className="contact-form-card" elevation={3}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Send us a Message
                  </Typography>
                  <form onSubmit={handleContactSubmit} className="contact-form">
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      className="submit-btn"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <footer className="als-footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                ALS Center Opol West
              </Typography>
              <Typography variant="body2" style={{ color: '#e5e7eb' }}>
                Empowering learners through flexible education opportunities.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Link href="/" className="footer-link">Home</Link>
              <Link href="#about" className="footer-link">About</Link>
              <Link href={route('enrollment.page')} className="footer-link">Enroll</Link>
              <Link href="#contact" className="footer-link">Contact</Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact Info
              </Typography>
              <Typography variant="body2" style={{ color: '#e5e7eb' }}>
                Opol, Misamis Oriental, Philippines
              </Typography>
              <Typography variant="body2" style={{ color: '#e5e7eb' }}>
                Phone: +63 912 345 6789
              </Typography>
            </Grid>
          </Grid>
          <Divider style={{ margin: '2rem 0 1rem 0' }} />
          <Typography variant="body2" style={{ color: '#e5e7eb' }} align="center">
            © 2024 ALS Center Opol West. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </div>
  );
}