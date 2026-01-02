import { createApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import { securityService } from "./services/security";

// Main application initialization (long-lived servers only)
(async () => {
  const { app, server } = await createApp();

  // Setup Vite for development or static serving for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Never listen inside serverless (Vercel) environments.
  if (process.env.VERCEL === "1") {
    return;
  }

  // Replit expects port 5000; other hosts typically set PORT.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port} in ${app.get("env")} mode`);
    },
  );

  // Schedule security maintenance tasks (skip in serverless)
  const HOUR_MS = 60 * 60 * 1000;
  setInterval(() => {
    securityService
      .cleanupTokens()
      .catch((err) => console.error("Error cleaning up tokens:", err));

    securityService
      .cleanupSessions()
      .catch((err) => console.error("Error cleaning up sessions:", err));
  }, HOUR_MS);
})();
