import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  HeartHandshake, 
  FileCheck, 
  Calendar, 
  Landmark, 
  Users, 
  Plane, 
  Building2, 
  HelpCircle, 
  FileText,
  BadgeCheck,
  Sparkles,
  Phone,
  Mail,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SRRVPageProps {
  logoUrl: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function SRRVPage({ logoUrl, theme, toggleTheme }: SRRVPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    visaType: 'SRRV (Retirement)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const consultationUrl = "https://cal.id/sheila-ramos/free-srrv-consultation?overlayCalendar=true";
  const darkLogo = "https://i.ibb.co/LB64mNt/White.png";
  const lightLogo = "https://i.ibb.co/7tPKwq62/Colored.png";
  const currentLogo = logoUrl || (theme === 'dark' ? darkLogo : lightLogo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        source: 'SRRV Dedicated Page',
        createdAt: serverTimestamp()
      });
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        email: '',
        visaType: 'SRRV (Retirement)',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const keyBenefits = [
    {
      title: "Indefinite Residency",
      desc: "SRRV holders can reside in the Philippines indefinitely with no need to renew their visa regularly.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "Multiple Entry Privileges",
      desc: "The visa allows for unlimited entry and exit to and from the Philippines.",
      icon: <Plane className="w-6 h-6" />
    },
    {
      title: "Exemption from Taxes and Fees",
      desc: "SRRV holders are exempt from exit and re-entry permits, Philippine Bureau of Immigration clearances, and customs duties and taxes on certain household items.",
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: "Access to Health Care & Special Discounts",
      desc: "Retirees can take advantage of exclusive healthcare discounts and benefits at PRA-accredited hospitals and establishments.",
      icon: <HeartHandshake className="w-6 h-6" />
    },
    {
      title: "Dependents Coverage",
      desc: "The SRRV can also cover qualified dependents, including a spouse and children, offering family-centered relocation benefits.",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const eligibilityItems = [
    {
      label: "Age Requirement",
      title: "Be at least 50 years old",
      desc: "The standard SRRV retirement program is designated for foreign nationals and former Filipino citizens aged 50 and above."
    },
    {
      label: "Deposit Standards",
      title: "Meet minimum bank deposit requirements",
      desc: "Financial requirements vary based on whether you receive a qualifying monthly pension or qualify under expanded courtesy rules."
    },
    {
      label: "SRRV Classic Option",
      title: "$15,000 or $30,000 Time Deposit",
      desc: "$30,000 for applicants without pension; or $15,000 for applicants with a qualifying guaranteed pension of at least $800/month (single individual) or $1,000/month (with dependents)."
    },
    {
      label: "SRRV Courtesy Option",
      title: "$1,500 Visa Deposit",
      desc: "Available for former Filipino citizens, honorary consuls, retired officers of international organizations, and former military personnel."
    },
    {
      label: "Medical & Police Clearance",
      title: "Pass Medical Exam & Background Check",
      desc: "Mandatory medical screening and police/NBI background clearances as officially prescribed by the Philippine Retirement Authority."
    },
    {
      label: "Accredited Time Deposit",
      title: "Bank Deposit in PRA-Accredited Facility",
      desc: "Maintain the deposit in a designated PRA-accredited bank (e.g. DBP, LandBank) as financial assurance, which can later qualify for active real estate investment."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Initial Consultation",
      desc: "Schedule a consultation with our accredited PRA specialists to understand specific visa qualifications, options, and personalized timeline."
    },
    {
      step: "02",
      title: "Document Preparation",
      desc: "Gather and authenticate necessary documents including valid passport, police clearances, medical certificates, and proof of pension (if applicable)."
    },
    {
      step: "03",
      title: "Submission and Review",
      desc: "We submit the complete application and bank certification directly to the Philippine Retirement Authority (PRA) for formal evaluation and clearance."
    },
    {
      step: "04",
      title: "Approval & Visa Issuance",
      desc: "Upon official endorsement by PRA and the Bureau of Immigration, your SRRV sticker and PRA ID card are issued, granting permanent indefinite residency."
    }
  ];

  const faqs = [
    {
      q: "To qualify for the SRRV Expanded Courtesy, do I need to be retired from the military?",
      a: "No, as long as you served in the military, you can qualify for the SRRV Courtesy category."
    },
    {
      q: "Do I need to be officially retired to qualify for the SRRV?",
      a: "Not necessarily, as long as you are 50 years old and meet the requirements, you are qualified for the SRRV. The deposit and requirements may vary based on your pension status."
    },
    {
      q: "Do I lose my deposit in applying for the SRRV?",
      a: "No, the deposit you make is still yours. It remains held in your designated time-deposit account. If you ever decide to cancel your SRRV in the future, you receive that deposit back in full."
    },
    {
      q: "What investments can I use my deposit for?",
      a: "For those who have deposited $15,000–$30,000 USD under SRRV Classic, you may convert this deposit into an active investment such as the purchase of a condominium unit or a long-term registered lease of a house and lot."
    },
    {
      q: "If I already purchased or leased a property, can I use that towards the investment?",
      a: "No, you will still need to deposit the $15,000 or $30,000 initially into the PRA-accredited bank. Once the visa is approved and issued, you can apply to convert the deposit into your qualified property investment."
    }
  ];

  const relatedVisas = [
    {
      title: "SRRV 40",
      subtitle: "For Foreigners 40–49 Years Old",
      desc: "Alternative retirement visa option for younger retirees with qualifying deposit programs."
    },
    {
      title: "Immigrant Visa by Marriage (13A)",
      subtitle: "For Foreigners Married to Filipino Spouses",
      desc: "Permanent resident visa granting unrestricted stay, working rights, and family stability in the Philippines."
    },
    {
      title: "Pre-Arranged Working Visa (9G)",
      subtitle: "For Professionals & Corporate Executives",
      desc: "Commercial employment visa sponsored by Philippine registered entities with AEP work permit processing."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={currentLogo} 
              alt="Expath PH Logo" 
              className="h-8 md:h-10 object-contain" 
              referrerPolicy="no-referrer" 
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Home
            </Link>
            <a href="#benefits" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Visa Benefits
            </a>
            <a href="#eligibility" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Eligibility
            </a>
            <a href="#process" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Process
            </a>
            <a href="#faqs" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              FAQs
            </a>
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-surface border border-border-dim rounded-full hover:bg-accent/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sparkles className="w-4 h-4 text-accent" /> : <Sparkles className="w-4 h-4 text-accent" />}
            </button>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,123,255,0.3)] flex items-center gap-1.5"
            >
              Free Consultation <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 bg-surface border border-border-dim rounded-full"
              aria-label="Toggle theme"
            >
              <Sparkles className="w-4 h-4 text-accent" />
            </button>
            <button 
              className="text-text-primary p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-border-dim overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <Link to="/" className="text-lg font-medium py-2 text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <a href="#benefits" className="text-lg font-medium py-2 text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Visa Benefits
                </a>
                <a href="#eligibility" className="text-lg font-medium py-2 text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Eligibility Criteria
                </a>
                <a href="#process" className="text-lg font-medium py-2 text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Application Process
                </a>
                <a href="#faqs" className="text-lg font-medium py-2 text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
                  FAQs
                </a>
                <a 
                  href={consultationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-4 bg-accent text-center text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,123,255,0.3)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Free Consultation
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-border-dim/40">
        <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-accent/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-text-muted mb-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/#services" className="hover:text-accent transition-colors">Visa Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-secondary">Visas & Immigration</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-accent font-semibold">Special Resident Retirees Visa (SRRV)</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6">
                <BadgeCheck className="w-4 h-4" />
                PRA Accredited Marketer • For Foreigners 50 Years Old and Above
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                Special Resident <br className="hidden sm:inline" />
                <span className="text-accent">Retirees Visa</span> (SRRV)
              </h1>

              <p className="text-lg md:text-2xl text-text-secondary font-normal max-w-3xl leading-relaxed mb-8">
                The Special Resident Retirees Visa (SRRV) is a unique, long-term residency visa designed specifically for foreign nationals and former Filipino citizens who wish to retire in the Philippines.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href={consultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,123,255,0.4)] transition-all"
                >
                  Book Free Consultation <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#inquiry"
                  className="px-8 py-4 bg-surface hover:bg-surface/80 border border-border-dim text-text-primary font-bold rounded-full flex items-center justify-center gap-2 transition-all"
                >
                  Send Inquiry Form
                </a>
              </div>

              {/* Jump to section links */}
              <div className="pt-6 border-t border-border-dim/60">
                <p className="text-xs uppercase font-bold text-text-muted tracking-wider mb-3">Jump to section</p>
                <div className="flex flex-wrap gap-2.5">
                  <a href="#benefits" className="px-4 py-2 bg-surface hover:bg-accent/10 hover:border-accent/30 border border-border-dim rounded-full text-xs font-semibold text-text-secondary hover:text-accent transition-all flex items-center gap-1.5">
                    Visa Benefits <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a href="#eligibility" className="px-4 py-2 bg-surface hover:bg-accent/10 hover:border-accent/30 border border-border-dim rounded-full text-xs font-semibold text-text-secondary hover:text-accent transition-all flex items-center gap-1.5">
                    Eligibility Criteria <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a href="#process" className="px-4 py-2 bg-surface hover:bg-accent/10 hover:border-accent/30 border border-border-dim rounded-full text-xs font-semibold text-text-secondary hover:text-accent transition-all flex items-center gap-1.5">
                    Application Process <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a href="#faqs" className="px-4 py-2 bg-surface hover:bg-accent/10 hover:border-accent/30 border border-border-dim rounded-full text-xs font-semibold text-text-secondary hover:text-accent transition-all flex items-center gap-1.5">
                    FAQs <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a href="#assistance" className="px-4 py-2 bg-surface hover:bg-accent/10 hover:border-accent/30 border border-border-dim rounded-full text-xs font-semibold text-text-secondary hover:text-accent transition-all flex items-center gap-1.5">
                    Assistance <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Card */}
            <div className="lg:col-span-4">
              <div className="p-8 bg-surface border border-border-dim rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-[11px] font-bold uppercase rounded-full mb-4">
                  Official Status
                </span>
                
                <h3 className="text-xl font-bold mb-3">Philippine Retirement Authority (PRA)</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Multiple-entry, indefinite stay privilege granted to qualifying retirees with flexible living arrangements and full investment protections.
                </p>

                <div className="space-y-3.5 text-sm mb-6 border-y border-border-dim py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Target Age</span>
                    <span className="font-bold text-text-primary">50 Years Old & Above</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Stay Duration</span>
                    <span className="font-bold text-accent">Indefinite (Permanent)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Exit Clearance</span>
                    <span className="font-bold text-green-400">Exempt from ECC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Deposit Protection</span>
                    <span className="font-bold text-text-primary">100% Refundable</span>
                  </div>
                </div>

                <div className="p-4 bg-background/60 border border-border-dim rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="text-accent w-5 h-5 shrink-0" />
                  <p className="text-xs text-text-secondary">
                    <strong className="text-text-primary">0 Agency Fees</strong> available for SRRV application processing through Expath Philippines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Key Benefits of the SRRV */}
      <section id="benefits" className="py-24 bg-surface/30 border-b border-border-dim/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
              About The Visa
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Key Benefits of the SRRV
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              Managed by the Philippine Retirement Authority (PRA), the SRRV provides retirees with the convenience of a multiple-entry, indefinite stay visa that includes a wide range of benefits, making retirement in the Philippines an attractive option. With the SRRV, eligible retirees enjoy flexibility, cost savings, and a welcoming community, enabling a comfortable lifestyle within a vibrant, tropical setting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 bg-surface border border-border-dim rounded-[2rem] hover:border-accent/40 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-background border border-border-dim rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent/10 transition-colors">
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary">{b.title}</h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">{b.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-dim/50 flex items-center gap-2 text-xs font-semibold text-accent">
                  <CheckCircle2 className="w-4 h-4" /> Lifetime Privilege
                </div>
              </motion.div>
            ))}

            {/* Bonus Card: Family Relocation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-8 bg-gradient-to-br from-accent/15 via-surface to-surface border border-accent/30 rounded-[2rem] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-primary">Accredited Marketer Advantage</h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  As an officially accredited PRA marketer, Expath provides direct filing, government bank liaison, document authentication, and representation at all official hearings.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-dim/50">
                <a 
                  href={consultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  Schedule an exploratory call <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Eligibility Criteria */}
      <section id="eligibility" className="py-24 bg-background border-b border-border-dim/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
                Who Can Apply
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Eligibility Criteria
              </h2>
              <p className="text-text-secondary text-base md:text-lg mt-4">
                Basic qualifications and financial criteria required by the Philippine Retirement Authority (PRA):
              </p>
            </div>
            
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-surface hover:bg-accent/10 border border-border-dim rounded-full text-sm font-bold text-accent transition-all flex items-center gap-2"
            >
              Check My Eligibility <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Eligibility Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {eligibilityItems.map((item, idx) => (
              <div 
                key={item.title}
                className="p-8 bg-surface border border-border-dim rounded-[2rem] hover:border-accent/30 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1 bg-accent/10 rounded-full">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-text-muted">0{idx + 1}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-text-muted">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Meets PRA requirement
                </div>
              </div>
            ))}
          </div>

          {/* Quick Deposit Breakdown Table / Callout */}
          <div className="p-8 md:p-10 bg-surface border border-border-dim rounded-[2.5rem] text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Deposit Schemes Comparison</h3>
            <p className="text-text-secondary text-sm mb-8">
              Choose the program best suited to your pension status or background.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Classic */}
              <div className="p-6 bg-background rounded-2xl border border-border-dim space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-lg">SRRV Classic</h4>
                  <span className="text-xs px-2.5 py-1 bg-accent/20 text-accent font-bold rounded-md">Most Common</span>
                </div>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>Without Pension:</strong> $30,000 USD time deposit in accredited bank.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>With Pension:</strong> $15,000 USD time deposit (requires proof of monthly pension ≥ $800 single or $1,000 with family).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>Convertible to Real Estate:</strong> Can be converted into a condominium purchase or long-term lease.</span>
                  </li>
                </ul>
              </div>

              {/* Option B: Courtesy */}
              <div className="p-6 bg-background rounded-2xl border border-border-dim space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-lg">SRRV Courtesy / Expanded</h4>
                  <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-400 font-bold rounded-md">Discounted Deposit</span>
                </div>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>Low Deposit Requirement:</strong> Only $1,500 USD time deposit.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>Eligible Groups:</strong> Former Filipino citizens, honorary consuls, retired officers of international organizations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span><strong>Military Service:</strong> Former military personnel qualify (active military retirement not strictly required, service suffices).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Application Process */}
      <section id="process" className="py-24 bg-surface/30 border-b border-border-dim/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Application Process
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              The exact requirements and timing depend on your circumstances, but most applications follow these stages:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="p-8 bg-surface border border-border-dim rounded-[2.5rem] relative group hover:border-accent/40 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-background border border-border-dim rounded-2xl flex items-center justify-center font-mono font-bold text-accent text-xl mb-6 group-hover:bg-accent/10 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-border-dim/50 flex items-center gap-1.5 text-xs text-text-muted">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Milestone Complete
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-secondary text-sm mb-4">
              Looking for a comprehensive breakdown of processing times and authenticated translations?
            </p>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-bold hover:underline"
            >
              Speak directly with an accredited consultant <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: FAQs */}
      <section id="faqs" className="py-24 bg-background border-b border-border-dim/40 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
              FAQs
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Questions & Answers
            </h2>
            <p className="text-text-secondary text-base md:text-lg">
              Frequently asked questions regarding PRA guidelines, deposits, and real estate options.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-surface border border-border-dim rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 hover:text-accent transition-colors"
                  >
                    <span className="text-base md:text-lg font-bold pr-2">{faq.q}</span>
                    <span className={`p-2 bg-background rounded-full shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : 'text-text-muted'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-text-secondary text-sm md:text-base leading-relaxed border-t border-border-dim/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Application Assistance */}
      <section id="assistance" className="py-24 bg-surface/40 border-b border-border-dim/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
              Application Assistance
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              If you’d like help with the process
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              We prepare the documents, coordinate the application, and keep you informed from onboarding through completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-8 bg-surface border border-border-dim rounded-[2rem]">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-accent mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Itemized Quote</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Professional and government fees are shown separately with complete clarity.
              </p>
            </div>

            <div className="p-8 bg-surface border border-border-dim rounded-[2rem]">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-accent mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dedicated Contact</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A personal communications manager keeps you updated at every stage.
              </p>
            </div>

            <div className="p-8 bg-surface border border-border-dim rounded-[2rem]">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-accent mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Clear protocols and bank draft guidelines for every invoice and deposit.
              </p>
            </div>

            <div className="p-8 bg-surface border border-border-dim rounded-[2rem]">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-accent mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">In-Person Support</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We meet and accompany you at government and bank appointments when required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Related Services */}
      <section className="py-20 bg-background border-b border-border-dim/40 relative">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">You May Also Need</span>
              <h3 className="text-2xl md:text-3xl font-extrabold">Related Visa Services</h3>
            </div>
            <Link to="/#services" className="text-accent text-sm font-bold hover:underline flex items-center gap-1">
              View all visa services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVisas.map((v) => (
              <div 
                key={v.title}
                className="p-8 bg-surface border border-border-dim rounded-[2rem] flex flex-col justify-between hover:border-accent/30 transition-all"
              >
                <div>
                  <h4 className="text-xl font-bold mb-1">{v.title}</h4>
                  <p className="text-xs text-accent font-semibold mb-3">{v.subtitle}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-dim">
                  <Link to="/#contact" className="text-xs font-bold text-text-primary hover:text-accent flex items-center gap-1">
                    Explore service <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Inquiries Form & Final CTA */}
      <section id="inquiry" className="py-24 bg-surface/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.25em] block mb-3">
                Ready To Get Started?
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Your Retirement In The Philippines Made Easy.
              </h2>
              <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-8">
                Get clear advice on the SRRV, bank deposit guidelines, and your next steps in the Philippines. Our accredited team in Cebu and across the Philippines is here to guide you every step of the way.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href={consultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-full inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,123,255,0.4)] transition-all"
                >
                  Book Free Consultation <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              <div className="p-6 bg-surface border border-border-dim rounded-2xl flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="text-accent w-5 h-5" />
                  <div>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Direct Email</p>
                    <a href="mailto:sheila@expathph.com" className="text-sm font-bold hover:text-accent">sheila@expathph.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-accent w-5 h-5" />
                  <div>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Call / WhatsApp</p>
                    <a href="tel:+639463412863" className="text-sm font-bold hover:text-accent">+63 946-341-2863</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-surface border border-border-dim p-8 md:p-10 rounded-[3rem] text-left">
              <h3 className="text-2xl font-bold mb-2">Request SRRV Assessment</h3>
              <p className="text-sm text-text-secondary mb-6">
                Fill out the form below and an accredited visa specialist will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-text-muted ml-2 block mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary text-sm"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-text-muted ml-2 block mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary text-sm"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-text-muted ml-2 block mb-1">Visa Category</label>
                  <select
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary text-sm appearance-none"
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                  >
                    <option value="SRRV (Retirement)">SRRV (Retirement - 50+)</option>
                    <option value="SRRV Courtesy">SRRV Courtesy / Military</option>
                    <option value="SRRV 40">SRRV 40 (Younger Retirees)</option>
                    <option value="Tourist Visa Extension">Tourist Visa Extension</option>
                    <option value="Spousal Visa">Spousal Visa (13A)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-text-muted ml-2 block mb-1">Your Message or Questions</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-background border border-border-dim rounded-2xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-text-primary text-sm"
                    placeholder="Tell us about your target timeline, pension or deposit questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(0,123,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit SRRV Inquiry'}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-green-500 text-sm font-bold text-center">
                    Thank you! Your SRRV inquiry was received. We will contact you shortly.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm font-bold text-center">
                    Failed to send. Please try again or book directly via the consultation calendar.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border-dim">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={currentLogo} alt="Expath PH Logo" className="h-8 object-contain" referrerPolicy="no-referrer" />
            </Link>

            <div className="text-text-muted text-sm font-medium">
              © 2026 Expath Philippine Visa Consultancy. Accredited Marketer of the Philippine Retirement Authority.
            </div>

            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-text-secondary hover:text-accent transition-colors">Home</Link>
              <Link to="/#services" className="text-text-secondary hover:text-accent transition-colors">Services</Link>
              <Link to="/#contact" className="text-text-secondary hover:text-accent transition-colors">Contact</Link>
              <Link to="/admin" className="text-text-secondary hover:text-accent transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
