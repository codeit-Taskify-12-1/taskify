"use client";

import { useState, useEffect } from "react";

export default function useDevice() {
  const [device, setDevice] = useState("desktop"); 

  useEffect(() => {
    if (typeof window === "undefined") return; 

    const getDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width >= 768 && width < 1024) return "tablet";
      return "desktop";
    };

    setDevice(getDeviceType()); 

    const handleResize = () => setDevice(getDeviceType());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}
