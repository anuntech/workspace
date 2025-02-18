import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

	return response;
};

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
