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
import {
  LoaderCircle,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

export function ImageManager({ href }: { href: string }) {
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const lastPosition = useRef({ x: 0, y: 0 });

  const MAX_ZOOM = 3;

  function handleImageLoad() {
    setLoading(false);
  }

  function rotateLeft() {
    setRotation((prevRotation) => prevRotation - 90);
  }

  function rotateRight() {
    setRotation((prevRotation) => prevRotation + 90);
  }

  function zoomIn() {
    setZoom((prevZoom) => Math.min(prevZoom + 0.4, MAX_ZOOM));
  }

  function zoomOut() {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom - 0.4, 1);
      if (newZoom === 1) {
        setTranslateX(0);
        setTranslateY(0);
      }
      return newZoom;
    });
  }

  function handleWheel(event: React.WheelEvent) {
    event.preventDefault();
    if (event.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (zoom <= 1) return;
    event.preventDefault();
    setIsDragging(true);
    lastPosition.current = { x: event.clientX, y: event.clientY };
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (!isDragging) return;
    event.preventDefault();

    const deltaX = event.clientX - lastPosition.current.x;
    const deltaY = event.clientY - lastPosition.current.y;

    setTranslateX((prev) => prev + deltaX);
    setTranslateY((prev) => prev + deltaY);

    lastPosition.current = { x: event.clientX, y: event.clientY };
  }

  function handleMouseUp(event: React.MouseEvent) {
    if (!isDragging) return;
    event.preventDefault();
    setIsDragging(false);
  }

  function handleMouseLeave(event: React.MouseEvent) {
    if (!isDragging) return;
    event.preventDefault();
    setIsDragging(false);
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (zoom <= 1) return;
    if (event.touches.length === 1) {
      event.preventDefault();
      setIsDragging(true);
      lastPosition.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (!isDragging || event.touches.length !== 1) return;
    event.preventDefault();

    const deltaX = event.touches[0].clientX - lastPosition.current.x;
    const deltaY = event.touches[0].clientY - lastPosition.current.y;

    setTranslateX((prev) => prev + deltaX);
    setTranslateY((prev) => prev + deltaY);

    lastPosition.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (!isDragging) return;
    event.preventDefault();
    setIsDragging(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={href}
          alt="Image Preview"
          width={500}
          height={500}
          onLoad={handleImageLoad}
          className="cursor-pointer"
          draggable={false}
        />
      </DialogTrigger>
      <DialogContent
        className="flex flex-col items-center justify-center sm:max-w-[90vw] sm:max-h-[90vh] p-4"
        style={{ width: "auto", height: "auto" }}
      >
        <DialogHeader>
          <DialogTitle>Comprovante</DialogTitle>
          <DialogDescription>
            Aqui está o comprovante de pagamento que você solicitou.
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-col items-center justify-center gap-5">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div
            className="relative overflow-hidden rounded-lg"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              width: "100%",
              height: "auto",
              maxWidth: "80vw",
              maxHeight: "80vh",
            }}
          >
            <Image
              className="rounded-lg object-contain select-none touch-none"
              src={href}
              alt="Comprovante de pagamento"
              width={500}
              height={500}
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          </div>
          <div className="space-x-2">
            <Button size="icon" variant="secondary" onClick={rotateLeft}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={rotateRight}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={zoomOut}
              disabled={zoom <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
