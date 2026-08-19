import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // authorize function tab chalta hai jab user login button dabata hai
      async authorize(credentials) {
        // 1. Check karein ke email aur password enter kiya gaya hai ya nahi
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email aur password zaroori hai")
        }

        // 2. Database mein user ko uske email se dhondein
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        // 3. Agar user nahi mila ya usne password set nahi kiya hua
        if (!user || !user.password) {
          throw new Error("User nahi mila")
        }

        // 4. Entered password ko database ke hashed password se compare karein
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Galat password")
        }

        // 5. Sab theek hai toh user object return kar dein (Login successful)
        return user
      }
    })
  ],
})