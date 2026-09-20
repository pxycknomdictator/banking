import * as argon2 from "argon2";

class Passwords {
    private readonly hashOptions: argon2.HashOptions = {
        hashLength: 69,
        parallelism: 4,
        memoryCost: 1024 * 64,
        type: argon2.argon2id,
        secret: Buffer.from(process.env.ARGON2_SECRET as string, "hex")
    };

    public async hash(password: string): Promise<string> {
        try {
            const hashed = await argon2.hash(password, this.hashOptions);
            return hashed;
        } catch (error) {
            throw new Error("failed to hash password:", { cause: error });
        }
    }

    public async verify(hash: string, password: string): Promise<boolean> {
        try {
            const isCorrectPassword = await argon2.verify(hash, password, {
                secret: this.hashOptions.secret
            });
            return Boolean(isCorrectPassword);
        } catch (error) {
            throw new Error("failed to verify password:", { cause: error });
        }
    }
}

export const passwords = new Passwords();
