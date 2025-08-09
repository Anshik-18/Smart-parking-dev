import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const CredentialsSchema = z.object({
  phone: z.string().min(10, "Phone number too short"),
  password: z.string().min(4, "Password too short"),
  otp: z.string().length(6, "Invalid OTP").optional(),
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },

      async authorize(rawCredentials: any) {
        try {
          const credentials = CredentialsSchema.parse(rawCredentials);

          const existingUser = await db.user.findFirst({
            where: { number: credentials.phone },
          });

          if (existingUser) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );

            if (!isPasswordCorrect) return null;

            return {
              id: existingUser.id.toString(),
              email: existingUser.number,
            };
          }

          // Register new user
          const hashedPassword = await bcrypt.hash(credentials.password, 10);



          const newUser = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          });
          const merchant = await db.merchant.create({
            data: {
              name: "Default Merchant",
              number: credentials.phone,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id.toString(),
            email: newUser.number,
            merchantId: merchant.id.toString(),
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  // pages: { 
  //   signIn: "api/auth/signin", // 
  // },

  secret: process.env.JWT_SECRET || "secret",

callbacks: {
  async jwt({ token, user }:any) {
    if (user) {
      token.sub = user.id;
      token.merchantId = user.merchantId; 
    }
    return token;
  },
  async session({ token, session }:any) {
    session.user.id = token.sub;
    session.user.merchantId = token.merchantId;
    session.user.userType = "user";
    return session;
  },
},

};
