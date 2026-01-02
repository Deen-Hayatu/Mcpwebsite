import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";

// Get JWT secret from environment variable or generate one
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET not set. Using auto-generated secret.");
}

// Token expiration times
const DEFAULT_ACCESS_TOKEN_EXPIRES: jwt.SignOptions["expiresIn"] = "2h"; // 2 hours
const DEFAULT_REFRESH_TOKEN_EXPIRES: jwt.SignOptions["expiresIn"] = "7d"; // 7 days

// Promisify jwt methods
const signAsync = promisify<object, string, jwt.SignOptions, string>(jwt.sign);
const verifyAsync = promisify<string, string, jwt.VerifyOptions, jwt.JwtPayload>(jwt.verify);

/**
 * Generate JWT access token
 * @param payload Data to include in token
 * @param expiresIn Time until token expires
 * @returns Signed JWT token
 */
export async function generateAccessToken(
  payload: object,
  expiresIn: jwt.SignOptions["expiresIn"] = DEFAULT_ACCESS_TOKEN_EXPIRES
): Promise<string> {
  return await signAsync(payload, JWT_SECRET, {
    expiresIn,
    algorithm: "HS512", 
    issuer: "mpc-ghana-api",
    audience: "mpc-ghana-client",
    jwtid: crypto.randomBytes(16).toString("hex"),
  });
}

/**
 * Generate JWT refresh token
 * @param payload Data to include in token
 * @param expiresIn Time until token expires
 * @returns Signed JWT refresh token
 */
export async function generateRefreshToken(
  payload: object,
  expiresIn: jwt.SignOptions["expiresIn"] = DEFAULT_REFRESH_TOKEN_EXPIRES
): Promise<string> {
  // Include a random token ID to allow revocation
  const tokenId = crypto.randomBytes(32).toString("hex");
  
  return await signAsync(
    {
      ...payload,
      type: "refresh",
      tokenId,
    },
    JWT_SECRET,
    {
      expiresIn,
      algorithm: "HS512",
      issuer: "mpc-ghana-api",
      audience: "mpc-ghana-client",
      jwtid: tokenId,
    }
  );
}

/**
 * Verify JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<jwt.JwtPayload | null> {
  try {
    const payload = await verifyAsync(token, JWT_SECRET, {
      issuer: "mpc-ghana-api",
      audience: "mpc-ghana-client",
      algorithms: ["HS512"],
    });
    
    return payload;
  } catch (error) {
    // Token is invalid
    return null;
  }
}

/**
 * Generate token pair (access and refresh)
 * @param payload Data to include in tokens
 * @returns Object containing both tokens and their expiry
 */
export async function generateTokenPair(payload: object): Promise<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
}> {
  const now = Math.floor(Date.now() / 1000);
  const accessTokenExpires = now + 60 * 60 * 2; // 2 hours
  const refreshTokenExpires = now + 60 * 60 * 24 * 7; // 7 days
  
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
    refreshTokenExpires,
  };
}

/**
 * Extract token from authorization header
 * @param authHeader Authorization header value
 * @returns Token or null if not found/invalid
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  return authHeader.slice(7); // Remove "Bearer " prefix
}

/**
 * Decode JWT token without verification (for debugging)
 * @param token JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.decode(token);
    return payload as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}