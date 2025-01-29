import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
<<<<<<< HEAD
import { routeWrapper } from "@/libs/routeWrapper";
=======
>>>>>>> 9a7a5aa55b92ddeca78e3e97e51eeddb7a578424
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 *
 * body example:
 * [
 *  {appId: "62d1b9a0c9c4d9b1f0b0a1a2", position: 0},
 *  {appId: "62d1b9a0c9c4d9b1f0b0a1a3", position: 1},
 *  {appId: "62d1b9a0c9c4d9b1f0b0a1a4", position: 2}
 * ]
 *
 * */

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const body = await request.json();

	const workspace = await Workspace.findById(body.workspaceId);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (!body.data || !Array.isArray(body.data)) {
		return NextResponse.json({ error: "Body is invalid" }, { status: 400 });
	}

	const myApplications = await MyApplications.findOne({
		workspaceId: body.workspaceId,
	});

	if (!myApplications) {
		return NextResponse.json(
			{ error: "You do not have permission to set positions" },
			{ status: 403 },
		);
	}

	if (
		body.data.length !=
		myApplications.favoriteApplications.filter(
			(a) => a.userId.toString() === session.user.id.toString(),
		).length
	) {
		return NextResponse.json({ error: "Body is invalid" }, { status: 400 });
	}

	const positions = body.data.map((app: any) => app.position);
	const sortedPositions = [...positions].sort((a, b) => a - b);
	const expectedPositions = Array.from(
		{ length: sortedPositions.length },
		(_, i) => i,
	);

	if (
		sortedPositions.length !== expectedPositions.length ||
		!sortedPositions.every((pos, index) => pos === expectedPositions[index])
	) {
		return NextResponse.json(
			{ error: "Positions must be sequential starting from 0" },
			{ status: 400 },
		);
	}

	for (const app of body.data) {
		if (!app.appId || app.position == undefined) {
			return NextResponse.json({ error: "Body is invalid" }, { status: 400 });
		}

		if (
			!myApplications.favoriteApplications.some(
				(favo) =>
					favo.applicationId.toString() === app.appId.toString() &&
					favo.userId.toString() === session.user.id.toString(),
			)
		) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 400 },
			);
		}
	}

	const positionMap = body.data.reduce((acc: any, item: any) => {
		acc[item.appId] = item.position;
		return acc;
	}, {});

	const userId = session.user.id.toString();

	// 1) Separe os favoritos do usuário logado dos favoritos dos outros usuários
	const favoritesOfCurrentUser = myApplications.favoriteApplications.filter(
		(item) => item.userId.toString() === userId,
	);
	const favoritesOfOthers = myApplications.favoriteApplications.filter(
		(item) => item.userId.toString() !== userId,
	);

	// 2) Reordene somente os favoritos do usuário logado
	favoritesOfCurrentUser.sort((a, b) => {
		return (
			positionMap[a.applicationId.toString()] -
			positionMap[b.applicationId.toString()]
		);
	});

	// 3) "Rejunte" tudo
	myApplications.favoriteApplications = [
		...favoritesOfCurrentUser,
		...favoritesOfOthers,
	];

	// 4) Salve

	await myApplications.save();

	return NextResponse.json(myApplications);
}

export const POST = routeWrapper(POSTHandler, "/api/favorite/set-positions");
