// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export function generateEmailVerificationToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: 60*10 }); // 10 minutes
}

export function verifyEmailVerificationToken(token: string): { email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded !== 'object' || !('email' in decoded)) {
      throw new Error('Invalid token payload');
    }

    return decoded as { email: string };
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
