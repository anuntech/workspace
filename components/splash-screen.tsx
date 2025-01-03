"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        onEnded={handleVideoEnd}
        className="w-1/2 h-1/2 object-cover"
      />
      {/* Botão de pular se desejar */}
      {/*
      <button
        onClick={onFinish}
        className="absolute top-4 right-4 text-white z-50"
      >
        Pular
      </button>
      */}
    </div>
  );
}
