import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import { Button } from "./ui/button";

interface ImageEditorProps {
	imageSrc: string;
	onCropComplete: (croppedImage: Blob) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
	imageSrc,
	onCropComplete,
}) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const onCropChange = (crop: { x: number; y: number }) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteHandler = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels); // Apenas armazena as coordenadas do corte
		},
		[],
	);

	const getCroppedImg = async (): Promise<void> => {
		if (!croppedAreaPixels) return;

		// Somente ao clicar no botão o corte será aplicado
		const croppedImage = await createImage(imageSrc, croppedAreaPixels);
		onCropComplete(croppedImage); // Envia a imagem recortada para o componente pai
	};

	const createImage = (
		imageSrc: string,
		croppedAreaPixels: Area,
	): Promise<Blob> => {
		return new Promise((resolve) => {
			const image = new Image();
			image.src = imageSrc;
			image.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) return;

				canvas.width = croppedAreaPixels.width;
				canvas.height = croppedAreaPixels.height;

				ctx.drawImage(
					image,
					croppedAreaPixels.x,
					croppedAreaPixels.y,
					croppedAreaPixels.width,
					croppedAreaPixels.height,
					0,
					0,
					croppedAreaPixels.width,
					croppedAreaPixels.height,
				);

				canvas.toBlob(
					(blob) => {
						if (blob) resolve(blob);
					},
					"image/png",
					1,
				);
			};
		});
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative w-full h-60">
				<Cropper
					image={imageSrc}
					crop={crop}
					zoom={zoom}
					aspect={1}
					onCropChange={onCropChange}
					onZoomChange={onZoomChange}
					onCropComplete={onCropCompleteHandler}
				/>
			</div>
			<div></div>
			<div>
				<button className="hidden"></button>{" "}
				<Button onClick={getCroppedImg}>Cortar imagem</Button>
			</div>
		</div>
	);
};

export default ImageEditor;
