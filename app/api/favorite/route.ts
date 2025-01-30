import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import mongoose, { MongooseError } from "mongoose";
import { routeWrapper } from "@/libs/routeWrapper";

async function POSTHandler(req: NextRequest) {
	const body = await req.json();
	const session = await getServerSession(authOptions);

	// Verificar se o tipo é válido
	if (!["application", "link"].includes(body.type)) {
		return NextResponse.json(
			{ error: "Invalid type, must be 'application' or 'link'" },
			{ status: 400 },
		);
	}

	// Verificar se o application/link existe apenas quando for do tipo 'application'
	if (body.type === "application") {
		const application = await Applications.findById(body.applicationId);
		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		}
	}

	const workspace = await Workspace.findById(body.workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (body.type === "link") {
		const link = workspace.links.find(
			(link) => link._id.toString() === body.applicationId.toString(),
		);
		if (!link) {
			return NextResponse.json({ error: "Link not found" }, { status: 404 });
		}
	}

	if (
		workspace.owner.toString() != session.user.id &&
		!workspace.members.some(
			(m) => m.memberId.toString() === session.user.id.toString(),
		)
	) {
		return NextResponse.json(
			{ error: "You do not have permission to favorite this application" },
			{ status: 403 },
		);
	}

	await connectMongo();
	let myApplications = await MyApplications.findOne({
		workspaceId: new mongoose.Types.ObjectId(body.workspaceId),
	});

	if (!myApplications) {
		myApplications = await MyApplications.create({
			workspaceId: new mongoose.Types.ObjectId(body.workspaceId),
			favoriteApplications: [],
		});
	}

	const favoriteIndex = myApplications.favoriteApplications.findIndex(
		(a) =>
			a.applicationId.toString() === body.applicationId.toString() &&
			a.userId.toString() === session.user.id &&
			a.type === body.type,
	);

	if (favoriteIndex == -1) {
		myApplications?.favoriteApplications.push({
			userId: new mongoose.Types.ObjectId(session.user.id),
			applicationId: body.applicationId,
			type: body.type,
		});
		await myApplications.save();
		return NextResponse.json(myApplications);
	}

	myApplications.favoriteApplications.splice(favoriteIndex, 1);
	await myApplications.save();

	return NextResponse.json(myApplications);
}

export const POST = routeWrapper(POSTHandler, "/api/favorite");

async function GETHandler(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const workspaceId = searchParams.get("workspaceId");

	if (!workspaceId) {
		return NextResponse.json(
			{ error: "Workspace ID is required" },
			{ status: 400 },
		);
	}

	const session = await getServerSession(authOptions);
	if (!session || !session.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await connectMongo();

	const workspace = await Workspace.findById(workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const isOwner = workspace.owner.toString() === session.user.id.toString();
	const isMember = workspace.members.some(
		(m) => m.memberId.toString() === session.user.id.toString(),
	);

	if (!isOwner && !isMember) {
		return NextResponse.json(
			{
				error: "You do not have permission to view favorites in this workspace",
			},
			{ status: 403 },
		);
	}

	const myApplications = await MyApplications.findOne({
		workspaceId: new mongoose.Types.ObjectId(workspaceId),
	});

	if (!myApplications) {
		return NextResponse.json(
			{ error: "No applications found for this workspace" },
			{ status: 404 },
		);
	}

	let userFavorites = myApplications.favoriteApplications.filter(
		(fav) => fav.userId.toString() === session.user.id.toString(),
	);

	const memberRole = workspace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;

	const isNotAdminAndOwner =
		memberRole !== "admin" && workspace.owner.toString() !== session.user.id;

	if (isNotAdminAndOwner) {
		// This is the condition that allows the user to see only the applications that he has permission to see
		const applicationsIdsThatUserHasPermission =
			workspace.rules.allowedMemberApps
				.filter(
					(app) =>
						!!app.members.find((m) => m.memberId.toString() == session.user.id),
				)
				.map((app) => app.appId.toString());

		const linksIdsThatUserHasPermission = workspace.links
			.filter((link) =>
				link.membersAllowed.some((m) => m.toString() == session.user.id),
			)
			.map((link) => link._id.toString());

		userFavorites = userFavorites.filter(
			(app) =>
				applicationsIdsThatUserHasPermission.includes(
					app.applicationId._id.toString(),
				) ||
				linksIdsThatUserHasPermission.includes(app.applicationId.toString()),
		);
	}

	const favorites = await Promise.all(
		userFavorites.map(async (fav) => {
			if (fav.type === "link") {
				const link = workspace.links.find(
					(link) => link._id.toString() === fav.applicationId.toString(),
				);
				return {
					...link,
					name: link?.title,
					applicationUrlType: link?.urlType,
					applicationUrl: link?.url,
					fields: link?.fields,
					icon: link?.icon,
					type: "link",
					id: link?._id.toString(),
					_id: link?._id.toString(),
				};
			}

			return await Applications.findById(fav.applicationId);
		}),
	);

	return NextResponse.json({
		favorites: favorites.map((fav) => ({
			applicationId: fav,
		})),
	});
}

export const GET = routeWrapper(GETHandler, "/api/favorite");
