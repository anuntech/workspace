import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import { custom } from "openid-client";
import nodemailer from "nodemailer";

custom.setHttpOptionsDefaults({
	timeout: 20000,
});

interface NextAuthOptionsExtended extends NextAuthOptions {
	adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
	// Set any random key in .env.local
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			// Follow the "Login with Google" tutorial to get your credentials
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true,
			async profile(profile) {
				return {
					id: profile.sub,
					name: profile.given_name ? profile.given_name : profile.name,
					email: profile.email,
					image: profile.picture,
					createdAt: new Date(),
				};
			},
		}),
		// Follow the "Login with Email" tutorial to set up your email server
		// Requires a MongoDB database. Set MONOGODB_URI env variable.
		...(connectMongo
			? [
					EmailProvider({
						server: process.env.EMAIL_SERVER,
						from: config.mailgun.fromNoReply,
						async sendVerificationRequest({
							identifier: email,
							url,
							provider,
						}) {
							const { host } = new URL(url);
							const transport = nodemailer.createTransport(provider.server);
							await transport.sendMail({
								to: email,
								from: provider.from,
								subject: `Acesse sua conta na Anuntech`,
								text: `Acesse sua conta na Anuntech\n${url}\n\n`,
								html: `
                  <body style="background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
                    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                      <div style="text-align: center;">
                        <img src="https://anuntech.com.br/logo.png" alt="Anuntech" style="max-width: 200px; margin-bottom: 20px;" />
                      </div>
                      <h2 style="color: #000000; font-size: 24px; font-weight: bold;">Acesse sua conta na Anuntech</h2>
                      <p>Olá,</p>
                      <p>Recebemos uma solicitação para acessar sua conta na Anuntech. Clique no botão abaixo para entrar:</p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}" style="background-color: #000000; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Entrar na Anuntech</a>
                      </div>
                      <p>Se você não solicitou este acesso, por favor, ignore este e-mail.</p>
                      <p>Atenciosamente,<br />Equipe Anuntech</p>
                    </div>
                  </body>
                `,
							});
						},
					}),
				]
			: []),
	],
	// New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
	// Requires a MongoDB database. Set MONOGODB_URI env variable.
	// Learn more about the model type: https://next-auth.js.org/v3/adapters/models
	...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

	callbacks: {
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.sub;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
	},
	...(process.env.NODE_ENV === "production" && {
		cookies: {
			sessionToken: {
				name: `__Secure-next-auth.session-token`,
				options: {
					domain: `.${process.env.DOMAIN}`,
				},
			},
		},
	}),
	session: {
		strategy: "jwt",
	},
	theme: {
		colorScheme: config.colors.theme as "light" | "dark" | "auto",
		// Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
		// It will be used in the login flow to display your logo. If you don't add it, it will look faded.
		logo: `/anuntech-icon-black.png`,
	},
	pages: {
		signIn: "/auth/sign-in",
		newUser: "/onboarding/name",
		verifyRequest: "/auth/verify-request",
	},
};

export default NextAuth(authOptions);
