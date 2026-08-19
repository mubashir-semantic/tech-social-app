import { z } from "zod";

// Register
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Naam kam az kam 2 characters ka hona chahiye" }),
  email: z.string().email({ message: "Sahi email address darj karein" }),
  password: z
    .string()
    .min(6, { message: "Password kam az kam 6 characters ka hona chahiye" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email({ message: "Sahi email address darj karein" }),
  password: z.string().min(1, { message: "Password likhna zaroori hai" }),
})

export type LoginInput = z.infer<typeof loginSchema>
