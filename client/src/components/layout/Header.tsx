import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
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
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center">
              <MPCLogo />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <a
                  className={`font-medium ${
                    location === link.href
                      ? "text-accent"
                      : "text-neutral-800 hover:text-accent transition"
                  }`}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Subscribe Button */}
          <Button
            className="hidden md:block bg-secondary hover:bg-yellow-400 text-secondary-foreground"
          >
            Subscribe
          </Button>

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
                <a
                  className={`block py-2 ${
                    location === link.href
                      ? "text-accent"
                      : "text-foreground hover:text-accent transition"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </Link>
            ))}
            <Link href="#">
              <a
                className="block py-2 text-secondary hover:text-yellow-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
