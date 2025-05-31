import { Building, Book, MapPin } from "lucide-react";
import { 
  RevealOnScroll, 
  ButtonInteraction, 
  Pulse 
} from "@/components/ui/micro-interactions";

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const InfoCard = ({ title, description, icon, index }: InfoCardProps) => {
  return (
    <RevealOnScroll 
      direction={index % 2 === 0 ? "up" : "down"} 
      delay={0.2 * index}
      threshold={0.2}
    >
      <ButtonInteraction>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <Pulse scale={1.05} duration={2}>
            <div className="mb-4">{icon}</div>
          </Pulse>
          <h2 className="text-2xl font-bold mb-3 text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </ButtonInteraction>
    </RevealOnScroll>
  );
};

const InfoCards = () => {
  const infoCardsData = [
    {
      title: "Vision & Mission",
      description: "To ignite an intellectual revolution that empowers Ghanaians to believe in and build a sovereign, industrialized, and culturally confident nation.",
      icon: <Building className="w-10 h-10 text-primary" />
    },
    {
      title: "Our Focus",
      description: "Independent, culturally-rooted, and youth-led policy research, public education, and strategic advocacy focused on industrialization, education reform, and technology.",
      icon: <Book className="w-10 h-10 text-secondary" />
    },
    {
      title: "MPC Campus Tour",
      description: "Join our nationwide campus tour starting May-June 2025, engaging with students across Ghana about intellectual revolution and policy innovation.",
      icon: <MapPin className="w-10 h-10 text-accent" />
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoCardsData.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
