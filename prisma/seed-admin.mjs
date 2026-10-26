// Creates the default admin account (email/password login) if it doesn't exist yet.
// Safe to run on every start: an existing account only gets its role set to admin,
// its password is never overwritten.
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";

const email = (process.env.ADMIN_EMAIL || "greentouchtool@gmail.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "Greentouch001!!";
const name = process.env.ADMIN_NAME || "GreenTouch Admin";

const prisma = new PrismaClient();

try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        if (existingUser.role !== "admin") {
            await prisma.user.update({ where: { id: existingUser.id }, data: { role: "admin" } });
            console.log(`Admin account ${email} already exists, role set to admin`);
        } else {
            console.log(`Admin account ${email} already exists`);
        }
    } else {
        const now = new Date();
        const userId = randomUUID();

        // same shape Better Auth creates on email sign-up: a user plus a "credential" account holding the password hash
        await prisma.user.create({
            data: {
                id: userId,
                name,
                email,
                emailVerified: true,
                createdAt: now,
                updatedAt: now,
                position: "other",
                university: " ",
                specialization: " ",
                motivation: "other",
                role: "admin",
                accounts: {
                    create: {
                        id: randomUUID(),
                        accountId: userId,
                        providerId: "credential",
                        password: await hashPassword(password),
                        createdAt: now,
                        updatedAt: now,
                    },
                },
            },
        });
        console.log(`Admin account ${email} created`);
    }
} finally {
    await prisma.$disconnect();
}
