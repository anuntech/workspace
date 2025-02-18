import { NextResponse } from "next/server";
import ErrorLog from "@/models/ErrorLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function errorHandler(
	error: any,
	request: Request,
	route: string,
) {
	try {
		const session = await getServerSession(authOptions);
		const url = new URL(request.url);

		const errorDetails = {
			route,
			method: request.method,
			error: error?.message || "Unknown error",
			stack: error?.stack,
			user: session?.user?.id,
			workspace: url.searchParams.get("workspaceId"),
			requestBody: request.body ? await readRequestBody(request) : null,
			queryParams: Object.fromEntries(url.searchParams),
			timestamp: new Date(),
			errorType: error?.name || "Error",
			statusCode: error?.statusCode || 500,
			headers: Object.fromEntries(request.headers),
		};

		const errorLog = new ErrorLog(errorDetails);
		await errorLog.save();

		if (process.env.NODE_ENV === "development") {
			console.error("Error Details:", errorDetails);
		}
	} catch (loggingError) {
		console.error("Failed to save error log:", loggingError);
	}

	return NextResponse.json(
		{
			error: error?.message || "An unexpected error occurred",
			...(process.env.NODE_ENV === "development" && {
				stack: error?.stack,
				details: error?.details,
			}),
		},
		{
			status: error?.statusCode || 500,
			headers: {
				"Content-Type": "application/json",
				"X-Error-Type": error?.name || "InternalServerError",
			},
		},
	);
}

async function readRequestBody(request: Request): Promise<any> {
	try {
		const clonedRequest = request.clone();
		return await clonedRequest.json();
	} catch (error) {
		try {
			// Fallback to reading the body directly
			return await request.json();
		} catch (e) {
			console.error("Failed to read request body:", e);
			return null;
		}
	}
}
