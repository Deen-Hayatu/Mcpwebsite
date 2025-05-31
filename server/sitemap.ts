import { storage } from "./storage";
import type { PolicyBrief } from "@shared/schema";

export async function generateSitemap(): Promise<string> {
  const baseUrl = "https://mpcghana.org";
  const currentDate = new Date().toISOString();
  
  // Get all policy briefs, research papers, and opinion pieces
  const policyBriefs = await storage.getPolicyBriefs();
  
  // Static pages
  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" }, // homepage
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/research", priority: "0.9", changefreq: "weekly" },
    { url: "/programs", priority: "0.8", changefreq: "monthly" },
    { url: "/events", priority: "0.7", changefreq: "weekly" },
    { url: "/team", priority: "0.6", changefreq: "monthly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
    { url: "/membership", priority: "0.7", changefreq: "monthly" },
    { url: "/donate", priority: "0.6", changefreq: "monthly" },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add dynamic content (research publications, opinions, etc.)
  policyBriefs.forEach((brief: PolicyBrief) => {
    const routeType = brief.type === 'opinion' ? 'opinion' : 'brief';
    const lastmod = currentDate; // Use current date as we don't have updatedAt field
    
    sitemap += `
  <url>
    <loc>${baseUrl}/research/${routeType}/${brief.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}