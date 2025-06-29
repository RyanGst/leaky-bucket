import { auth } from "../lib/auth";

export async function createTestUser({ email = `test-${Math.random() * 1000}@test.com`, name = `test-${Math.random() * 1000}` }: { email?: string; name?: string; } = {}) {

    await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
            email,
            password: "password",
            name,
        },
    });

    const session = await auth.api.signInEmail({
        asResponse: true,
        body: {
            email,
            password: "password",
        },
    });

    return session;
}
