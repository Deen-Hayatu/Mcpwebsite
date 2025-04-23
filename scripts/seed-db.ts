import { db } from "../server/db";
import { policyBriefs, events, programs } from "../shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // Seed policy briefs
  const policyBriefsData = [
    {
      title: "Economic Recovery Post-COVID-19 in Ghana",
      date: "2023-10-15",
      excerpt: "Analysis of Ghana's economic recovery strategies and recommendations for sustainable growth.",
      content: "Ghana, like many other countries, has been significantly impacted by the COVID-19 pandemic. This policy brief examines the strategies implemented for economic recovery and offers evidence-based recommendations for sustainable growth in the post-pandemic era."
    },
    {
      title: "Infrastructure Development and Rural Connectivity",
      date: "2023-07-22",
      excerpt: "Assessing the state of rural infrastructure and proposing solutions for improved connectivity.",
      content: "Rural connectivity remains a challenge in Ghana, limiting access to essential services and economic opportunities. This policy brief evaluates the current state of infrastructure development in rural areas and proposes innovative solutions to enhance connectivity and foster inclusive growth."
    },
    {
      title: "Educational Reform for Digital Transformation",
      date: "2023-09-05",
      excerpt: "Strategies for adapting Ghana's education system to meet the demands of the digital age.",
      content: "As technology continues to transform the global landscape, Ghana's education system must adapt to prepare students for the digital future. This policy brief outlines key strategies for educational reform that prioritize digital literacy, critical thinking, and innovation."
    }
  ];
  
  // Seed events
  const eventsData = [
    {
      title: "Annual Policy Dialogue",
      date: "2023-11-25",
      location: "Accra International Conference Center",
      time: "9:00 AM - 4:00 PM",
      description: "Join policymakers, researchers, and civil society representatives for a day of insightful discussions on pressing policy issues affecting Ghana's development."
    },
    {
      title: "Youth Leadership Workshop",
      date: "2023-12-10",
      location: "University of Ghana, Legon",
      time: "10:00 AM - 2:00 PM",
      description: "A capacity-building workshop designed for young leaders interested in policy advocacy and community development."
    },
    {
      title: "Research Symposium: Climate Change and Agriculture",
      date: "2024-01-20",
      location: "CSIR-Science and Technology Policy Research Institute",
      time: "9:30 AM - 3:30 PM",
      description: "A platform for researchers and practitioners to share findings and insights on climate-resilient agricultural practices for Ghana."
    }
  ];
  
  // Seed programs
  const programsData = [
    {
      title: "Policy Fellowship Program",
      description: "A six-month fellowship program that provides emerging policy professionals with mentorship, training, and practical experience in policy analysis and advocacy."
    },
    {
      title: "Community Policy Labs",
      description: "An initiative that establishes grassroots policy development hubs in local communities, empowering citizens to participate in the policymaking process."
    },
    {
      title: "Policy Research Grant Program",
      description: "A competitive grant program that supports rigorous research on key policy challenges facing Ghana, with an emphasis on evidence-based solutions."
    }
  ];

  try {
    // Insert policy briefs
    console.log("Inserting policy briefs...");
    await db.insert(policyBriefs).values(policyBriefsData);
    
    // Insert events
    console.log("Inserting events...");
    await db.insert(events).values(eventsData);
    
    // Insert programs
    console.log("Inserting programs...");
    await db.insert(programs).values(programsData);
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();