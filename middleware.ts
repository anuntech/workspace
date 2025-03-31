import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

const corsOptions = {
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, X-Requested-With, Accept",
};

export const middleware = async (request: NextRequest) => {
	const cookieIsUpdated = request.cookies.get("cookie-is-updated");

	const response = NextResponse.next();

	if (!cookieIsUpdated || cookieIsUpdated.value !== "true") {
		const cookieName =
			process.env.NODE_ENV === "production"
				? "__Secure-next-auth.session-token"
				: "next-auth.session-token";
		const cookie = request.cookies.get(cookieName);

		if (cookie) {
			response.cookies.delete(cookieName);
			response.cookies.set("cookie-is-updated", "true");
		}
	}

	const origin = request.headers.get("origin") ?? "";
	const isAllowedOrigin = allowedOrigins.includes(origin);

	const isPreflight = request.method === "OPTIONS";

	if (isPreflight) {
		const preflightHeaders = {
			...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
			...corsOptions,
		};
		return NextResponse.json({}, { headers: preflightHeaders });
	}

	if (isAllowedOrigin) {
		response.headers.set("Access-Control-Allow-Origin", origin);
	}

	Object.entries(corsOptions).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	return response;
};

export const config = {
	matcher: [
		"/api/:path*",
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
