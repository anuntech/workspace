"use client";

import React from "react";

import Image from "next/image";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
	const handleVideoEnd = () => {
		setTimeout(() => {
			onFinish();
		}, 3000);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
			<Image
				src="/gif.gif"
				alt="Splash Screen"
				className="object-cover"
				width={500}
				height={500}
				onLoad={handleVideoEnd}
			/>
		</div>
	);
}
