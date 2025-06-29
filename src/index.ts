import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { OpenAPI } from "./lib/open-api";
import { userMiddleware } from "./middleware/user-middleware";
import { health } from "./modules/health/health.index";
import { pixQuery } from "./modules/pix-query/pix-query.index";

export const app = new Elysia()
	.use(
		swagger({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(health)
	.use(
		cors({
			origin: process.env.BETTER_AUTH_URL!,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(userMiddleware)
	.get("/", ({ user }) => `Hello ${user.name}!`, { auth: true })
	.use(pixQuery)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
