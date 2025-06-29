import { describe, expect, it } from "bun:test";
import { app } from "../..";

describe("health module", () => {
	it("should return healthy response", async () => {
		const response = await app
			.handle(new Request("http://localhost/health"))
			.then((res) => res.json());
		expect(response.status).toBe("OK");
		expect(typeof response.version).toBe("string");
		expect(response.timestamp).toBeDefined();
	});
});
