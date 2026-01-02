import { generateSitemap } from "../server/sitemap";

export default async function handler(_req: any, res: any) {
  const xml = await generateSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cache at the edge for 1 hour; allow stale for 1 day
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}

