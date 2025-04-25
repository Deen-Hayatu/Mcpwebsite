import MPCLogo from "@/components/ui/logo";
import GhanaBar from "@/components/home/GhanaBar";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import { SocialShareBar } from "@/components/social";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-100 mt-8">
      <GhanaBar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-3">
              <MPCLogo size="md" showText={true} />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Driving Ghana's transformation through youth-led policy research
            </p>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Contact</h3>
              <p className="text-sm text-gray-600">info@mpcghana.org</p>
              <p className="text-sm text-gray-600">+233 123 456 789</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-primary">Home</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-primary">About Us</a></li>
              <li><a href="/research" className="text-gray-600 hover:text-primary">Research & Publications</a></li>
              <li><a href="/events" className="text-gray-600 hover:text-primary">Events & Programs</a></li>
              <li><a href="/get-involved" className="text-gray-600 hover:text-primary">Get Involved</a></li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/mpcghana" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://twitter.com/mpcghana" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/mpcghana" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div>
            <NewsletterSection variant="compact" />
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {year} Movement for Positive Change (MPC). All rights reserved.
            </p>
            <SocialShareBar className="mt-4 md:mt-0" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
