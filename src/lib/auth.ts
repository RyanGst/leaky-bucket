import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { bearer } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_URL!);
const db = client.db("woovi-challenge");

export const auth = betterAuth({
    plugins: [bearer()],
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
});