import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Mail, Heart, Home, Search, User, ChevronDown, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import { GhanaWaves } from "@/components/ui/GhanaElements";
import { TransitionLink } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/ui/micro-interactions";
import indArchImg from "@/assets/independence-arch.png";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logoutMutation } = useAuth();

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
  
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive && searchInputRef.current) {
      // Focus input when search is activated
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      
      // Don't close search if clicked inside its area
      if (searchActive && searchInputRef.current && 
          !searchInputRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('.search-area')) {
        setSearchActive(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchActive, userMenuOpen]);

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
              {/* Expandable Search Field - Airbnb Style */}
              <div className="hidden md:block relative search-area">
                <AnimatePresence>
                  {searchActive ? (
                    <FadeIn>
                      <motion.div 
                        initial={{ width: 40, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 40, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <Input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search research papers, events..."
                          className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-primary"
                        />
                        <Search 
                          size={18} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                        />
                      </motion.div>
                    </FadeIn>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 rounded-full hover:bg-gray-100"
                      onClick={toggleSearch}
                    >
                      <Search size={20} />
                    </Button>
                  )}
                </AnimatePresence>
              </div>
              
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
                
                {/* User Profile Menu - Airbnb Style */}
                <div className="relative" ref={userMenuRef}>
                  <Button 
                    onClick={toggleUserMenu}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 rounded-full border border-gray-300 p-2 shadow-sm hover:shadow"
                  >
                    <Menu size={16} />
                    <User size={16} className="text-gray-700" />
                  </Button>
                  
                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      >
                        {user ? (
                          <>
                            <div className="border-b border-gray-100 pb-2">
                              <div className="px-4 py-2">
                                <p className="text-sm font-medium">
                                  {user.username}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                              <Link href="/account/security">
                                <button className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-50 items-center gap-2">
                                  <Shield size={16} />
                                  <span>Account Security</span>
                                </button>
                              </Link>
                              {user.isAdmin && (
                                <Link href="/admin/test-email">
                                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                    Admin Tools
                                  </button>
                                </Link>
                              )}
                            </div>
                            <div className="py-1">
                              <button 
                                onClick={() => {
                                  logoutMutation.mutate();
                                  setUserMenuOpen(false);
                                }}
                                className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500 items-center gap-2"
                              >
                                <LogOut size={16} />
                                <span>Log out</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="border-b border-gray-100 pb-2">
                              <Link href="/auth">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                  Log in
                                </button>
                              </Link>
                              <Link href="/auth?tab=register">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-medium">
                                  Sign up
                                </button>
                              </Link>
                            </div>
                            <div className="py-1">
                              <Link href="/get-involved">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                  Get Involved
                                </button>
                              </Link>
                              <Link href="/newsletter">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                  Newsletter
                                </button>
                              </Link>
                              <Link href="/contact">
                                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                  Contact Us
                                </button>
                              </Link>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 p-2"
                  onClick={toggleSearch}
                >
                  <Search size={20} />
                </Button>
                <button onClick={toggleMobileMenu} className="text-foreground p-1">
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
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

      {/* Mobile Search Input - Shown when search is active */}
      <AnimatePresence>
        {searchActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white py-3 px-4 border-t border-gray-200 shadow-sm z-40"
          >
            <div className="relative">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search research papers, events..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-primary w-full"
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                onClick={() => setSearchActive(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
