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
				{ status: 404 }
			);
		}

		if (!body.membersId) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (!Array.isArray(body.membersId)) {
			return NextResponse.json(
				{ error: "MembersId is not an array" },
				{ status: 400 }
			);
		}

		const memberRole = workspace.members.find(
			(m) => m.memberId.toString() === session.user.id.toString()
		)?.role;

		if (
			memberRole !== "admin" &&
			workspace.owner.toString() !== session.user.id
		) {
			return NextResponse.json(
				{ error: "You do not have permission to add members" },
				{ status: 403 }
			);
		}

		for (const memberId of body.membersId) {
			const member = await User.findById(memberId);

			if (
				workspace.links
					.find((link) => link._id.toString() === body.linkId)
					?.membersAllowed.includes(memberId)
			) {
				return NextResponse.json(
					{ error: `Member ${member._id} already exists` },
					{ status: 400 }
				);
			}

			if (!member) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

			const link = workspace.links.find(
				(link) => link._id.toString() === body.linkId
			);

			if (!link.membersAllowed) link.membersAllowed = [];
			link.membersAllowed.push(member._id);
		}

		await workspace.save();

		return NextResponse.json({ message: "Member added successfully" });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		await connectMongo();
		const { searchParams } = new URL(request.url);
		const workspaceId = searchParams.get("workspaceId");

		if (!workspaceId) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		const linkId = searchParams.get("linkId");
		if (!linkId) {
			return NextResponse.json({ error: "Link not found" }, { status: 404 });
		}

		const workspace = await Workspace.findById(workspaceId);

		if (!workspace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		const memberRole = workspace.members.find(
			(m) => m.memberId.toString() === session.user.id.toString()
		)?.role;

		if (
			memberRole !== "admin" &&
			workspace.owner.toString() !== session.user.id
		) {
			return NextResponse.json(
				{ error: "You do not have permission to see this members" },
				{ status: 403 }
			);
		}

		const link = workspace.links.find((link) => link._id.toString() === linkId);

		if (!link) {
			return NextResponse.json({ error: "Link not found" }, { status: 404 });
		}

		const populatedMembers = await User.find({
			_id: { $in: link.membersAllowed },
		}).select("name email image icon");

		return NextResponse.json(populatedMembers);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
