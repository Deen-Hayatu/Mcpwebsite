import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getVercelApp } from "../server/vercel";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getVercelApp();
  return app(req, res);
}

