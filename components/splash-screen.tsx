"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
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
