import { db } from "../server/db";
import { policyBriefs } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateOpinionDate() {
  console.log("Updating opinion piece date to today...");
  
  try {
    const [updatedOpinion] = await db
      .update(policyBriefs)
      .set({ date: "January 31, 2025" })
      .where(eq(policyBriefs.id, 6))
      .returning();
    
    console.log("Date updated successfully:", updatedOpinion);
    console.log("New date:", updatedOpinion.date);
  } catch (error) {
    console.error("Error updating date:", error);
  } finally {
    process.exit(0);
  }
}

updateOpinionDate();