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
  // Validate on the backend as well for security purposes
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data provided!" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Something went wrong, please try again." };
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
    // Calling NextAuth signIn function
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        default:
          return { error: "Something went wrong, please try again." };
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
    return { error: "Email address is required!" };
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email." };
  }

  // Set unique token and expiry (1 hour)
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Current time + 1 hour

  try {
    // Clean up any old tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save the new token in the database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send the email
    await sendPasswordResetEmail(email, token);

    return {
      success:
        "Password reset email has been sent! Please check your inbox.",
    };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Something went wrong, please try again." };
  }
}

// Forgot Password - Set New Password
export async function setNewPassword(password: string, token: string) {
  if (!password || !token) {
    return { error: "Incomplete data provided!" };
  }

  // 1. Check if token exists in the database
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return { error: "This link is invalid or has expired!" };
  }

  // 2. Check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "This link has expired. Please request a new one." };
  }

  // 3. Find the user
  const user = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!user) {
    return { error: "No user found for this email!" };
  }

  // 4. Hash new password and save it
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 5. Delete the old token so it cannot be reused
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Password successfully updated!" };
  } catch (error) {
    console.error("Set Password Error:", error);
    return { error: "Something went wrong, please try again." };
  }
}