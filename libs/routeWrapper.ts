import { errorHandler } from "@/middleware/errorHandler";

export function routeWrapper(handler: Function, route: string) {
	return async (request: Request, params?: any) => {
		try {
			return await handler(request, params);
		} catch (error) {
			return errorHandler(error, request, route);
		}
	};
}
