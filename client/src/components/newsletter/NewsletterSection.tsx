import React from "react";
import SubscriptionForm from "./SubscriptionForm";
import { Mail } from "lucide-react";

interface NewsletterSectionProps {
  className?: string;
  variant?: "default" | "compact";
}

const NewsletterSection = ({ 
  className = "", 
  variant = "default" 
}: NewsletterSectionProps) => {
  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Newsletter</h3>
        </div>
        <SubscriptionForm />
      </div>
    );
  }

  return (
    <section className={`py-12 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Stay Connected</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on our latest research,
            policy recommendations, and upcoming events focused on Ghana's development.
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <SubscriptionForm />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;