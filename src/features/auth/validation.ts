import { z } from "zod/v4";

export const emailSchema = z.strictObject({
    email: z.email({ error: "Invalid email address" }),
});

export const passwordSchema = z.strictObject({
    password: z
        .string()
        .min(8, { error: "Password must contain 8 characters" })
        .max(50, { error: "Password must not exceed 50 characters" }),
});

export const confirmPasswordSchema = z.strictObject({
    confirmPassword: z
        .string()
        .min(8, { error: "Confirm password must contain 8 characters" })
        .max(50, { error: "Confirm password must not exceed 50 characters" }),
});

export const forgotPasswordSchema = z.strictObject({
    email: emailSchema.shape.email,
});

export const resetPasswordSchema = z
    .strictObject({
        token: z.string().min(1, { error: "Token is required" }),
        newPassword: passwordSchema.shape.password,
        confirmPassword: confirmPasswordSchema.shape.confirmPassword,
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
        if (newPassword !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Password not matched!",
            });
        }
    });

export const signInSchema = z.strictObject({
    email: emailSchema.shape.email,
    password: passwordSchema.shape.password,
    rememberMe: z.boolean().default(false).optional(),
});

export const signUpSchema = z
    .strictObject({
        name: z
            .string()
            .min(3, { error: "Name must contain 3 characters" })
            .max(50, { error: "Name must not exceed 50 characters" }),
        email: emailSchema.shape.email,
        password: passwordSchema.shape.password,
        confirmPassword: confirmPasswordSchema.shape.confirmPassword,
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Password not matched!",
            });
        }
    });

export const twoFactorOTPSchema = z.strictObject({
    code: z.string().regex(/^\d{6}$/, { error: "Two-factor must be 6 digits" }),
    trustDevice: z.boolean().default(false).optional(),
});

export const twoFactorTOTPSchema = z.strictObject({
    code: twoFactorOTPSchema.shape.code,
    trustDevice: twoFactorOTPSchema.shape.trustDevice,
});

export const recoveryCodeSchema = z.strictObject({
    code: z
        .string()
        .length(10, { error: "Recovery code must be 10 characters" }),
    trustDevice: twoFactorOTPSchema.shape.trustDevice,
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type ConfirmPasswordSchema = z.infer<typeof confirmPasswordSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type TwoFactorOTPSchema = z.infer<typeof twoFactorOTPSchema>;
export type TwoFactorTOTPSchema = z.infer<typeof twoFactorTOTPSchema>;
export type RecoveryCodeSchema = z.infer<typeof recoveryCodeSchema>;
