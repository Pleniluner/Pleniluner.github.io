"use client";

import { useEffect, useRef } from "react";
import { mountStarfield } from "@/lib/graphics/starfield.js";
import vertexSource from "@/lib/graphics/starfield.vert.glsl?raw";
import fragmentSource from "@/lib/graphics/starfield.frag.glsl?raw";

/** Static sky texture. The illustration underneath never moves. */
export function Starfield() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) return mountStarfield(canvas.current, vertexSource, fragmentSource);
  }, []);

  return <div className="station-starfield" aria-hidden="true"><canvas ref={canvas} /></div>;
}
