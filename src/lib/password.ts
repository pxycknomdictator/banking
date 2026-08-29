import * as argon2 from "argon2";

class Passwords {
    private readonly options: argon2.HashOptions = {
        hashLength: 69,
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        parallelism: 4,
        secret: Buffer.from(process.env.ARGON2_SECRET as string, "hex"),
    };

    public async hash(password: string): Promise<string> {
        try {
            const hashed = await argon2.hash(password, this.options);
            return hashed;
        } catch (e) {
            throw new Error("failed to hash password: ", { cause: e });
        }
    }

    public async verify(hash: string, password: string): Promise<boolean> {
        try {
            const isPasswordCorrect = await argon2.verify(hash, password, {
                secret: this.options.secret,
            });
            return Boolean(isPasswordCorrect);
        } catch (e) {
            throw new Error("failed to verify password: ", { cause: e });
        }
    }
}

export const passwords = new Passwords();
