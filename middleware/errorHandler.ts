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

		const errorLog = new ErrorLog({
			route,
			method: request.method,
			error: error?.message || "Unknown error",
			stack: error?.stack,
			user: session?.user?.id,
			workspace: url.searchParams.get("workspaceId"),
			requestBody: request.body ? await request.json() : null,
			queryParams: Object.fromEntries(url.searchParams),
		});

		await errorLog.save();
	} catch (loggingError) {
		console.error("Failed to save error log:", loggingError);
	}

	return NextResponse.json(
		{ error: error?.message || "An unexpected error occurred" },
		{ status: 500 },
	);
}
