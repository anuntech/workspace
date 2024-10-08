"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getS3Image } from "@/libs/s3-client";
import {
  LoaderCircle,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ImageManager({ href }: { href: string }) {
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const MAX_ZOOM = 3;

  function handleImageLoad() {
    setLoading(false);
  }

  function rotateLeft() {
    setRotation(rotation - 90);
  }

  function rotateRight() {
    setRotation(rotation + 90);
  }

  function zoomIn() {
    setZoom((prevZoom: any) => Math.min(prevZoom + 0.4, MAX_ZOOM));
  }

  function zoomOut() {
    setZoom((prevZoom: any) => Math.max(prevZoom - 0.4, 1));
  }

  function handleWheel(event: any) {
    if (event.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Abrir visualização do comprovante"
        >
          image
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comprovante</DialogTitle>
          <DialogDescription>
            Aqui está o comprovante de pagamento que você solicitou.
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-col items-center justify-center gap-5">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircle className="size-8 animate-spin" />
            </div>
          )}
          <div
            className="max-h-[50vh] overflow-hidden rounded-lg hover:cursor-zoom-in"
            onWheel={handleWheel}
          >
            <Image
              className={`h-[50vh] rounded-lg object-contain`}
              src={getS3Image(href)}
              alt="Comprovante de pagamento"
              width={500}
              height={500}
              onLoad={handleImageLoad}
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <div className="space-x-2">
            <Button size="icon" variant="secondary" onClick={rotateLeft}>
              <RotateCcw className="size-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={rotateRight}>
              <RotateCw className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={zoomOut}
              disabled={zoom <= 1}
            >
              <ZoomOut className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
            >
              <ZoomIn className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
