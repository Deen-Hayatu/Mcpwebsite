import React from "react";
import { Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "default" | "compact" | "icon-only";
}

const ShareButtons = ({
  title,
  description = "",
  url = window.location.href,
  className = "",
  variant = "default"
}: ShareButtonsProps) => {
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

  // Determine size based on variant
  const iconSize = variant === "compact" ? 16 : 18;
  const buttonSize = variant === "compact" ? "sm" : "default";
  
  // Define button classes based on variant
  const buttonClasses = variant === "icon-only" 
    ? "h-10 w-10 p-0" 
    : "flex items-center gap-2";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <TooltipProvider>
        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize}
              className={`bg-blue-600 hover:bg-blue-700 text-white border-none ${buttonClasses}`}
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")}
            >
              <Facebook size={iconSize} />
              {variant !== "icon-only" && "Facebook"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        {/* Twitter/X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize}
              className={`bg-black hover:bg-gray-800 text-white border-none ${buttonClasses}`}
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, "_blank")}
            >
              <Twitter size={iconSize} />
              {variant !== "icon-only" && "Twitter"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Twitter</TooltipContent>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize}
              className={`bg-blue-700 hover:bg-blue-800 text-white border-none ${buttonClasses}`}
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`, "_blank")}
            >
              <Linkedin size={iconSize} />
              {variant !== "icon-only" && "LinkedIn"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        {/* Email */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize}
              className={`bg-green-600 hover:bg-green-700 text-white border-none ${buttonClasses}`}
              onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`, "_blank")}
            >
              <Mail size={iconSize} />
              {variant !== "icon-only" && "Email"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share via Email</TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={buttonSize}
              className={`bg-gray-600 hover:bg-gray-700 text-white border-none ${buttonClasses}`}
              onClick={copyToClipboard}
            >
              <Link2 size={iconSize} />
              {variant !== "icon-only" && "Copy Link"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Link</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ShareButtons;