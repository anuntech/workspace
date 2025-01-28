import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
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
 *  {linkId: "62d1b9a0c9c4d9b1f0b0a1a2", position: 0},
 *  {linkId: "62d1b9a0c9c4d9b1f0b0a1a3", position: 1},
 *  {linkId: "62d1b9a0c9c4d9b1f0b0a1a4", position: 2}
 * ]
 *
 * */
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		await connectMongo();
		const body = await request.json();

		const workspace = await Workspace.findById(body.workspaceId);

		if (!workspace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 },
			);
		}

		if (!body.data || !Array.isArray(body.data)) {
			return NextResponse.json({ error: "Body is invalid" }, { status: 400 });
		}

		if (!workspace.links.length) {
			return NextResponse.json(
				{ error: "You do not have permission to set positions" },
				{ status: 403 },
			);
		}

		const memberRole = workspace.members.find(
			(member) => member.memberId.toString() === session.user.id.toString(),
		)?.role;

		if (
			memberRole !== "admin" &&
			workspace.owner.toString() !== session.user.id
		) {
			return NextResponse.json(
				{ error: "You do not have permission to uninstall this application" },
				{ status: 403 },
			);
		}

		if (body.data.length != workspace.links.length) {
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
			if (!app.linkId || app.position == undefined) {
				return NextResponse.json({ error: "Body is invalid" }, { status: 400 });
			}

			if (
				!workspace.links.some(
					(link) => link._id.toString() === app.linkId.toString(),
				)
			) {
				return NextResponse.json(
					{ error: "Application not found" },
					{ status: 400 },
				);
			}
		}

		const positionMap = body.data.reduce((acc: any, item: any) => {
			acc[item.linkId] = item.position;
			return acc;
		}, {});

		workspace.links.sort((a, b) => {
			return positionMap[a._id.toString()] - positionMap[b._id.toString()];
		});

		await workspace.save();

		return NextResponse.json({ message: "Positions set successfully" });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
