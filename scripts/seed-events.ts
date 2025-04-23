import { db } from "../server/db";
import { events } from "../shared/schema";

async function seedEvents() {
  try {
    console.log("Seeding events...");
    
    // Check if events already exist
    const existingEvents = await db.select().from(events);
    
    if (existingEvents.length > 0) {
      console.log(`Found ${existingEvents.length} existing events. Skipping seeding.`);
      return;
    }
    
    // Sample events
    const sampleEvents = [
      {
        title: "Ghana Policy Forum 2025",
        date: new Date("2025-06-15").toISOString(),
        time: "9:00 AM - 5:00 PM",
        location: "Accra International Conference Center",
        description: "Join us for a three-day conference bringing together policy experts, researchers, and government officials to discuss key issues facing Ghana today."
      },
      {
        title: "Youth Leadership Workshop",
        date: new Date("2025-07-05").toISOString(),
        time: "10:00 AM - 3:00 PM",
        location: "MPC Campus, East Legon",
        description: "A workshop designed to equip young Ghanaians with leadership skills and policy knowledge to become future leaders."
      },
      {
        title: "Economic Policy Roundtable",
        date: new Date("2025-05-20").toISOString(),
        time: "2:00 PM - 4:30 PM",
        location: "University of Ghana, Legon",
        description: "A discussion forum focusing on economic policies and their impact on national development."
      },
      {
        title: "Healthcare Policy Summit",
        date: new Date("2025-08-12").toISOString(),
        time: "9:30 AM - 4:00 PM",
        location: "Kempinski Hotel, Accra",
        description: "A summit bringing together healthcare professionals, policy makers, and researchers to discuss healthcare policy challenges and solutions."
      },
      {
        title: "Environmental Conservation Workshop",
        date: new Date("2025-09-18").toISOString(),
        time: "10:00 AM - 2:00 PM",
        location: "MPC Research Center",
        description: "A hands-on workshop focused on environmental conservation policies and sustainable practices."
      }
    ];
    
    // Insert events
    await db.insert(events).values(sampleEvents);
    
    console.log(`Successfully seeded ${sampleEvents.length} events.`);
  } catch (error) {
    console.error("Error seeding events:", error);
  }
}

// Run the seed function
seedEvents();