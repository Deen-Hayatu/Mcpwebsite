import { db } from "../server/db";
import { staffMembers } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateFawziyyaEducation() {
  try {
    console.log("Updating Fawziyya Issah's education format...");
    
    // Update the education entries with abbreviated format
    const result = await db.update(staffMembers)
      .set({
        education: ["BA, Integrated Development Studies - University for Development Studies", 
                  "MA, Development Studies - University of Bayreuth"]
      })
      .where(eq(staffMembers.id, 5)) // Fawziyya's ID from our query
      .returning();
    
    console.log("Update result:", result);
    console.log("Education format updated successfully!");
  } catch (error) {
    console.error("Error updating education format:", error);
  } finally {
    process.exit(0);
  }
}

updateFawziyyaEducation();
