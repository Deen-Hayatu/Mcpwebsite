import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Mail, Heart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";
import indArchImg from "@/assets/independence-arch.png";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Research & Publications", href: "/research" },
    { name: "Events & Programs", href: "/events" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Special navigation item with different styling for donation button
  const donateLink = { name: "Donate", href: "/donate" };

  return (
    <header className="bg-white">
      {/* Top header with logo and action buttons */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <MPCLogo size="lg" showText={false} />
              </div>
            </Link>
            
            {/* Independence Arch of Ghana */}
            <div className="hidden md:flex flex-1 justify-center px-6">
              <div className="relative h-20 w-auto">
                <img 
                  src={indArchImg} 
                  alt="Independence Arch of Ghana" 
                  className="h-full object-contain"
                  style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))' }}
                />
              </div>
            </div>

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
                    >
                      <Heart size={16} />
                      <span>{donateLink.name}</span>
                    </Button>
                  </div>
                </Link>
                
                {/* Subscribe Button */}
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
              </div>

              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="md:hidden text-foreground">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main navigation bar - WHO style */}
      <div className="bg-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex">
            {/* Home icon link */}
            <Link href="/">
              <div
                className={`flex items-center justify-center py-4 px-6 font-medium cursor-pointer text-lg ${
                  location === "/"
                    ? "text-accent border-b-2 border-accent"
                    : "text-neutral-800 hover:text-accent hover:bg-gray-200 transition"
                }`}
              >
                <Home size={22} />
              </div>
            </Link>
            
            {/* Main navigation links */}
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div
                  className={`py-4 px-6 font-medium cursor-pointer text-lg ${
                    location === link.href
                      ? "text-accent border-b-2 border-accent"
                      : "text-neutral-800 hover:text-accent hover:bg-gray-200 transition"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 border-t border-gray-200">
          {/* Home link for mobile */}
          <Link href="/">
            <div
              className={`block py-3 cursor-pointer flex items-center gap-2 ${
                location === "/"
                  ? "text-accent"
                  : "text-foreground hover:text-accent transition"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </div>
          </Link>
          
          {/* Regular nav links for mobile */}
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <div
                className={`block py-3 cursor-pointer ${
                  location === link.href
                    ? "text-accent"
                    : "text-foreground hover:text-accent transition"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </div>
            </Link>
          ))}
          {/* Mobile Donate Link */}
          <Link href={donateLink.href}>
            <div
              className="block py-3 text-primary hover:text-primary/80 transition flex items-center gap-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={16} />
              <span>Donate</span>
            </div>
          </Link>
          
          {/* Mobile Subscribe Link */}
          <Link href="/newsletter">
            <div
              className="block py-3 text-secondary hover:text-yellow-600 transition flex items-center gap-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail size={16} />
              <span>Subscribe to Newsletter</span>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
