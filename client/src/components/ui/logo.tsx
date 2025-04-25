import mpcLogo from '@/assets/logo.png';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const MPCLogo = ({ size = "md", showText = true }: LogoProps) => {
  const logoSize = {
    sm: "h-10",
    md: "h-16",
    lg: "h-24",
  }[size];
  
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }[size];

  return (
    <div className="flex flex-col items-center">
      <img 
        src={mpcLogo} 
        alt="Movement for Positive Change Logo" 
        className={`${logoSize} drop-shadow-md transition-transform duration-300 hover:scale-105`}
      />
      {showText && (
        <span className={`text-primary font-bold mt-2 ${textSize} text-center`}>
          Movement for Positive Change
        </span>
      )}
    </div>
  );
};

export default MPCLogo;
