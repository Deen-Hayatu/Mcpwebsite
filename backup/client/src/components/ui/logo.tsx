interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const MPCLogo = ({ size = "md" }: LogoProps) => {
  const fontSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  const starSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }[size];

  return (
    <div className="flex items-center relative">
      <span className={`text-primary font-bold ${fontSize}`}>M</span>
      <div className="relative">
        <span className={`text-secondary font-bold ${fontSize}`}>p</span>
        <svg 
          className={`${starSize} absolute -top-1 left-1/2 -translate-x-1/2`} 
          viewBox="0 0 24 24" 
          fill="black"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
        </svg>
      </div>
      <span className={`text-accent font-bold ${fontSize}`}>C</span>
    </div>
  );
};

export default MPCLogo;
