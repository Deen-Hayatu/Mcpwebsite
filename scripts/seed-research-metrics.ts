import { db } from "../server/db";
import { researchMetrics } from "../shared/schema";

async function seedResearchMetrics() {
  try {
    // First, clean up existing data
    await db.delete(researchMetrics);
    console.log("Existing research metrics deleted");
    
    // Seed with sample data
    const metrics = [
      // Citations metrics
      {
        name: "Academic Citations",
        category: "citations",
        value: 142,
        description: "Number of times MPC research has been cited in academic papers"
      },
      {
        name: "Policy Document Citations",
        category: "citations",
        value: 87,
        description: "Citations in government policy documents"
      },
      {
        name: "Media References",
        category: "citations",
        value: 215,
        description: "References to MPC research in mainstream media"
      },
      
      // Downloads metrics
      {
        name: "Policy Brief Downloads",
        category: "downloads",
        value: 3450,
        description: "Total downloads of policy briefs"
      },
      {
        name: "Research Paper Downloads",
        category: "downloads",
        value: 1872,
        description: "Total downloads of full research papers"
      },
      {
        name: "Data Set Downloads",
        category: "downloads",
        value: 726,
        description: "Downloads of published datasets"
      },
      
      // Funding metrics
      {
        name: "Research Grants",
        category: "funding",
        value: 750000,
        description: "Total research grant funding in GHS"
      },
      {
        name: "Corporate Sponsorships",
        category: "funding",
        value: 450000,
        description: "Corporate research sponsorships in GHS"
      },
      
      // Outreach metrics
      {
        name: "Event Attendees",
        category: "outreach",
        value: 1230,
        description: "Total attendees at MPC research events"
      },
      {
        name: "Policy Workshops",
        category: "outreach",
        value: 24,
        description: "Number of policy workshops conducted"
      },
      {
        name: "Stakeholder Meetings",
        category: "outreach",
        value: 45,
        description: "Meetings with government and industry stakeholders"
      },
      
      // International metrics
      {
        name: "International Collaborations",
        category: "international",
        value: 17,
        description: "Research collaborations with international organizations"
      },
      {
        name: "Global Research Partnerships",
        category: "international",
        value: 8,
        description: "Formal research partnerships with global institutions"
      }
    ];
    
    // Insert the metrics
    await db.insert(researchMetrics).values(metrics);
    
    console.log(`Successfully seeded ${metrics.length} research metrics`);
  } catch (error) {
    console.error("Error seeding research metrics:", error);
  } finally {
    process.exit(0);
  }
}

seedResearchMetrics();