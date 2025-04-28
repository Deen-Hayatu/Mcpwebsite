import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";
import { hashData, verifyHash } from "./middleware/security";
import crypto from "crypto";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

/**
 * Setup authentication middleware and routes
 */
export function setupAuth(app: Express) {
  // Generate a strong session secret if not provided
  if (!process.env.SESSION_SECRET) {
    console.warn("Warning: SESSION_SECRET not set. Using auto-generated session secret.");
    process.env.SESSION_SECRET = crypto.randomBytes(64).toString('hex');
  }

  // Configure session settings
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'mpc_session', // Custom cookie name
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Require HTTPS in production
      sameSite: 'lax',
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get user from database
        const user = await storage.getUserByUsername(username);
        
        // User not found
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Password validation - using security utility
        const [storedHash, salt] = user.password.split(".");
        const isValid = verifyHash(password, storedHash, salt);
        
        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Configure serialization/deserialization
  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error("User not found"), null);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Register API routes
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      if (req.body.password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Hash password with secure method
      const { hash, salt } = hashData(req.body.password);
      const hashedPassword = `${hash}.${salt}`;

      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Log in the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return next(sessionErr);
        }
        res.clearCookie('mpc_session');
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Return user data without password
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Password reset request
  app.post("/api/request-password-reset", async (req, res, next) => {
    try {
      const { email } = req.body;
      
      // Check if email exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(200).json({ message: "If a user with this email exists, a password reset link has been sent." });
      }
      
      // Generate a secure token and store it with an expiry time
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
      
      // Store token in database
      await storage.storePasswordResetToken(user.id, resetToken, resetTokenExpiry);
      
      // Send email with reset link
      // NOTE: Implementation of sendPasswordResetEmail would depend on your email service
      // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
      // await sendPasswordResetEmail(email, resetLink);
      
      res.status(200).json({ message: "If a user with this email exists, a password reset link has been sent." });
    } catch (error) {
      next(error);
    }
  });

  // Password reset confirmation
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, email, newPassword } = req.body;
      
      // Validate password strength
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      
      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Verify token is valid and not expired
      const isValid = await storage.validatePasswordResetToken(user.id, token);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Hash the new password
      const { hash, salt } = hashData(newPassword);
      const hashedPassword = `${hash}.${salt}`;
      
      // Update user password
      await storage.updateUserPassword(user.id, hashedPassword);
      
      // Invalidate the token
      await storage.clearPasswordResetToken(user.id);
      
      res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
      next(error);
    }
  });
}