import {z} from "zod";

export const SignUpSchema = z.object({
    username: z.string().min(3, "Username is too short"),
    email: z.email("Invalid email address"),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const SignInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string() .min(6, "Password must be at least 6 characters long")
});

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn= z.infer<typeof SignInSchema>;
