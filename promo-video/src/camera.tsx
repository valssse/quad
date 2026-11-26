import React from 'react';
import {AbsoluteFill, Easing, useVideoConfig} from 'remotion';

/* =====================================================================
   Cámara virtual con desenfoque de movimiento.

   Cada escena vive en su propio "mundo" de 1920×1080. La cámara mira a
   un punto (x, y) con un zoom s; {x: 960, y: 540, s: 1} = encuadre neutro.
   Entre llaves la cámara viaja con una curva de velocidad (por defecto
   ease in-out) y el zoom se interpola en escala logarítmica para que
   acercarse y alejarse se sientan parejos.

   El desenfoque se calcula con la velocidad real de la cámara en
   pantalla: un paneo horizontal se desenfoca solo en X, uno vertical
   solo en Y, y un zoom rápido en ambos ejes.
   ===================================================================== */

export type Ease = (n: number) => number;
export type Key = {t: number; x: number; y: number; s: number; r?: number; rx?: number; ry?: number; e?: Ease};
export type Cam = {x: number; y: number; s: number; r: number; rx: number; ry: number};

export const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);     /* paneo con arranque y frenado suaves */
export const WHIP = Easing.bezier(0.7, 0, 0.2, 1);         /* latigazo: lento, muy rápido, lento */
export const GLIDE = Easing.bezier(0.45, 0, 0.2, 1);       /* sigue algo y se asienta */
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);         /* llega rápido y frena largo */
export const IN = Easing.bezier(0.7, 0, 0.95, 0.4);        /* acelera hasta el corte */

const full = (k: Key): Cam => ({x: k.x, y: k.y, s: k.s, r: k.r ?? 0, rx: k.rx ?? 0, ry: k.ry ?? 0});

export const camAt = (keys: Key[], f: number): Cam => {
  if (f <= keys[0].t) return full(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f < b.t) {
      const k = (b.e ?? SMOOTH)((f - a.t) / (b.t - a.t));
      const A = full(a), B = full(b);
      return {
        x: A.x + (B.x - A.x) * k,
        y: A.y + (B.y - A.y) * k,
        s: A.s * Math.pow(B.s / A.s, k),
        r: A.r + (B.r - A.r) * k,
        rx: A.rx + (B.rx - A.rx) * k,
        ry: A.ry + (B.ry - A.ry) * k,
      };
    }
  }
  return full(keys[keys.length - 1]);
};

/** Punto del mundo → pantalla (sin rotaciones). */
export const toScreen = (c: Cam, x: number, y: number, cx = 960, cy = 540) => ({x: cx + (x - c.x) * c.s, y: cy + (y - c.y) * c.s});
/** Punto de pantalla → mundo (sin rotaciones). */
export const toWorld = (c: Cam, x: number, y: number, cx = 960, cy = 540) => ({x: c.x + (x - cx) / c.s, y: c.y + (y - cy) / c.s});


export const Shot: React.FC<{
  f: number; id: string; keys: Key[]; opacity?: number; blurK?: number; children: React.ReactNode; extraBlur?: number;
}> = ({f, id, keys, opacity = 1, blurK = 0.32, children, extraBlur = 0}) => {
  const {width, height} = useVideoConfig();
  const c = camAt(keys, f);
  const c0 = camAt(keys, f - 1);
  const vx = (c.x - c0.x) * c.s, vy = (c.y - c0.y) * c.s;
  const vz = Math.abs(Math.log(c.s / c0.s)) * 700;
  /* curva: los movimientos lentos casi no se desenfocan, los latigazos sí */
  const curve = (v: number) => Math.max(0, v - 6) * blurK;
  const bx = Math.min(30, curve(Math.abs(vx)) + Math.max(0, vz - 4) * 0.12 + extraBlur);
  const by = Math.min(30, curve(Math.abs(vy)) + Math.max(0, vz - 4) * 0.12 + extraBlur);
  const on = bx > 0.4 || by > 0.4;
  if (opacity <= 0.001) return null;
  return (
    <>
      {on && (
        <svg style={{position: 'absolute', width: 0, height: 0}}>
          <filter id={`mb-${id}`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      <AbsoluteFill style={{opacity, filter: on ? `url(#mb-${id})` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0',
          transform: `translate(${width / 2}px, ${height / 2}px) perspective(2400px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotate(${c.r}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`}}>
          {children}
        </div>
      </AbsoluteFill>
    </>
  );
};
