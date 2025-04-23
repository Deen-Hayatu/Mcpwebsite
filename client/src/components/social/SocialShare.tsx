import React from "react";
import { Share2 } from "lucide-react";
import ShareButtons from "./ShareButtons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "button" | "inline" | "icon-only";
  label?: string;
}

const SocialShare = ({
  title,
  description = "",
  url,
  className = "",
  variant = "button",
  label = "Share"
}: SocialShareProps) => {
  // For inline display, render the buttons directly
  if (variant === "inline") {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Share this page:</h4>
        <ShareButtons
          title={title}
          description={description}
          url={url}
          variant="icon-only"
        />
      </div>
    );
  }

  // For icon-only display
  if (variant === "icon-only") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${className}`}
            aria-label="Share this page"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Share this page</h4>
            <ShareButtons
              title={title}
              description={description}
              url={url}
              variant="icon-only"
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Default button view with popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
        >
          <Share2 className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Share this page</h4>
          <ShareButtons
            title={title}
            description={description}
            url={url}
            variant="compact"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;