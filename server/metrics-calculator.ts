import { db } from "./db";
import { 
  publications, 
  citations, 
  researchPartnerships, 
  impactMetrics, 
  researchMetrics,
  policyBriefs,
  events,
  eventRegistrations,
  membershipApplications,
  subscribers
} from "@shared/schema";
import { count, sum, sql, desc, eq, gte, and } from "drizzle-orm";

export interface DynamicMetric {
  id: number;
  name: string;
  category: string;
  value: number;
  description: string;
  trend?: number;
  icon: string;
  lastUpdated: Date;
}

export class MetricsCalculator {
  
  /**
   * Calculate total publications count
   */
  async calculatePublicationsCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(publications);
    return result[0]?.count || 0;
  }

  /**
   * Calculate total citation count across all publications
   */
  async calculateTotalCitations(): Promise<number> {
    const result = await db
      .select({ total: sum(publications.citationCount) })
      .from(publications);
    return Number(result[0]?.total || 0);
  }

  /**
   * Calculate policy citations (high-impact citations)
   */
  async calculatePolicyCitations(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(citations)
      .where(eq(citations.citationType, 'policy'));
    return result[0]?.count || 0;
  }

  /**
   * Calculate active research partnerships
   */
  async calculateActivePartnerships(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(researchPartnerships)
      .where(eq(researchPartnerships.status, 'active'));
    return result[0]?.count || 0;
  }

  /**
   * Calculate total downloads across all publications
   */
  async calculateTotalDownloads(): Promise<number> {
    const result = await db
      .select({ total: sum(publications.downloadCount) })
      .from(publications);
    return Number(result[0]?.total || 0);
  }

  /**
   * Calculate policy briefs count
   */
  async calculatePolicyBriefsCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(policyBriefs);
    return result[0]?.count || 0;
  }

  /**
   * Calculate events organized
   */
  async calculateEventsOrganized(): Promise<number> {
    const result = await db.select({ count: count() }).from(events);
    return result[0]?.count || 0;
  }

  /**
   * Calculate total event registrations
   */
  async calculateEventEngagements(): Promise<number> {
    const result = await db.select({ count: count() }).from(eventRegistrations);
    return result[0]?.count || 0;
  }

  /**
   * Calculate newsletter subscribers
   */
  async calculateNewsletterSubscribers(): Promise<number> {
    const result = await db.select({ count: count() }).from(subscribers);
    return result[0]?.count || 0;
  }

  /**
   * Calculate membership applications
   */
  async calculateMembershipApplications(): Promise<number> {
    const result = await db.select({ count: count() }).from(membershipApplications);
    return result[0]?.count || 0;
  }

  /**
   * Calculate h-index based on citations
   */
  async calculateHIndex(): Promise<number> {
    const citationCounts = await db
      .select({ citations: publications.citationCount })
      .from(publications)
      .orderBy(desc(publications.citationCount));

    let hIndex = 0;
    for (let i = 0; i < citationCounts.length; i++) {
      const citations = citationCounts[i].citations;
      if (citations >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }
    return hIndex;
  }

  /**
   * Calculate recent growth (last 30 days vs previous 30 days)
   */
  async calculateGrowthTrend(metricType: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    let recentCount = 0;
    let previousCount = 0;

    switch (metricType) {
      case 'publications':
        const recentPubs = await db
          .select({ count: count() })
          .from(publications)
          .where(gte(publications.createdAt, thirtyDaysAgo));
        
        const previousPubs = await db
          .select({ count: count() })
          .from(publications)
          .where(and(
            gte(publications.createdAt, sixtyDaysAgo),
            sql`${publications.createdAt} < ${thirtyDaysAgo}`
          ));
          
        recentCount = recentPubs[0]?.count || 0;
        previousCount = previousPubs[0]?.count || 0;
        break;

      case 'subscribers':
        const recentSubs = await db
          .select({ count: count() })
          .from(subscribers)
          .where(gte(subscribers.createdAt, thirtyDaysAgo));
        
        const previousSubs = await db
          .select({ count: count() })
          .from(subscribers)
          .where(and(
            gte(subscribers.createdAt, sixtyDaysAgo),
            sql`${subscribers.createdAt} < ${thirtyDaysAgo}`
          ));
          
        recentCount = recentSubs[0]?.count || 0;
        previousCount = previousSubs[0]?.count || 0;
        break;
    }

    if (previousCount === 0) return recentCount > 0 ? 100 : 0;
    return Math.round(((recentCount - previousCount) / previousCount) * 100);
  }

  /**
   * Generate all dynamic metrics
   */
  async generateDynamicMetrics(): Promise<DynamicMetric[]> {
    const [
      publicationsCount,
      totalCitations,
      policyCitations,
      activePartnerships,
      totalDownloads,
      policyBriefsCount,
      eventsOrganized,
      eventEngagements,
      newsletterSubscribers,
      membershipApps,
      hIndex
    ] = await Promise.all([
      this.calculatePublicationsCount(),
      this.calculateTotalCitations(),
      this.calculatePolicyCitations(),
      this.calculateActivePartnerships(),
      this.calculateTotalDownloads(),
      this.calculatePolicyBriefsCount(),
      this.calculateEventsOrganized(),
      this.calculateEventEngagements(),
      this.calculateNewsletterSubscribers(),
      this.calculateMembershipApplications(),
      this.calculateHIndex()
    ]);

    const metrics: DynamicMetric[] = [
      {
        id: 1,
        name: "Total Publications",
        category: "research",
        value: publicationsCount,
        description: "Research papers, policy briefs, and reports published",
        icon: "file-text",
        lastUpdated: new Date(),
        trend: await this.calculateGrowthTrend('publications')
      },
      {
        id: 2,
        name: "Academic Citations",
        category: "impact",
        value: totalCitations,
        description: "Total citations across all publications",
        icon: "quote",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 3,
        name: "Policy Citations",
        category: "impact",
        value: policyCitations,
        description: "Citations in government policies and official documents",
        icon: "award",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 4,
        name: "Research Partnerships",
        category: "collaboration",
        value: activePartnerships,
        description: "Active collaborations with institutions",
        icon: "users",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 5,
        name: "Total Downloads",
        category: "reach",
        value: totalDownloads,
        description: "Downloads across all publications",
        icon: "download",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 6,
        name: "Policy Briefs",
        category: "research",
        value: policyBriefsCount,
        description: "Policy briefs and recommendations published",
        icon: "file",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 7,
        name: "Events Organized",
        category: "outreach",
        value: eventsOrganized,
        description: "Forums, workshops, and conferences organized",
        icon: "calendar",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 8,
        name: "Event Participation",
        category: "engagement",
        value: eventEngagements,
        description: "Total participants across all events",
        icon: "users",
        lastUpdated: new Date(),
        trend: 0
      },
      {
        id: 9,
        name: "Newsletter Subscribers",
        category: "reach",
        value: newsletterSubscribers,
        description: "Active newsletter subscribers",
        icon: "mail",
        lastUpdated: new Date(),
        trend: await this.calculateGrowthTrend('subscribers')
      },
      {
        id: 10,
        name: "H-Index",
        category: "impact",
        value: hIndex,
        description: "Academic impact index based on citations",
        icon: "trending-up",
        lastUpdated: new Date(),
        trend: 0
      }
    ];

    return metrics;
  }

  /**
   * Update the researchMetrics table with current dynamic values
   */
  async updateStoredMetrics(): Promise<void> {
    const dynamicMetrics = await this.generateDynamicMetrics();
    
    // Clear existing metrics
    await db.delete(researchMetrics);
    
    // Insert updated metrics
    for (const metric of dynamicMetrics) {
      await db.insert(researchMetrics).values({
        name: metric.name,
        category: metric.category,
        value: metric.value,
        description: metric.description || ""
      });
    }
  }
}

export const metricsCalculator = new MetricsCalculator();