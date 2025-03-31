import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const response = NextResponse.next();

	// Configure os domínios permitidos
	response.headers.set(
		"Access-Control-Allow-Origin",
		"https://finance-company.anuntech.online",
	);
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS",
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	response.headers.set("Access-Control-Allow-Credentials", "true");

	return response;
}
