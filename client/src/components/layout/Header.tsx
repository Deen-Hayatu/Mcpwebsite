import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import MPCLogo from "@/components/ui/logo";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About MpC", href: "/about" },
    { name: "Research & Publications", href: "/research" },
    { name: "Events & Programs", href: "/events" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Special navigation item with different styling for donation button
  const donateLink = { name: "Donate", href: "/donate" };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <MPCLogo />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div
                  className={`font-medium cursor-pointer ${
                    location === link.href
                      ? "text-accent"
                      : "text-neutral-800 hover:text-accent transition"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>

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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-2 px-4 mt-2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div
                  className={`block py-2 cursor-pointer ${
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
            <Link href="/newsletter">
              <div
                className="block py-2 text-secondary hover:text-yellow-600 transition flex items-center gap-2 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail size={16} />
                <span>Subscribe to Newsletter</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
