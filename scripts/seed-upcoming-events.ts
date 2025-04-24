import { db } from "../server/db";
import { events, insertEventSchema } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedUpcomingEvents() {
  console.log("Seeding upcoming events...");

  const upcomingEvents = [
    {
      title: "Ghana Policy Forum 2025",
      date: "2025-06-15",
      location: "Accra International Conference Center",
      time: "9:00 AM - 5:00 PM",
      description: "Join us for a three-day conference bringing together policy experts, researchers, and government officials to discuss key issues facing Ghana today."
    },
    {
      title: "Youth Leadership Workshop",
      date: "2025-07-05",
      location: "MPC Campus, East Legon",
      time: "10:00 AM - 3:00 PM",
      description: "A workshop designed to equip young Ghanaians with leadership skills and policy knowledge to become future leaders."
    },
    {
      title: "Policy Research Symposium",
      date: "2025-05-20",
      location: "University of Ghana",
      time: "9:00 AM - 4:00 PM",
      description: "Annual research symposium featuring presentations from leading policy researchers working on Ghana-related topics."
    },
    {
      title: "Community Development Workshop",
      date: "2025-08-12",
      location: "Cape Coast Community Center",
      time: "10:00 AM - 2:00 PM",
      description: "Workshop focused on empowering community leaders with policy advocacy skills for local development."
    },
    {
      title: "Environmental Policy Summit",
      date: "2025-09-25",
      location: "Kumasi Technical University",
      time: "9:30 AM - 4:30 PM",
      description: "A gathering of environmental policy experts, activists, and officials to discuss sustainable development strategies for Ghana."
    }
  ];

  try {
    // Insert events one by one
    for (const eventData of upcomingEvents) {
      const validatedEvent = insertEventSchema.parse(eventData);
      try {
        // Check if an event with the same title already exists
        const existingEvents = await db.select().from(events).where(eq(events.title, eventData.title));
        
        if (existingEvents.length === 0) {
          const result = await db.insert(events).values(validatedEvent).returning();
          console.log(`Created event: ${result[0].title}`);
        } else {
          console.log(`Event "${eventData.title}" already exists, skipping`);
        }
      } catch (error) {
        console.error(`Error inserting event "${eventData.title}":`, error);
      }
    }
    
    console.log("Upcoming events seeding completed");
  } catch (error) {
    console.error("Error seeding upcoming events:", error);
  } finally {
    process.exit();
  }
}

seedUpcomingEvents();