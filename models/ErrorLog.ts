import mongoose from "mongoose";

const ErrorLogSchema = new mongoose.Schema(
	{
		route: { type: String, required: true },
		method: { type: String, required: true },
		error: { type: String, required: true },
		stack: { type: String },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
		requestBody: { type: Object },
		queryParams: { type: Object },
		errorType: { type: String, required: true },
		statusCode: { type: Number, required: true },
		headers: { type: Object },
		expiresAt: { type: Date, expires: "120d" },
	},
	{ timestamps: true },
);

export default mongoose.models?.ErrorLog ||
	mongoose.model("ErrorLog", ErrorLogSchema);
