import * as argon2 from "argon2";

if (!process.env.ARGON2_SECRET) throw new Error("ARGON2_SECRET is not set");

const options: argon2.HashOptions = {
    hashLength: 69,
    type: argon2.argon2id,
    memoryCost: 1024 * 60,
    secret: Buffer.from(process.env.ARGON2_SECRET, "utf-8")
};

export async function hash(password: string): Promise<string> {
    try {
        const hashed = await argon2.hash(password, options);
        return hashed;
    } catch (error) {
        throw new Error("failed to hash password: ", { cause: error });
    }
}

export async function verify(hash: string, password: string): Promise<boolean> {
    try {
        const isPasswordCorrect = await argon2.verify(hash, password, {
            secret: options.secret
        });
        return Boolean(isPasswordCorrect);
    } catch (error) {
        throw new Error("failed to verify password: ", { cause: error });
    }
}
