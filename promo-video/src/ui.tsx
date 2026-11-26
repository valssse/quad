import React from 'react';
import {Easing, Img, staticFile} from 'remotion';
import icons from './icons.js';
import {C, FONT, tw} from './theme';

/* ---------- Ícono del set de Quad (Iconoir + Heroicons + propios) ---------- */
export const Icon: React.FC<{name: string; size: number; color?: string; sw?: number; style?: React.CSSProperties}> = ({
  name, size, color = 'currentColor', sw = 1.8, style,
}) => {
  const ic = (icons as any)[name];
  if (!ic) throw new Error('Ícono no encontrado: ' + name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={sw}
      style={{color, display: 'block', flexShrink: 0, ...style}}
      dangerouslySetInnerHTML={{__html: ic.body}} />
  );
};

export const StarFill: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={C.yellow} />
  </svg>
);

/* ---------- Texto que sube letra por letra ---------- */
export const RiseText: React.FC<{
  text: string; f: number; start: number; size: number;
  x?: number; y?: number; weight?: number; stagger?: number;
  color?: string; accentFrom?: number; accentTo?: number; accent?: string; ghost?: string;
  align?: 'left' | 'center'; width?: number; ls?: number; style?: React.CSSProperties;
}> = ({text, f, start, size, x = 0, y = 0, weight = 800, stagger = 1, color = C.t1, accentFrom = Infinity, accentTo = Infinity,
  accent = C.brand, ghost = C.t4, align = 'left', width, ls = -0.03, style}) => {
  const chars = [...text];
  return (
    <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: FONT,
      fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: `${ls}em`, whiteSpace: 'pre', ...style}}>
      {chars.map((ch, i) => {
        const t0 = start + i * stagger;
        const yy = tw(f, t0, t0 + 7, 0.5, 0);
        const o = tw(f, t0, t0 + 3, 0, 1, Easing.linear);
        const dark = tw(f, t0 + 3, t0 + 8, 0, 1, Easing.linear);
        const target = i >= accentFrom && i <= accentTo ? accent : color;
        return (
          <span key={i} style={{display: 'inline-block', opacity: o, transform: `translateY(${yy}em)`,
            color: dark >= 0.5 ? target : ghost}}>{ch}</span>
        );
      })}
    </div>
  );
};

/* ---------- Q de Quad (las dos piezas del logo) ---------- */
export const BIG_PIECE = 'M35.509 12.843V25.1545H29.1693V19.1816H19.1793V29.1671H25.1522V35.5113H12.8407V12.843H35.509Z';
/* Pieza pequeña: (29.1693, 29.167) → (39.1593, 39.157) */
export const SMALL = {x: 29.1693, y: 29.167, s: 9.99};

export const Photo: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile('img/' + src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style}} />
);
