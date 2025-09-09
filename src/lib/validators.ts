import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email("Please enter a valid email."),
    password: z.string().min(1, "Password field must not be empty."),
});

export const SignupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters."),
        email: z.email("Please enter a valid email."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number."
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

export const CapsulePageSchema = z.object({
    page: z.number().int().positive(),
    page_title: z.string().min(1).max(120),
    body: z.string().min(1),
});

export const CapsuleSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(500),
    pages: z.array(CapsulePageSchema).min(1),
});

export type CapsuleValidated = z.infer<typeof CapsuleSchema>;

export const CreateByUrlSchema = z.object({ url: z.string().url() });
