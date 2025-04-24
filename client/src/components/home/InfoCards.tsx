import { Building, Book, MapPin } from "lucide-react";

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const InfoCard = ({ title, description, icon }: InfoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-bold mb-3 text-foreground">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const InfoCards = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            title="Vision & Mission"
            description="To ignite an intellectual revolution that empowers Ghanaians to believe in and build a sovereign, industrialized, and culturally confident nation."
            icon={<Building className="w-10 h-10 text-primary" />}
          />
          <InfoCard
            title="Our Focus"
            description="Independent, culturally-rooted, and youth-led policy research, public education, and strategic advocacy focused on industrialization, education reform, and technology."
            icon={<Book className="w-10 h-10 text-secondary" />}
          />
          <InfoCard
            title="MPC Campus Tour"
            description="Join our nationwide campus tour starting May-June 2025, engaging with students across Ghana about intellectual revolution and policy innovation."
            icon={<MapPin className="w-10 h-10 text-accent" />}
          />
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
