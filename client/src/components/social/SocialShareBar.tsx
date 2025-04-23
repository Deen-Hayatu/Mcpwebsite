import React from "react";
import ShareButtons from "./ShareButtons";

interface SocialShareBarProps {
  title?: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
}

const SocialShareBar = ({
  title = "Mfantsefo Policy Center - Ghana's Premier Think Tank",
  description = "Discover the latest research, policy briefs, events and programs from the Mfantsefo Policy Center.",
  className = "",
  showLabel = true
}: SocialShareBarProps) => {
  return (
    <div className={`${className}`}>
      {showLabel && (
        <h4 className="text-sm font-medium mb-3">Share MPC:</h4>
      )}
      <ShareButtons
        title={title}
        description={description}
        variant="icon-only"
      />
    </div>
  );
};

export default SocialShareBar;