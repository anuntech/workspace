import Notifications from "@/models/Notification";
import User from "@/models/User";
import Workspace from "@/models/Workspace";

export const sendInviteNotification = async (
  userId: string,
  fromUserId: string,
  workspaceId: string
) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const fromUser = await User.findById(fromUserId);
  if (!fromUser) {
    throw new Error("User not found");
  }

  await Notifications.create({
    workspaceId,
    from: fromUser.id,
    userId,
    isInvite: true,
  });
};
