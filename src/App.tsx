import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowUpRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe, 
  Users, 
  FileText,
  Star,
  Quote,
  Loader2,
  AlertCircle,
  Download,
  Sun,
  Moon
} from 'lucide-react';

// Firebase Imports
import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';

// --- Types & Constants ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const ADMIN_EMAIL = "Martiligando@gmail.com";

// --- Helper Functions ---

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

const Navbar = ({ logoUrl, theme, toggleTheme }: { logoUrl: string | null, theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const darkLogo = "https://i.ibb.co/LB64mNt/White.png";
  const lightLogo = "https://i.ibb.co/7tPKwq62/Colored.png";
  
  const currentLogo = logoUrl || (theme === 'dark' ? darkLogo : lightLogo);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <img src={currentLogo} alt="Expath PH Logo" className="h-8 md:h-10 object-contain" referrerPolicy="no-referrer" />
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-surface border border-border-dim rounded-full hover:bg-accent/10 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,123,255,0.3)]"
          >
            Consult Now
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 bg-surface border border-border-dim rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="text-text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border-dim overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium py-2 text-text-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="w-full py-4 bg-accent text-center text-white font-bold rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Consult Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ backgroundUrl }: { backgroundUrl: string | null }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0 opacity-70"
      >
        <img 
          src={backgroundUrl || "https://www.expathph.com/web/image/1400-48653e6f/Background.webp?auto=format&fit=crop&q=80&w=1920"} 
          alt="Cebu City Skyline" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6">
              ACCREDITED MARKETER OF PRA | ACCREDITED AGENCY OF BUREAU OF IMMIGRATION
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-gradient">
              YOUR GUIDE TO THE RIGHT VISA IN THE PHILIPPINES
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-medium max-w-2xl mb-10 leading-relaxed">
              Helping you secure the right Philippine visa with expert guidance, full legal compliance, and a smooth, worry-free process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://calendly.com/expathph"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-accent text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,123,255,0.4)]"
              >
                Free Consultation <ChevronRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Offer Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 inline-flex items-center gap-4 p-4 bg-surface border border-border-dim rounded-2xl animate-float"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Limited Offer</p>
              <p className="text-lg font-bold text-text-primary">0 Agency Fees for SRRV Applications</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ... Services, Testimonials components remain same ...

const Offer = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            As an accredited marketer of the <span className="text-text-primary font-bold">Philippine Retirement Authority (PRA)</span>, 
            we take care of your entire <span className="text-text-primary font-bold">SRRV visa</span> process <span className="text-accent font-bold italic">without charging any agency fees.</span>
          </p>
        </div>

        {/* Signature Offer Card */}
        <div className="relative mb-24">
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full transform -translate-y-1/2"></div>
          <div className="relative glass rounded-[3rem] border border-accent/30 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
              Our Signature Offer:
            </div>
            <div className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent text-5xl md:text-7xl font-black tracking-tighter py-2 border-b-4 border-[#FDB931]/30">
              $0 Agency Fees
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-24 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-dim hidden md:block"></div>
          
          <div className="space-y-6">
            <h4 className="text-3xl font-bold tracking-tight text-text-primary">SRRV Services</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#FDB931] w-6 h-6 mt-1 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-text-primary">Save Big: Zero Agency Fees</p>
                  <p className="text-text-secondary">Accredited by the Philippine Retirement Authority</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-3xl font-bold tracking-tight text-text-primary">BI Services</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#FDB931] w-6 h-6 mt-1 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-text-primary">Expert Immigration Assistance</p>
                  <p className="text-text-secondary">Reliable support for all your documentation needs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <p className="text-xl font-bold text-text-primary mb-6">
            Need a tourist visa extension, work visa, spousal visa, or permanent residency?
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            We specialize in Philippine visas and immigration, making the process easy, fast, and stress-free for expats. 
            Let our experts handle everything—so you can focus on enjoying life in the Philippines!
          </p>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "SRRV Applications",
      desc: "New, Renewal, and Cancellation. We are official PRA Accredited Marketers specializing in retirement visas.",
      icon: <ShieldCheck className="w-8 h-8" />,
      tag: "Most Popular"
    },
    {
      title: "Tourist & Spousal Visas",
      desc: "Hassle-free extensions and spousal visa processing to keep you legally compliant while in the Philippines.",
      icon: <Globe className="w-8 h-8" />,
    },
    {
      title: "ECC & Annual Reports",
      desc: "Exit Clearance (ECC) and Annual Report filing. We ensure all your mandatory reporting is handled on time.",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      title: "Dual Citizenship",
      desc: "Expert assistance for Dual Citizenship and Working Visa applications for professionals and families.",
      icon: <Users className="w-8 h-8" />,
    }
  ];

  return (
    <section id="services" className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col justify-between mb-20">
          <div className="max-w-6xl">
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
              COMPREHENSIVE VISA SOLUTIONS.
            </h3>
          </div>
          <p className="text-text-secondary max-w-6xl text-lg pt-5">
            From retirement to business, we provide end-to-end support for all your immigration needs in the Philippines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group p-10 bg-surface border border-border-dim rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:border-accent/30"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-accent w-8 h-8" />
              </div>
              
              <div className="mb-8 p-4 bg-background rounded-2xl w-fit group-hover:bg-accent/10 transition-colors">
                {React.cloneElement(service.icon as React.ReactElement, { className: "text-accent" })}
              </div>

              {service.tag && (
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase rounded-full mb-4">
                  {service.tag}
                </span>
              )}
              
              <h4 className="text-3xl font-bold mb-4">{service.title}</h4>
              <p className="text-text-secondary text-lg leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Wendy & Jeremy",
      location: "British",
      role: "SRRV Holder",
      text: "My husband and I used Expath services to get our SRRV earlier this year. We couldn't have done this without them. They are amazing at getting tourist visas for us whilst the process was in motion, completing paperwork, guidance all the way, and accompanying us to all the government offices, which is a daunting process and their friendly attitude and reassurances all the way through."
    },
    {
      name: "Davide William Hembree",
      location: "American",
      role: "SRRV Holder",
      text: "Everything went smoothly after signing on with Expath. They did all the work for me. Thank you to Sheila Ramos, Clezel, and all others helping this process to be rather easy."
    },
    {
      name: "Jason Wehmhoefer",
      role: "SRRV Holder",
      text: "Sheila Ramos and her team were amazing to work with. They helped me and all my 10,000 questions and always kept me up to date. I can't recommend them more and thank them for all their hard work to make this possible for me."
    },
    {
      name: "Mike",
      role: "SRRV Holder",
      text: "It was amazing, from first communication, my friend referred me to you, and I've been thinking about doing the SRRV for a while. You and your staff helped me out with the NBI, fingerprints... It was very surprising how sufficient and how little time I have to spend. It was the easiest process, the painless."
    },
    {
      name: "Ronny",
      role: "SRRV Holder",
      text: "The application process, including the NBI, Consulate visit, and medical exams went extremely trouble free with the support from her diligent and attentive team. Sheila was true to her word and I successfully executed the SRRV application on time. I highly recommend Expath."
    },
    {
      name: "Jerry",
      role: "SRRV Holder",
      text: "My SRRV journey with Expath has been nothing short of impressive—and memorable! Despite typhoons and an earthquake, the Expath team stayed consistently patient, helpful, and quick to respond. Sheila and Clezel guided me from start to finish with professionalism."
    },
    {
      name: "Rainier",
      location: "USA",
      text: "I just found Expath online. Number one, you guys are good. You are too affordable and not asking for much; it's financially good. I didn't have to go to the Bureau of Immigration and NBI. You helped me digest information easily. You guys are amazing. Good job!"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get 2 testimonials to show
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length]
  ];

  return (
    <section id="testimonials" className="py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border-dim to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-4">Client Success</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">ADDITIONAL CLIENT'S FEEDBACK</h3>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="w-14 h-14 bg-background border border-border-dim rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all group"
            >
              <ChevronRight className="rotate-180 w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className="w-14 h-14 bg-background border border-border-dim rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all group"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="contents"
            >
              {visibleTestimonials.map((testimonial, i) => (
                <div
                  key={`${currentIndex}-${i}`}
                  className="p-12 bg-background border border-border-dim rounded-[3rem] relative flex flex-col h-full"
                >
                  <Quote className="absolute top-10 right-10 text-text-muted opacity-10 w-20 h-20" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-xl font-medium italic mb-8 text-text-secondary leading-relaxed flex-1">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center font-bold text-accent shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <span className="text-lg font-bold block leading-tight">{testimonial.name}</span>
                      <span className="text-sm text-text-muted">
                        {testimonial.location ? `${testimonial.location} • ` : ''}{testimonial.role || 'Client'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'bg-accent w-8' : 'bg-border-dim'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const visaTypes = [
    { name: "Working Visa", icon: <FileText className="w-6 h-6" /> },
    { name: "Spousal Visa", icon: <Users className="w-6 h-6" /> },
    { name: "Student Visa", icon: <Globe className="w-6 h-6" /> },
    { name: "SRRV/ Retirement Visa", icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1920" 
          alt="Philippines Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-16 rounded-[3rem] border border-border-dim flex flex-col justify-between"
          >
            <div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8 text-text-primary">
                Want to make the <br />
                <span className="text-[#FDB931]">PHILIPPINES</span> your <br />
                second <span className="text-accent">HOME</span>?
              </h3>
              
              <div className="mb-12">
                <p className="text-lg font-bold text-text-primary mb-2">We make it easy for you!</p>
                <p className="text-text-secondary">Hassle-free, efficient, and pure customer service!</p>
              </div>

              <div className="space-y-6 mb-12">
                {visaTypes.map((visa) => (
                  <div key={visa.name} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                      {visa.icon}
                    </div>
                    <span className="text-xl font-bold text-text-primary">{visa.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-medium text-text-secondary italic">
              and all related <span className="text-text-primary font-bold">Philippine Immigration Transactions</span>
            </p>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-16 rounded-[3rem] border border-border-dim"
          >
            <div className="mb-16">
              <h4 className="text-3xl font-bold mb-6 text-text-primary border-b border-border-dim pb-4 inline-block">About Us</h4>
              <p className="text-lg text-text-secondary leading-relaxed">
                <span className="text-text-primary font-bold">Expath Philippine Visa Consultancy</span> is a duly accredited marketer of the 
                <span className="text-text-primary font-bold"> Philippine Retirement Authority (PRA)</span> and Consultancy of the 
                <span className="text-text-primary font-bold"> Bureau of Immigration</span>. 
                <span className="text-text-primary font-bold"> EXPATH</span> helps foreigners process and secure 
                <span className="text-accent font-bold"> SRRV (RETIREMENT VISA)</span>, 
                <span className="text-accent font-bold"> 13A (SPOUSAL VISA)</span>, 
                <span className="text-accent font-bold"> WORKING VISA</span>, and 
                <span className="text-accent font-bold"> STUDENT VISA</span>. 
                <span className="text-text-primary font-bold"> EXPATH</span> also help with other immigration related matters such as 
                ECC (Exit Clearance Certificate), Overstaying, Tourist Visa Extension, Apostille Services, BICC, Lifting of Blacklist, etc.
              </p>
            </div>

            <div>
              <h4 className="text-3xl font-bold mb-8 text-text-primary border-b border-border-dim pb-4 inline-block">Contact Us</h4>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-background border border-border-dim rounded-2xl flex items-center justify-center text-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-text-primary">0946 341 2863</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-background border border-border-dim rounded-2xl flex items-center justify-center text-accent">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-text-primary">inquiry@expathph.com</span>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-background border border-border-dim rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-text-primary leading-tight">
                    2nd Floor, Eastern Shipping Lines, MJ Cuenco Avenue, Cebu City (near Plaza Independencia)
                  </span>
                </div>
              </div>
            </div>

            {/* Accreditation Logos */}
            <div className="mt-16 flex justify-end gap-6 opacity-80 grayscale hover:grayscale-0 transition-all">
              <img 
                src="https://www.pra.gov.ph/wp-content/uploads/2021/03/PRA-Logo-2021.png" 
                alt="PRA Logo" 
                className="h-16 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <img 
                src="https://immigration.gov.ph/images/logo/bi_logo.png" 
                alt="BI Logo" 
                className="h-16 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    visaType: 'SRRV (Retirement)',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const path = 'inquiries';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', visaType: 'SRRV (Retirement)', message: '' });
    } catch (error) {
      setSubmitStatus('error');
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em] mb-4">Get in Touch</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">READY TO <br />SETTLE IN?</h3>
            <p className="text-xl text-text-secondary mb-12 max-w-md">
              Contact Sheila today for a free initial assessment of your visa requirements.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-surface border border-border-dim rounded-2xl flex items-center justify-center">
                  <Mail className="text-accent w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Email Us</p>
                  <a href="mailto:sheila@expathph.com" className="text-xl font-bold hover:text-accent transition-colors">sheila@expathph.com</a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-surface border border-border-dim rounded-2xl flex items-center justify-center">
                  <Phone className="text-accent w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Call Us</p>
                  <a href="tel:+639463412863" className="text-xl font-bold hover:text-accent transition-colors">+63 946-341-2863</a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-surface border border-border-dim rounded-2xl flex items-center justify-center">
                  <MapPin className="text-accent w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase mb-1">Visit Us</p>
                  <p className="text-xl font-bold">MJ Cuenco Avenue, Cebu City</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-dim p-10 md:p-16 rounded-[3rem]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted ml-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary" 
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted ml-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-muted ml-2">Visa Type Interested In</label>
                <select 
                  className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors appearance-none text-text-primary"
                  value={formData.visaType}
                  onChange={(e) => setFormData({...formData, visaType: e.target.value})}
                >
                  <option>SRRV (Retirement)</option>
                  <option>Tourist Visa Extension</option>
                  <option>Spousal Visa</option>
                  <option>Working Visa</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-muted ml-2">Message</label>
                <textarea 
                  required
                  rows={4} 
                  className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary" 
                  placeholder="Tell us about your situation..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(0,123,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-sm font-bold text-center mt-4">Inquiry sent successfully! We'll be in touch soon.</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-sm font-bold text-center mt-4">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminPanel = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date descending
      docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setInquiries(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    });

    return () => unsubscribeInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await setDoc(doc(db, 'inquiries', id), { status }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;

    const headers = ['Full Name', 'Email', 'Visa Type', 'Status', 'Date', 'Message'];
    const rows = inquiries.map(inq => [
      `"${inq.fullName}"`,
      `"${inq.email}"`,
      `"${inq.visaType}"`,
      `"${inq.status}"`,
      `"${inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'N/A'}"`,
      `"${inq.message?.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full h-full flex flex-col"
    >
      <div className="relative w-full h-full flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary z-10">
          <X />
        </button>
        
        <div className="flex justify-between items-center mb-8 border-b border-border-dim pb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="text-accent" /> Client Inquiries ({inquiries.length})
          </h2>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border-dim rounded-xl text-xs font-bold uppercase hover:bg-surface transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-text-muted italic">No inquiries yet.</p>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 bg-background border border-border-dim rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold">{inquiry.fullName}</h4>
                      <p className="text-sm text-accent">{inquiry.email}</p>
                    </div>
                    <select 
                      value={inquiry.status}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full bg-surface border border-border-dim ${
                        inquiry.status === 'new' ? 'text-green-400 border-green-400/30' :
                        inquiry.status === 'contacted' ? 'text-blue-400 border-blue-400/30' :
                        'text-text-muted border-border-dim'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-text-muted uppercase font-bold block mb-1">Visa Type</span>
                      <span className="text-text-secondary">{inquiry.visaType}</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase font-bold block mb-1">Date</span>
                      <span className="text-text-secondary">
                        {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Pending...'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-dim">
                    <span className="text-text-muted uppercase font-bold block mb-2 text-xs">Message</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{inquiry.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-dim flex justify-between items-center">
          <div className="text-xs text-text-muted">
            Logged in as: <span className="text-text-primary">{user.email}</span>
          </div>
          <button onClick={() => auth.signOut()} className="text-xs font-bold text-red-500 uppercase">Logout</button>
        </div>
      </div>
    </motion.div>
  );
};

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.startsWith('{')) {
        try {
          const info = JSON.parse(event.error.message);
          setErrorMsg(`Firestore Error: ${info.operationType} on ${info.path} failed.`);
          setHasError(true);
        } catch {
          // Fallback
        }
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface border border-red-500/20 p-10 rounded-[2rem] text-center max-w-md">
          <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-white/60 mb-8">{errorMsg}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-500 text-white font-bold rounded-full">
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const Footer = ({ logoUrl, theme }: { logoUrl: string | null, theme: 'light' | 'dark' }) => {
  const darkLogo = "https://i.ibb.co/LB64mNt/White.png";
  const lightLogo = "https://i.ibb.co/7tPKwq62/Colored.png";
  
  const currentLogo = logoUrl || (theme === 'dark' ? darkLogo : lightLogo);

  return (
    <footer className="py-20 bg-background border-t border-border-dim">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <img src={currentLogo} alt="Expath PH Logo" className="h-8 object-contain" referrerPolicy="no-referrer" />
          </div>
          
          <div className="text-text-muted text-sm font-medium">
            © 2026 Expath Philippine Visa Consultancy. All Rights Reserved.
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-text-secondary hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-secondary hover:text-accent transition-colors">Terms of Service</a>
            <Link to="/admin" className="text-text-secondary hover:text-accent transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Auth Modal ---

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let loginEmail = email;
      
      // If it's not an email, assume it's a username
      if (!email.includes('@')) {
        const usernameDoc = await getDoc(doc(db, 'usernames', email.toLowerCase()));
        if (!usernameDoc.exists()) {
          throw new Error("Username not found.");
        }
        loginEmail = usernameDoc.data().email;
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background border border-border-dim p-8 rounded-[2rem] w-full max-w-md relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-text-secondary hover:text-text-primary"
        >
          <X />
        </button>

        <h2 className="text-3xl font-bold mb-2 tracking-tight">Admin Sign In</h2>
        <p className="text-text-secondary mb-8 text-sm">Sign in to manage your visa inquiries.</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2 ml-4">Email or Username</label>
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border-dim rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors text-text-primary"
              placeholder="Enter email or username"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-2 ml-4">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border-dim rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors text-text-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

// --- Main App Components ---

const LandingPage = ({ assets, theme, toggleTheme }: { assets: { logo: string | null, background: string | null }, theme: 'light' | 'dark', toggleTheme: () => void }) => {
  return (
    <div className="selection:bg-accent selection:text-white">
      <Navbar logoUrl={assets.logo} theme={theme} toggleTheme={toggleTheme} />
      <Hero backgroundUrl={assets.background} />
      <Offer />
      
      {/* Photo Highlight Section */}
      <section className="h-[60vh] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=1920" 
          alt="Tropical Lifestyle" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center p-10 glass rounded-[3rem] max-w-2xl mx-6"
          >
            <h4 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-primary">Your Gateway to the Philippines.</h4>
            <p className="text-text-secondary text-lg">Cebu City based, Bureau of Immigration recognized partner.</p>
          </motion.div>
        </div>
      </section>

      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer logoUrl={assets.logo} theme={theme} />
    </div>
  );
};

const AdminPage = ({ user, isAdmin, theme, toggleTheme }: { user: User | null, isAdmin: boolean, theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowAuth(true);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-surface border border-border-dim rounded-full hover:bg-accent/10 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-8 tracking-tighter uppercase">Admin <span className="text-accent">Access</span></h1>
        <button 
          onClick={() => setShowAuth(true)}
          className="px-8 py-4 bg-accent text-white font-bold rounded-full hover:scale-105 transition-transform"
        >
          Sign In to Dashboard
        </button>
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
        <Link to="/" className="mt-8 text-text-muted hover:text-text-primary transition-colors text-sm">Back to Site</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface border border-red-500/20 p-10 rounded-[2rem] text-center max-w-md">
          <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-text-secondary mb-8">You do not have administrative privileges. Logged in as: {user.email}</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => auth.signOut()} className="px-8 py-3 bg-red-500 text-white font-bold rounded-full">
              Logout
            </button>
            <Link to="/" className="text-text-muted hover:text-text-primary transition-colors text-sm">Back to Site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-10 h-10 bg-surface border border-border-dim rounded-full flex items-center justify-center hover:bg-accent/10 transition-colors">
              <ChevronRight className="rotate-180" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Admin <span className="text-accent">Dashboard</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-surface border border-border-dim rounded-full hover:bg-accent/10 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => auth.signOut()} className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase hover:bg-red-500/20 transition-colors">
              Logout
            </button>
          </div>
        </div>
        
        <div className="bg-surface border border-border-dim rounded-[3rem] p-8 min-h-[70vh]">
          <AdminPanel user={user} onClose={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [assets, setAssets] = useState<{ logo: string | null, background: string | null }>({ logo: null, background: null });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    });

    const unsubscribeAssets = onSnapshot(collection(db, 'assets'), (snapshot) => {
      const newAssets = { logo: null, background: null };
      snapshot.docs.forEach(doc => {
        if (doc.id === 'logo') newAssets.logo = doc.data().url;
        if (doc.id === 'background') newAssets.background = doc.data().url;
      });
      setAssets(newAssets);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'assets');
    });

    return () => {
      unsubscribeAuth();
      unsubscribeAssets();
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage assets={assets} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/admin" element={<AdminPage user={user} isAdmin={isAdmin} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
