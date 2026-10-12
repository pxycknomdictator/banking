import * as z from "zod";

export const emailSchema = z.strictObject({
    email: z.email({ error: "Invalid email address" })
});

export const passwordSchema = z.strictObject({
    password: z
        .string()
        .min(8, { error: "Password must be 8 characters" })
        .max(50, { error: "Password must not exceed 50 characters" })
});

export const confirmPasswordSchema = z.strictObject({
    confirmPassword: z
        .string()
        .min(8, { error: "Confirm password must be 8 characters" })
        .max(50, { error: "Confirm password must not exceed 50 characters" })
});

export const signupSchema = z
    .strictObject({
        name: z
            .string()
            .min(3, { error: "Name must be 3 characters" })
            .max(50, { error: "Name must not exceed 50 characters" }),
        email: emailSchema.shape.email,
        password: passwordSchema.shape.password,
        confirmPassword: confirmPasswordSchema.shape.confirmPassword
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Password not matched",
                path: ["confirmPassword"]
            });
        }
    });

export const signinSchema = z.strictObject({
    email: emailSchema.shape.email,
    password: passwordSchema.shape.password,
    rememberMe: z.boolean().default(false).optional()
});

export const forgotPasswordSchema = z.strictObject({
    email: emailSchema.shape.email
});

export const resetPasswordSchema = z
    .strictObject({
        token: z.string().min(1, { error: "Token is required" }),
        newPassword: passwordSchema.shape.password,
        confirmPassword: confirmPasswordSchema.shape.confirmPassword
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
        if (newPassword !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Password not matched",
                path: ["confirmPassword"]
            });
        }
    });

export const twoFactorOTPSchema = z.strictObject({
    code: z
        .string()
        .length(6, { error: "OTP must be 6 digits" })
        .regex(/^\d{6}$/, { error: "OTP must contain only digits" }),
    trustDevice: z.boolean().optional()
});

export const twoFactorTOTPSchema = z.strictObject({
    code: z
        .string()
        .length(6, { error: "TOTP must be 6 digits" })
        .regex(/^\d{6}$/, { error: "TOTP must contain only digits" }),
    trustDevice: twoFactorOTPSchema.shape.trustDevice
});

export const twoFactorRecoveryCodeSchema = z.strictObject({
    code: z
        .string()
        .length(10, { error: "Recovery code must be 10 characters" }),
    trustDevice: twoFactorOTPSchema.shape.trustDevice
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type ConfirmPasswordSchema = z.infer<typeof confirmPasswordSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type TwoFactorOTPSchema = z.infer<typeof twoFactorOTPSchema>;
export type TwoFactorTOTPSchema = z.infer<typeof twoFactorTOTPSchema>;
export type TwoFactorRecoveryCodeSchema = z.infer<
    typeof twoFactorRecoveryCodeSchema
>;
