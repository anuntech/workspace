import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { routeWrapper } from "@/libs/routeWrapper";
import Applications from "@/models/Applications";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	const user = await User.findById(session.user.id);
	if (user.email.split("@")[1] !== config.domainName) {
		return NextResponse.json(
			{ error: "You have no permission" },
			{ status: 403 },
		);
	}

	await connectMongo();

	const formData = await request.formData();

	if (formData === null)
		return NextResponse.json({ error: "Data not found" }, { status: 404 });

	const name = formData.get("title");
	const applicationUrlType = formData.get("applicationUrlType");
	const applicationUrl = formData.get("applicationUrl");
	const id = formData.get("id");

	const newField = {
		key: name,
		value: applicationUrl,
		redirectType: applicationUrlType,
	};

	const application = await Applications.findByIdAndUpdate(
		id,
		{
			$push: {
				fields: newField,
			},
		},
		{
			new: true,
		},
	);

	if (application === null)
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);

	return NextResponse.json(application, {
		status: 200,
	});
}

export const POST = routeWrapper(
	POSTHandler,
	"/api/applications/edit/menu-main",
);

async function PUTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	const user = await User.findById(session.user.id);
	if (user.email.split("@")[1] !== config.domainName) {
		return NextResponse.json(
			{ error: "You have no permission" },
			{ status: 403 },
		);
	}

	await connectMongo();

	const formData = await request.formData();

	if (formData === null)
		return NextResponse.json({ error: "Data not found" }, { status: 404 });

	const name = formData.get("title");
	const applicationUrlType = formData.get("applicationUrlType");
	const applicationUrl =
		applicationUrlType === "none" ? "" : formData.get("applicationUrl");
	const id = formData.get("id");
	const fieldId = formData.get("fieldId");

	let application;

	console.log(fieldId);

	if (fieldId) {
		application = await Applications.findOneAndUpdate(
			{
				_id: id,
				"fields._id": fieldId,
			},
			{
				$set: {
					"fields.$.key": name,
					"fields.$.value": applicationUrl,
					"fields.$.redirectType": applicationUrlType,
				},
			},
			{
				new: true,
			},
		);
	}

	if (!fieldId) {
		application = await Applications.findByIdAndUpdate(
			id,
			{
				name,
				applicationUrl,
				applicationUrlType,
			},
			{
				new: true,
			},
		);
	}

	if (application === null)
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);

	return NextResponse.json(application, {
		status: 200,
	});
}

export const PUT = routeWrapper(PUTHandler, "/api/applications/edit/menu-main");

async function DELETEHandler(request: Request) {
	const session = await getServerSession(authOptions);

	const user = await User.findById(session.user.id);
	if (user.email.split("@")[1] !== config.domainName) {
		return NextResponse.json(
			{ error: "You have no permission" },
			{ status: 403 },
		);
	}

	await connectMongo();

	const formData = await request.formData();

	if (formData === null)
		return NextResponse.json({ error: "Data not found" }, { status: 404 });

	const id = formData.get("id");
	const fieldId = formData.get("fieldId");

	const application = await Applications.findOneAndUpdate(
		{
			_id: id,
			"fields._id": fieldId,
		},
		{
			$pull: {
				fields: {
					_id: fieldId,
				},
			},
		},
		{
			new: true,
		},
	);

	if (application === null)
		return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 },
		);

	return NextResponse.json(application, {
		status: 200,
	});
}

export const DELETE = routeWrapper(
	DELETEHandler,
	"/api/applications/edit/menu-main",
);
