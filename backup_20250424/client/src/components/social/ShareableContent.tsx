import React from "react";
import SocialShare from "./SocialShare";

interface ShareableContentProps {
  title: string;
  description?: string;
  url?: string;
  sharePosition?: "top-right" | "bottom-right" | "bottom" | "top";
  shareVariant?: "button" | "inline" | "icon-only";
  children: React.ReactNode;
  className?: string;
}

const ShareableContent = ({
  title,
  description = "",
  url,
  sharePosition = "top-right",
  shareVariant = "icon-only",
  children,
  className = "",
}: ShareableContentProps) => {
  // Position classes for the share button
  const positionClasses = {
    "top-right": "absolute top-4 right-4",
    "bottom-right": "absolute bottom-4 right-4",
    "bottom": "mt-4 flex justify-center",
    "top": "mb-4 flex justify-center",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Content */}
      {children}
      
      {/* Share component */}
      {(sharePosition === "top" || sharePosition === "bottom") ? (
        <div className={positionClasses[sharePosition]}>
          <SocialShare
            title={title}
            description={description}
            url={url}
            variant={shareVariant}
          />
        </div>
      ) : (
        <div className={positionClasses[sharePosition]}>
          <SocialShare
            title={title}
            description={description}
            url={url}
            variant={shareVariant}
          />
        </div>
      )}
    </div>
  );
};

export default ShareableContent;