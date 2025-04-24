import React from "react";
import { Facebook, Twitter, Linkedin, Mail, Link2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface OneClickShareProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  showLabels?: boolean;
  platforms?: ("facebook" | "twitter" | "linkedin" | "email" | "whatsapp" | "copy")[];
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
}

const OneClickShare: React.FC<OneClickShareProps> = ({
  title,
  description = "",
  url = window.location.href,
  className = "",
  showLabels = false,
  platforms = ["facebook", "twitter", "linkedin", "whatsapp", "email", "copy"],
  size = "md",
  orientation = "horizontal"
}) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard.",
        variant: "destructive",
      });
    }
  };

  // Determine button and icon sizes
  const sizeMap = {
    sm: {
      iconSize: 16,
      buttonSize: "sm" as const,
      padding: "p-1.5",
      gap: "gap-1.5"
    },
    md: {
      iconSize: 18,
      buttonSize: "default" as const,
      padding: "p-2",
      gap: "gap-2"
    },
    lg: {
      iconSize: 22,
      buttonSize: "lg" as const,
      padding: "p-2.5",
      gap: "gap-2.5"
    }
  };

  const { iconSize, buttonSize, padding, gap } = sizeMap[size];
  
  // Container classes based on orientation
  const containerClasses = orientation === "vertical" 
    ? `flex flex-col ${gap}` 
    : `flex flex-wrap ${gap}`;

  // Button size classes
  const buttonClasses = showLabels 
    ? `flex items-center ${gap}` 
    : `${padding}`;
  
  const shareButtons = {
    facebook: {
      icon: <Facebook size={iconSize} />,
      label: "Facebook",
      tooltip: "Share on Facebook",
      bgColor: "bg-blue-600 hover:bg-blue-700",
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")
    },
    twitter: {
      icon: <Twitter size={iconSize} />,
      label: "Twitter",
      tooltip: "Share on Twitter",
      bgColor: "bg-black hover:bg-gray-800",
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, "_blank")
    },
    linkedin: {
      icon: <Linkedin size={iconSize} />,
      label: "LinkedIn",
      tooltip: "Share on LinkedIn",
      bgColor: "bg-blue-700 hover:bg-blue-800",
      onClick: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`, "_blank")
    },
    whatsapp: {
      icon: <MessageCircle size={iconSize} />,
      label: "WhatsApp",
      tooltip: "Share on WhatsApp",
      bgColor: "bg-green-500 hover:bg-green-600",
      onClick: () => window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, "_blank")
    },
    email: {
      icon: <Mail size={iconSize} />,
      label: "Email",
      tooltip: "Share via Email",
      bgColor: "bg-green-600 hover:bg-green-700",
      onClick: () => window.open(`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`, "_blank")
    },
    copy: {
      icon: <Link2 size={iconSize} />,
      label: "Copy Link",
      tooltip: "Copy Link",
      bgColor: "bg-gray-600 hover:bg-gray-700",
      onClick: copyToClipboard
    }
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <TooltipProvider>
        {platforms.map((platform) => {
          const button = shareButtons[platform];
          return (
            <Tooltip key={platform}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={buttonSize}
                  className={`${button.bgColor} text-white border-none ${buttonClasses}`}
                  onClick={button.onClick}
                  aria-label={button.tooltip}
                >
                  {button.icon}
                  {showLabels && button.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{button.tooltip}</TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default OneClickShare;