import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Mail, Heart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import { GhanaWaves } from "@/components/ui/GhanaElements";
import { TransitionLink } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import indArchImg from "@/assets/independence-arch.png";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to update header style
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Research & Publications", href: "/research" },
    { name: "Events & Programs", href: "/events" },
    { name: "Our Team", href: "/staff" },
    { name: "Gallery", href: "/gallery" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Special navigation item with different styling for donation button
  const donateLink = { name: "Donate", href: "/donate" };

  return (
    <header className={`bg-white transition-all duration-300 ${scrolled ? 'sticky top-0 z-50 shadow-md' : ''}`}>
      {/* Top header with logo and action buttons */}
      <div className={`border-b border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white transition-all duration-300`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/">
              <motion.div 
                className="flex items-center cursor-pointer" 
                animate={{ scale: scrolled ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <MPCLogo size={scrolled ? "md" : "lg"} showText={true} />
              </motion.div>
            </Link>
            
            {/* Independence Arch of Ghana with Wavy Lines - Hide when scrolled */}
            <AnimatePresence>
              {!scrolled && (
                <motion.div 
                  className="flex-1 items-center justify-center hidden md:flex landscape:flex"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Left Ghana Waves */}
                    <div className="w-44 h-10 md:h-14">
                      <GhanaWaves side="left" className="h-full w-full" />
                    </div>
                    
                    {/* Center Independence Arch */}
                    <div className="relative h-16 md:h-24 z-10">
                      <img 
                        src={indArchImg} 
                        alt="Independence Arch of Ghana" 
                        className="h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          opacity: 0.9,
                          mixBlendMode: 'multiply'
                        }}
                      />
                    </div>
                    
                    {/* Right Ghana Waves */}
                    <div className="w-44 h-10 md:h-14">
                      <GhanaWaves side="right" className="h-full w-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile version (Portrait only) - Hide when scrolled */}
            <AnimatePresence>
              {!scrolled && (
                <motion.div 
                  className="flex-1 flex md:hidden landscape:hidden items-center justify-center"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-1 w-full">
                    {/* Simplified smaller waves for mobile with arch */}
                    <div className="w-20 h-8">
                      <GhanaWaves side="left" className="h-full w-full" />
                    </div>
                    
                    {/* Center Independence Arch - smaller for portrait mobile */}
                    <div className="relative h-14 z-10 mx-1">
                      <img 
                        src={indArchImg} 
                        alt="Independence Arch of Ghana" 
                        className="h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          opacity: 0.9,
                          mixBlendMode: 'multiply'
                        }}
                      />
                    </div>
                    
                    <div className="w-20 h-8">
                      <GhanaWaves side="right" className="h-full w-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* When scrolled, show simplified nav like Airbnb */}
            {scrolled && (
              <div className="flex-1 justify-center hidden md:flex">
                <nav className="flex space-x-2">
                  {/* Simplified navigation links when scrolled */}
                  <TransitionLink 
                    href="/" 
                    className="py-2 px-3 text-neutral-800 hover:bg-gray-100 rounded-full transition"
                    activeClassName="bg-gray-100 font-medium"
                  >
                    <Home size={18} className="inline-block mr-1" />
                    <span className="text-sm">Home</span>
                  </TransitionLink>
                  
                  {navLinks.map((link) => (
                    <TransitionLink 
                      key={link.name} 
                      href={link.href}
                      className="py-2 px-3 text-neutral-800 hover:bg-gray-100 rounded-full transition text-sm"
                      activeClassName="bg-gray-100 font-medium"
                    >
                      {link.name}
                    </TransitionLink>
                  ))}
                </nav>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="text-gray-600 hidden md:flex">
                <Search size={20} />
              </Button>
              
              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {/* Donate Button */}
                <Link href={donateLink.href}>
                  <div>
                    <Button
                      className="items-center gap-2 bg-primary hover:bg-primary/90 text-white"
                      size={scrolled ? "sm" : "default"}
                    >
                      <Heart size={16} />
                      <span>{donateLink.name}</span>
                    </Button>
                  </div>
                </Link>
                
                {/* Subscribe Button - Hide on scroll */}
                {!scrolled && (
                  <Link href="/newsletter">
                    <div>
                      <Button
                        className="items-center gap-2 bg-secondary hover:bg-yellow-400 text-secondary-foreground"
                      >
                        <Mail size={16} />
                        <span>Subscribe</span>
                      </Button>
                    </div>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="md:hidden text-foreground">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main navigation bar - WHO style - Hide when scrolled */}
      {!scrolled && (
        <div className="bg-gray-100 shadow-sm">
          <div className="container mx-auto px-4">
            <nav className="hidden md:flex">
              {/* Home icon link */}
              <TransitionLink 
                href="/" 
                className="flex items-center justify-center py-4 px-6 font-medium cursor-pointer text-lg text-neutral-800 hover:text-accent hover:bg-gray-200 transition"
                activeClassName="text-accent !bg-transparent"
              >
                <div className="relative">
                  <Home size={22} />
                  {location === "/" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 -mb-4 bg-accent" />
                  )}
                </div>
              </TransitionLink>
              
              {/* Main navigation links */}
              {navLinks.map((link) => (
                <TransitionLink 
                  key={link.name} 
                  href={link.href}
                  className="py-4 px-6 font-medium cursor-pointer text-lg text-neutral-800 hover:text-accent hover:bg-gray-200 transition"
                  activeClassName="text-accent !bg-transparent"
                >
                  <div className="relative">
                    {link.name}
                    {location === link.href && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 -mb-4 bg-accent" />
                    )}
                  </div>
                </TransitionLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 border-t border-gray-200 absolute w-full z-50 shadow-lg">
          {/* Logo at top of mobile menu */}
          <div className="flex justify-center py-3 border-b border-gray-100 mb-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <MPCLogo size="sm" showText={true} />
            </Link>
          </div>
          
          {/* Home link for mobile */}
          <TransitionLink 
            href="/"
            className="block py-3 cursor-pointer flex items-center gap-2 text-foreground hover:text-accent transition"
            activeClassName="text-accent"
          >
            <div onClick={() => setMobileMenuOpen(false)}>
              <Home size={18} />
              <span>Home</span>
            </div>
          </TransitionLink>
          
          {/* Regular nav links for mobile */}
          {navLinks.map((link) => (
            <TransitionLink 
              key={link.name} 
              href={link.href}
              className="block py-3 cursor-pointer text-foreground hover:text-accent transition"
              activeClassName="text-accent"
            >
              <div onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </div>
            </TransitionLink>
          ))}
          {/* Mobile Donate Link */}
          <TransitionLink 
            href={donateLink.href}
            className="block py-3 text-primary hover:text-primary/80 transition flex items-center gap-2 cursor-pointer"
          >
            <div onClick={() => setMobileMenuOpen(false)}>
              <Heart size={16} className="inline-block mr-2" />
              <span>Donate</span>
            </div>
          </TransitionLink>
          
          {/* Mobile Subscribe Link */}
          <TransitionLink 
            href="/newsletter"
            className="block py-3 text-secondary hover:text-yellow-600 transition flex items-center gap-2 cursor-pointer"
          >
            <div onClick={() => setMobileMenuOpen(false)}>
              <Mail size={16} className="inline-block mr-2" />
              <span>Subscribe to Newsletter</span>
            </div>
          </TransitionLink>
        </div>
      )}
    </header>
  );
};

export default Header;
