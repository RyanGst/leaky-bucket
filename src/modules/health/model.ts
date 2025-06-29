// Model define the data structure and validation for the request and response
import { t } from "elysia";

export namespace HealthModel {
	export const health = t.Object({
		status: t.String(),
		version: t.String(),
		timestamp: t.String(),
	});

	export type health = typeof health.static;
}
