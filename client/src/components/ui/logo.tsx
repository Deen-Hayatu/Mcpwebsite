interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const MPCLogo = ({ size = "md" }: LogoProps) => {
  const fontSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  return (
    <div className="flex items-center">
      <span className={`text-primary font-bold ${fontSize}`}>M</span>
      <span className={`text-secondary font-bold ${fontSize}`}>p</span>
      <span className={`text-accent font-bold ${fontSize}`}>C</span>
    </div>
  );
};

export default MPCLogo;
