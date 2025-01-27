import { Session } from "next-auth"

import { IWorkspace } from "@/models/Workspace";


export const getAuthorizationToInviteUser = (worksPace: IWorkspace, session: Session) => {
	const memberRole = worksPace.members.find(member => member.memberId.toString() === session.user.id)?.role

	if (!memberRole) {
		if (worksPace.owner.toString() === session.user.id) {
			return true
		}
	}

	if (memberRole === "admin") {
		return true
	}

	return false
}
