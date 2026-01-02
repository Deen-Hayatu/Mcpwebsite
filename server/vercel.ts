import type { Express } from "express";
import { createApp } from "./app";

/**
 * Cache the Express app between warm invocations on Vercel.
 */
let appPromise: Promise<Express> | null = null;

export async function getVercelApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = createApp().then(({ app }) => app);
  }
  return appPromise;
}

