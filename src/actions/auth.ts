"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
} from "@/lib/schemas";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

const prisma = new PrismaClient();

// Register
export async function registerUser(data: RegisterInput) {
  // Backend par bhi validate karein (Security ke liye zaroori hai)
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data provided!" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Is email se account pehle se mojood hai!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error); // Yeh line add kar dein
    return { error: "Kuch galat ho gaya, dobara try karein." };
  }
}

// Login
export async function loginUser(data: LoginInput) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data provided!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // NextAuth ka signIn function call kar rahe hain
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ya password galat hai!" };
        default:
          return { error: "Kuch galat ho gaya, dobara try karein." };
      }
    }
    throw error;
  }
}

// Logout
export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

// Forgot Password
export async function resetPasswordRequest(email: string) {
  if (!email) {
    return { error: "Email likhna zaroori hai!" };
  }

  // Check karein ke user mojood hai ya nahi
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Is email se koi account mojood nahi hai." };
  }

  // Unique Token aur Expiry (1 ghanta) set karein
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Current time + 1 hour

  try {
    // Agar is email ka koi purana token hai toh usay delete kar dein (Clean up)
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Naya token database mein save karein
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Email send karein
    await sendPasswordResetEmail(email, token);

    return {
      success:
        "Password reset email bhej di gayi hai! Apna inbox check karein.",
    };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Kuch galat ho gaya, dobara try karein." };
  }
}

// Forgot Password - Set New Password
export async function setNewPassword(password: string, token: string) {
  if (!password || !token) {
    return { error: "Data mukammal nahi hai!" }
  }

  // 1. Check karein ke token database mein hai?
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!existingToken) {
    return { error: "Yeh link galat hai ya expire ho chuka hai!" }
  }

  // 2. Check karein ke token expire toh nahi ho gaya?
  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { error: "Yeh link expire ho chuka hai. Naya link mangwayen." }
  }

  // 3. User ko dhundhein
  const user = await prisma.user.findUnique({
    where: { email: existingToken.email }
  })

  if (!user) {
    return { error: "Is email se koi user nahi mila!" }
  }

  // 4. Naya password encrypt (hash) karein aur save karein
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // 5. Purane token ko delete kar dein taake dobara use na ho sake
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    })

    return { success: "Password successfully update ho gaya hai!" }
  } catch (error) {
    console.error("Set Password Error:", error)
    return { error: "Kuch galat ho gaya, dobara try karein." }
  }
}
