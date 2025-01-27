import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { sendInviteNotification } from "@/libs/notification";
import { sendInviteWorkspaceEmail } from "@/libs/workspace-invite";
import Notifications from "@/models/Notification";
import Plans from "@/models/Plans";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthorizationToInviteUser } from "./_utils/get-authorization-to-invite-user";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		await connectMongo();

		const { email, workspaceId } = await request.json();

		const worksPace = await Workspace.findById(workspaceId);

		if (!worksPace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					error: "Email inválido",
				},
				{ status: 404 }
			);
		}

		const isAuthorizedToInviteUser = getAuthorizationToInviteUser(worksPace, session)

		if (!isAuthorizedToInviteUser) {
			return NextResponse.json(
				{ error: "Você não possui permissão para convidar usuários" },
				{ status: 403 }
			);
		}

		const plan = await Plans.findOne({ name: worksPace.plan || "free" });

		if (worksPace.members.length >= plan.membersLimit) {
			return NextResponse.json(
				{ error: "This workspace is full" },
				{ status: 403 }
			);
		}

		if (worksPace.invitedMembersEmail.length >= 30) {
			return NextResponse.json(
				{ error: "O limite de convites foi atingido" },
				{ status: 403 }
			);
		}

		const sameEmail = await User.findById(session.user.id);
		if (sameEmail.email == email) {
			return NextResponse.json(
				{ error: "Você não pode convidar para o workspace a si mesmo" },
				{ status: 403 }
			);
		}
		const user = await User.findOne({ email });

		const alreadyIn = worksPace.members?.find(
			(member) => member.memberId.toString() === user?.id
		);

		const alreadyInvited = worksPace.invitedMembersEmail?.find(
			(invited) => invited.email === email
		);

		if (alreadyIn || alreadyInvited) {
			return NextResponse.json(
				{
					error: "Esse usuário já está no workspace ou já foi convidado",
				},
				{ status: 403 }
			);
		}

		await Workspace.findByIdAndUpdate(workspaceId, {
			$push: {
				invitedMembersEmail: { email, invitedAt: new Date() },
			},
		});

		if (user) {
			await Notifications.updateMany(
				{
					from: session.user.id,
					userId: user.id,
					workspaceId: worksPace.id,
					isInvite: true,
				},
				{
					state: "expired",
				}
			);
		}

		await sendInviteWorkspaceEmail(email, workspaceId, worksPace.name);
		if (user) {
			await sendInviteNotification(user.id, session.user.id, worksPace.id);
		}

		return NextResponse.json(user);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		await connectMongo();

		const { workspaceId, email } = await request.json();

		const worksPace = await Workspace.findById(workspaceId);

		if (!worksPace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		if (worksPace.owner.toString() !== session.user.id) {
			return NextResponse.json(
				{ error: "You do not have permission to remove this invite" },
				{ status: 403 }
			);
		}

		await Workspace.findByIdAndUpdate(workspaceId, {
			$pull: {
				invitedMembersEmail: { email },
			},
		});

		return NextResponse.json(worksPace);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
