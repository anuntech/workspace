import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function base64ToBlob(base64Data: string, contentType = "") {
	const parts = base64Data.split(",");
	const byteString = atob(parts[1]);
	const mimeString = contentType || parts[0].match(/:(.*?);/)[1];

	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);

	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ab], { type: mimeString });
}
