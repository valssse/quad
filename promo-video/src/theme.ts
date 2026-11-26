import {Easing, interpolate} from 'remotion';

/* Tokens de Quad (src/styles/tokens.css, tomados 1:1 del Figma "Quad App") */
export const C = {
  brand: '#2667ff',
  brandSoft: '#eaf0ff',
  brandSoft2: '#dce6ff',
  t1: '#0f172a',
  t2: '#334155',
  t3: '#64748b',
  t4: '#94a3b8',
  bg: '#f5f7fb',
  surface: '#ffffff',
  border: '#e6e8ee',
  yellow: '#f5b301',
};

export const FONT = 'PJS, "Plus Jakarta Sans", system-ui, sans-serif';

/* --ease-out de la app */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
/* Salida: acelera hacia arriba hasta el corte */
export const EASE_IN = Easing.bezier(0.6, 0, 0.9, 0.45);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Interpola de `from` a `to` entre los frames a y b. */
export const tw = (f: number, a: number, b: number, from: number, to: number, easing = EASE) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing});

/** Progreso 0→1 entre a y b. */
export const p = (f: number, a: number, b: number, easing = EASE) => tw(f, a, b, 0, 1, easing);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mezcla de dos colores hex. */
export const mix = (c1: string, c2: string, t: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = h(c1), b = h(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',')})`;
};

/**
 * Salida en ascenso: sube 180 px acelerando, con blur y fade al final.
 * Devuelve estilos para aplicar a un elemento.
 */
export const ascentOut = (f: number, start: number, dur = 8, dist = 200) => {
  const y = tw(f, start, start + dur, 0, -dist, EASE_IN);
  const o = tw(f, start + dur * 0.45, start + dur, 1, 0, Easing.linear);
  const b = tw(f, start + dur * 0.3, start + dur, 0, 10, Easing.linear);
  return {y, o, b};
};

/** Entrada en ascenso: llega desde abajo todavía en movimiento y frena. */
export const ascentIn = (f: number, start: number, dur = 11, dist = 140) => {
  const y = tw(f, start, start + dur, dist, 0);
  const o = tw(f, start, start + dur * 0.5, 0, 1, Easing.linear);
  const b = tw(f, start, start + dur * 0.6, 6, 0, Easing.linear);
  return {y, o, b};
};

/* Medición de texto (después de cargar la fuente) */
let ctx: CanvasRenderingContext2D | null = null;
export const textW = (t: string, size: number, weight = 800, ls = -0.03) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px PJS`;
  (ctx as any).letterSpacing = `${ls * size}px`;
  return ctx!.measureText(t).width;
};
