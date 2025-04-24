import mpcLogo from '@/assets/logo.png';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const MPCLogo = ({ size = "md", showText = true }: LogoProps) => {
  const logoSize = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
  }[size];
  
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }[size];

  return (
    <div className="flex flex-col items-center">
      <img 
        src={mpcLogo} 
        alt="Movement for Positive Change Logo" 
        className={`${logoSize}`}
      />
      {showText && (
        <span className={`text-primary font-medium mt-1 ${textSize}`}>
          Movement for Positive Change
        </span>
      )}
    </div>
  );
};

export default MPCLogo;
