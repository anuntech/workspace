"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageManager } from "./image-manager";
import { IApplications } from "@/models/Applications";
import { getS3Image } from "@/libs/s3-client";

export default function AppGalleryCarousel({
	application,
}: {
	application: IApplications;
}) {
	return (
		<Carousel
			opts={{
				align: "center",
			}}
			className="w-full max-w-[600px] max-h-[170px]"
		>
			<CarouselContent>
				{application.galleryPhotos.map((src, index) => (
					<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
						<div className="size-40">
							<ImageManager href={getS3Image(src)} />
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
