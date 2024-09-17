import jwt from "jsonwebtoken";
import { sendEmail } from "./mailgun";

export async function sendInviteWorkspaceEmail(
  email: string,
  workspaceId: string
) {
  const tokenToJoin = generateInviteWorkspaceToken(email, workspaceId);

  await sendEmail({
    to: email,
    subject: "🎉 Você foi convidado para um workspace!",
    text: `Você foi convidado para o workspace ${name}`,
    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #eaeaea;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #333;">🚀 Convite para o Workspace</h2>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 10px;">
              <p style="font-size: 16px; color: #555;">Olá,</p>
              <p style="font-size: 16px; color: #555;">
                Você foi convidado para participar do workspace <strong style="color: #000;">${name}</strong>! Trabalhe com sua equipe em um ambiente colaborativo e eficiente.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/invite-workspace?token=${tokenToJoin}"
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 18px; border-radius: 5px;">
                  Aceitar Convite
                </a>
              </div>
              <p style="font-size: 14px; color: #777;">
                Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:
              </p>
              <p style="font-size: 14px; color: #777;">
                <a href="${process.env.NEXTAUTH_URL}/invite-workspace?token=${tokenToJoin}" style="color: #4CAF50;">${process.env.NEXTAUTH_URL}/invite-workspace?token=${tokenToJoin}</a>
              </p>
            </div>
            <div style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
              <p>Se você não estava esperando este e-mail, por favor, ignore-o.</p>
              <p>Equipe Anuntech</p>
            </div>
          </div>
        `,
  });
}

export function generateInviteWorkspaceToken(
  email: string,
  workspaceId: string
) {
  return jwt.sign({ email, workspaceId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyWorkspaceInviteToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
