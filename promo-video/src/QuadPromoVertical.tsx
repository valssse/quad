import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, EASE, EASE_IO, tw, p, lerp, mix, ascentIn, ascentOut, textW} from './theme';
import {Icon, StarFill, RiseText, Photo, BIG_PIECE, SMALL} from './ui';
import {Shot, Key, camAt, toWorld, toScreen, SMOOTH, WHIP, GLIDE, OUT, IN} from './camera';
import {ClutterItem, Pill, Visit, AccessCard, DocIcon, AcceptMorph, FlyingAvatar, HANDOFF, PIECE0, PIECE, DURATION} from './QuadPromo';

/* =====================================================================
   Quad · Video promocional v3 · VERTICAL (63 s · 1080×1920 · 30 fps)

   Mismos tiempos, voz, música y efectos que la versión horizontal
   (QuadPromo.tsx); cambia la composición de cada escena para el
   formato alto: frases en varias líneas, tarjetas en carrusel,
   tarjetas de correo apiladas y paneos verticales.
   ===================================================================== */

const CX = 540, CY = 960, W = 1080;
const spr = (f: number, t: number, damping = 11, stiffness = 210) =>
  spring({frame: f - t, fps: 30, config: {damping, stiffness, mass: 0.6}});
type Fx = {y: number; o: number; b: number};
const NONE: Fx = {y: 0, o: 1, b: 0};
const fx = (a: Fx, b: Fx = NONE): React.CSSProperties => ({
  transform: `translateY(${a.y + b.y}px)`, opacity: a.o * b.o, filter: a.b + b.b > 0.05 ? `blur(${a.b + b.b}px)` : undefined,
});
const DOT = 22, DOT_GAP = 10;

export const QuadPromoVertical: React.FC = () => {
  const f = useCurrentFrame();
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Cargando Plus Jakarta Sans'));
  useEffect(() => {
    Promise.all([400, 500, 800].map((w) =>
      new FontFace('PJS', `url(${staticFile(`fonts/pjs-${w}.woff2`)})`, {weight: String(w)}).load()
        .then((ff) => (document.fonts as any).add(ff)),
    )).then(() => { setReady(true); continueRender(handle); })
      .catch((e) => { console.error(e); setReady(true); continueRender(handle); });
  }, []);
  if (!ready) return null;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT, overflow: 'hidden'}}>
      {f < 196 && <Hook f={f} />}
      {f >= 178 && f < 326 && <Problem f={f} />}
      {f >= 308 && f < 500 && <Intro f={f} />}
      {f >= 492 && f < 756 && <Search f={f} />}
      {f >= 750 && f < 840 && <Detail f={f} />}
      {f >= 820 && f < 1012 && <Family f={f} />}
      {f >= 998 && f < 1176 && <Chat f={f} />}
      {f >= 1170 && f < 1456 && <Access f={f} />}
      {f >= 1436 && f < 1604 && <Safe f={f} />}
      {f >= 1598 && f < 1755 && <Sentence f={f} />}
      {f >= 1718 && <Finale f={f} />}
      <Audio src={staticFile('audio/music.wav')} />
      <Audio src={staticFile('audio/sfx.wav')} />
      <Audio src={staticFile('audio/voz.wav')} />
    </AbsoluteFill>
  );
};

/* ---------- 1 · Gancho ---------- */
const H_SIZE = 104, Q_SIZE = 88;
const A1_TOP = 700, A2_TOP = 822, Q1_TOP = 1010, Q2_TOP = 1150;
const LINE_A1 = 'Llegaste a estudiar', LINE_A2 = 'a la capital';
const Q1 = '¿Dónde vas a vivir?', Q2 = '¿Con quién?';
const Q1_AT = 90, Q2_AT = 146;

const Hook: React.FC<{f: number}> = ({f}) => {
  const w1a = textW(LINE_A1, H_SIZE), w2a = textW(LINE_A2, H_SIZE), w1 = textW(Q1, Q_SIZE), w2 = textW(Q2, Q_SIZE);
  const xA1 = CX - w1a / 2, xA2 = CX - (w2a + DOT_GAP + DOT) / 2, x1 = CX - w1 / 2, x2 = CX - (w2 + DOT_GAP + DOT) / 2;
  const perA = {x: xA2 + w2a + DOT_GAP, y: A2_TOP + H_SIZE * 0.83 - DOT};
  const per2 = {x: x2 + w2 + DOT_GAP + 6, y: Q2_TOP + Q_SIZE * 0.83 - DOT};
  const keys: Key[] = [
    {t: 0, x: CX, y: 820, s: 1.2},
    {t: 84, x: CX, y: 810, s: 1.04, e: OUT},
    {t: 106, x: CX, y: 930, s: 1.08, e: GLIDE},
    {t: 142, x: CX, y: 940, s: 1.05, e: Easing.linear},
    {t: 164, x: CX, y: 1040, s: 1.03, e: GLIDE},
    {t: 178, x: CX + 10, y: 1044, s: 1.02, e: Easing.linear},
    {t: 194, x: per2.x + DOT / 2, y: per2.y + DOT / 2, s: 2.8, e: IN},
  ];
  let dx = CX - DOT / 2, dy = CY - DOT / 2;
  for (const [a, b, to] of [[24, 46, perA], [Q2_AT + 6, Q2_AT + 20, per2]] as const) {
    const k = p(f, a, b, EASE_IO); dx = lerp(dx, to.x, k); dy = lerp(dy, to.y, k);
  }
  const hop = f >= Q2_AT + 6 && f < Q2_AT + 20 ? -60 * Math.sin(p(f, Q2_AT + 6, Q2_AT + 20, Easing.linear) * Math.PI) : 0;
  const breathe = f >= 168 ? 1 + 0.2 * Math.max(0, Math.sin((f - 168) / 15 * Math.PI)) : 1;
  const greyA = mix(C.t1, '#c3ccd9', p(f, Q1_AT, Q1_AT + 10)), grey1 = mix(C.t1, '#c3ccd9', p(f, Q2_AT, Q2_AT + 10));
  return (
    <Shot f={f} id="hook" keys={keys} opacity={1 - p(f, 184, 194, Easing.linear)}>
      <RiseText text={LINE_A1} f={f} start={18} stagger={0.55} size={H_SIZE} x={xA1} y={A1_TOP} color={greyA} />
      <RiseText text={LINE_A2} f={f} start={30} stagger={0.55} size={H_SIZE} x={xA2} y={A2_TOP} color={greyA} />
      <RiseText text={Q1} f={f} start={Q1_AT} stagger={0.4} size={Q_SIZE} x={x1} y={Q1_TOP} color={grey1} />
      <RiseText text={Q2} f={f} start={Q2_AT} stagger={0.5} size={Q_SIZE} x={x2} y={Q2_TOP} accentFrom={5} />
      <div style={{position: 'absolute', left: dx, top: dy + hop, width: DOT, height: DOT, borderRadius: 6, background: C.brand,
        transform: `scale(${spr(f, 0) * breathe})`}} />
    </Shot>
  );
};

/* ---------- 2 · El problema ---------- */
type Clip = {t: number; x: number; y: number; r: number; kind: 'pill' | 'bubble' | 'note'; text: string; sub?: string};
const CLUTTER: Clip[] = [
  {t: 194, x: 70, y: 330, r: -4, kind: 'pill', text: 'Cuartos en alquiler SS · 3,2 mil miembros'},
  {t: 201, x: 610, y: 200, r: 3, kind: 'bubble', text: '¿Sigue disponible?'},
  {t: 212, x: 40, y: 540, r: -6, kind: 'note', text: 'SE ALQUILA CUARTO', sub: '$200 + depósito · info al DM'},
  {t: 220, x: 620, y: 640, r: 5, kind: 'note', text: 'Solo señoritas', sub: 'Zona UCA · sin fotos'},
  {t: 229, x: 330, y: 1330, r: 2, kind: 'note', text: 'Cuarto amueblado', sub: 'Llamar después de las 6'},
  {t: 243, x: 560, y: 1580, r: -3, kind: 'bubble', text: '¿La foto es real?'},
  {t: 250, x: 60, y: 1660, r: 4, kind: 'bubble', text: '¿Me pasas la dirección?'},
  {t: 256, x: 420, y: 450, r: -2, kind: 'bubble', text: 'Visto'},
];
const TRUST_AT = 264, COLLAPSE = 298;

const Problem: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 178, x: CX, y: CY, s: 1.5},
    {t: 208, x: CX, y: CY, s: 1.0, r: -1.2, e: OUT},
    {t: 262, x: CX + 12, y: CY + 10, s: 1.04, r: 0.6, e: Easing.linear},
    {t: 298, x: CX, y: CY, s: 1.08, r: 0, e: SMOOTH},
    {t: 318, x: CX, y: CY, s: 0.86, e: IN},
  ];
  const doubt = p(f, TRUST_AT - 2, TRUST_AT + 12);
  const big2 = '¿en quién confiar?';
  const BS = 96;
  const wB = textW(big2, BS);
  return (
    <Shot f={f} id="problem" keys={keys} opacity={p(f, 180, 188, Easing.linear) * (1 - p(f, 316, 324, Easing.linear))}>
      {CLUTTER.map((c, i) => {
        if (f < c.t) return null;
        const s = spr(f, c.t, 10, 230);
        const inn = ascentIn(f, c.t, 10, 50);
        const drift = 8 * Math.sin((f + i * 30) / 26);
        const k = p(f, COLLAPSE + i * 0.6, COLLAPSE + 14 + i * 0.6, Easing.bezier(0.6, 0, 0.9, 0.5));
        const w = c.kind === 'note' ? 400 : textW(c.text, 28, 500, 0) + (c.kind === 'pill' ? 110 : 64);
        const cx = c.x + w / 2, cy = c.y + 60;
        return (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y + drift, width: w,
            transform: `translate(${lerp(0, CX - cx, k)}px, ${lerp(0, CY - cy, k) + inn.y}px) rotate(${c.r * (1 + doubt * 0.6)}deg) scale(${s * (1 - k)})`,
            opacity: inn.o * (1 - doubt * 0.62) * (1 - k * 0.5), filter: `blur(${inn.b + doubt * 5}px) grayscale(${doubt})`}}>
            <ClutterItem c={c} />
          </div>
        );
      })}
      {f >= TRUST_AT - 22 && (
        <div style={{position: 'absolute', inset: 0, ...fx(NONE, ascentOut(f, COLLAPSE, 9, 160))}}>
          <RiseText text="nunca sabes" f={f} start={TRUST_AT - 22} stagger={0.5} size={60} x={0} y={820} width={W} align="center" color={C.t3} />
          <RiseText text={big2} f={f} start={TRUST_AT} stagger={0.55} size={BS} x={CX - wB / 2} y={900} accentFrom={4} accentTo={8} />
        </div>
      )}
    </Shot>
  );
};

/* ---------- 3 · Conoce Quad ---------- */
const LK = 4.2, L_CY = 720, L_WS = 156;
const logoLayout = () => {
  const wW = textW('Quad', L_WS);
  const total = PIECE * LK + 44 + wW;
  const gx = CX - total / 2;
  return {ox: gx - PIECE0 * LK, oy: L_CY - 26 * LK, wordX: gx + PIECE * LK + 44, wordTop: L_CY - L_WS * 0.53};
};
const PEOPLE = [{img: 'sofia.jpg', at: 440}, {img: 'andrea.jpg', at: 447}, {img: 'carlos.jpg', at: 454}];
const INTRO_OUT = 480;

const Intro: React.FC<{f: number}> = ({f}) => {
  const L = logoLayout();
  const keys: Key[] = [
    {t: 308, x: CX, y: L_CY, s: 1.9},
    {t: 334, x: CX, y: L_CY, s: 1.75, e: Easing.linear},
    {t: 364, x: CX, y: 770, s: 1.14, e: OUT},
    {t: 370, x: CX, y: 782, s: 1.12, e: Easing.linear},
    {t: 394, x: CX, y: 900, s: 1.08, e: GLIDE},
    {t: 436, x: CX - 10, y: 912, s: 1.05, e: Easing.linear},
    {t: 458, x: CX - 20, y: 1000, s: 1.0, e: GLIDE},
    {t: 478, x: CX, y: CY, s: 1.0, e: SMOOTH},
  ];
  const sp = {x: L.ox + SMALL.x * LK, y: L.oy + SMALL.y * LK, s: SMALL.s * LK};
  const a = p(f, 336, 350, EASE_IO);
  let x = lerp(CX - DOT / 2, sp.x, a), y = lerp(L_CY - DOT / 2, sp.y, a), s = lerp(DOT, sp.s, a), r = lerp(6, 0, a);
  const b = p(f, INTRO_OUT + 4, 496, EASE_IO);
  x = lerp(x, CX - DOT / 2, b); y = lerp(y, CY - DOT / 2, b); s = lerp(s, DOT, b); r = lerp(r, 6, b);
  const bigIn = ascentIn(f, 349, 10, 90);
  const bigS = spr(f, 349, 9, 220);
  const out = (k: number) => ascentOut(f, INTRO_OUT + k, 8, 200);
  const l1 = 'Tu vivienda digna', l2 = 'para la U';
  return (
    <Shot f={f} id="intro" keys={keys} opacity={p(f, 310, 316, Easing.linear)}>
      {f >= 349 && (
        <div style={{position: 'absolute', inset: 0, ...fx(NONE, out(0))}}>
          <svg width={52 * LK} height={52 * LK} viewBox="0 0 52 52" style={{position: 'absolute', left: L.ox, top: L.oy, overflow: 'visible'}}>
            <g style={{transformOrigin: '24px 24px', transform: `translateY(${bigIn.y / LK}px) scale(${bigS})`, opacity: bigIn.o}}>
              <path d={BIG_PIECE} fill={C.brand} />
            </g>
          </svg>
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, ...fx(NONE, out(1))}}>
        <RiseText text="Quad" f={f} start={353} stagger={2.5} size={L_WS} x={L.wordX} y={L.wordTop} />
      </div>
      <div style={{position: 'absolute', inset: 0, ...fx(NONE, out(2))}}>
        <RiseText text={l1} f={f} start={370} stagger={0.45} size={84} x={CX - textW(l1, 84) / 2} y={880} accentFrom={12} accentTo={16} />
        <RiseText text={l2} f={f} start={392} stagger={0.45} size={84} x={CX - textW(l2, 84) / 2} y={980} />
      </div>
      {PEOPLE.map((pp, i) => {
        const cx = CX + (i - 1) * 180;
        if (f < pp.at) return null;
        const sc = spr(f, pp.at, 10, 230);
        const badge = spr(f, pp.at + 9, 9, 260);
        const e = out(3 + i);
        return (
          <div key={i} style={{position: 'absolute', left: cx - 70, top: 1130, width: 140, height: 140, opacity: e.o,
            filter: e.b ? `blur(${e.b}px)` : undefined, transform: `translateY(${e.y}px) scale(${sc})`}}>
            <div style={{width: 140, height: 140, borderRadius: 99, overflow: 'hidden', boxShadow: '0 12px 30px rgba(15,23,42,0.16)', background: '#dce6ff'}}>
              <Photo src={pp.img} />
            </div>
            <div style={{position: 'absolute', right: -6, bottom: -6, width: 52, height: 52, borderRadius: 99, background: C.brand,
              border: '4px solid #f5f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`}}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2}
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray={22} strokeDashoffset={22 * tw(f, pp.at + 11, pp.at + 19, 1, 0)} /></svg>
            </div>
          </div>
        );
      })}
      {f >= 452 && (
        <div style={{position: 'absolute', left: 0, width: W, top: 1320, textAlign: 'center', fontSize: 44, fontWeight: 800, color: C.t1,
          letterSpacing: '-0.02em', ...fx(ascentIn(f, 452, 10, 40), out(6))}}>
          Personas <span style={{color: C.brand}}>verificadas</span>
        </div>
      )}
      {f < 497 && (
        <div style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: r, background: C.brand,
          transform: `scale(${a > 0 ? 1 : spr(f, 312)})`}} />
      )}
    </Shot>
  );
};

/* ---------- 4 · Busca por zona ---------- */
const BAR = {x: 90, y: 912, w: 900, h: 96, r: 48};
const BAR_UP_Y = 300;
const ZONES = [
  {t: 'Antiguo Cuscatlán', type: 549, in: 567, sel: 570, del: 571},
  {t: 'La Sultana', type: 577, in: 588, sel: 591, del: 592},
  {t: 'Santa Tecla', type: 600, in: 612, sel: 615, del: Infinity},
];
const typedAt = (f: number) => {
  let out = '';
  for (const z of ZONES) {
    if (f < z.type) break;
    const n = Math.min(z.t.length, Math.floor(f - z.type) + 1);
    out = f >= z.del ? z.t.slice(0, Math.max(0, z.t.length - Math.floor((f - z.del) * 3.4))) : z.t.slice(0, n);
  }
  return out;
};
const CHIP_Y = 1050, CHIP_H = 72, CHIP_GAP = 16;
const chipW = (t: string) => textW(t, 27, 800, -0.01) + 34 + 10 + 50;
const chipX = (i: number) => {
  const ws = ZONES.map((z) => chipW(z.t));
  const total = ws.reduce((s, w) => s + w, 0) + CHIP_GAP * (ws.length - 1);
  return CX - total / 2 + ws.slice(0, i).reduce((s, w) => s + w + CHIP_GAP, 0);
};
const CARDS = [
  {img: 'habitacion-amplia.jpg', title: 'Habitación amplia', zona: 'Antiguo Cuscatlán', min: 9, icon: 'car-fill', uni: 'ESEN', price: 125, rating: '4.9', hl: 672},
  {img: 'cuarto-familia.jpg', title: 'Quad en casa de familia', zona: 'Jardines de Guadalupe', min: 4, icon: 'walking-fill', uni: 'UCA', price: 115, rating: '4.8', hl: 682},
  {img: 'bano-propio.jpg', title: 'Quad con baño propio', zona: 'Col. La Sultana', min: 15, icon: 'bus-fill', uni: 'USAM', price: 140, rating: '4.6', hl: 692},
];
/* carrusel: la tarjeta del centro completa y las de los lados asomándose */
const CARD_W = 540, CARD_H = 720, CARD_Y = 520, CARD_GAP = 40;
const cardX = (i: number) => CX - CARD_W / 2 + (i - 1) * (CARD_W + CARD_GAP);
const UP = 640, CARDS_IN = 648, EXPAND = 735, EXPANDED = 752;
const HERO = {x: 96, y: 170, w: 888, h: 840, r: 44};

const Search: React.FC<{f: number}> = ({f}) => {
  const cc = (i: number) => cardX(i) + CARD_W / 2;
  const keys: Key[] = [
    {t: 492, x: CX, y: CY, s: 1},
    {t: 512, x: CX, y: CY, s: 1},
    {t: 540, x: 330, y: 962, s: 1.5, e: SMOOTH},
    {t: 549, x: 334, y: 962, s: 1.5},
    {t: 569, x: 520, y: 966, s: 1.5, e: GLIDE},
    {t: 578, x: 350, y: 966, s: 1.5, e: SMOOTH},
    {t: 592, x: 450, y: 966, s: 1.5, e: GLIDE},
    {t: 601, x: 350, y: 966, s: 1.5, e: SMOOTH},
    {t: 614, x: 460, y: 972, s: 1.5, e: GLIDE},
    {t: 628, x: 474, y: 974, s: 1.5, e: Easing.linear},
    {t: 662, x: cc(0) + 320, y: 930, s: 1.0, e: SMOOTH},
    {t: 712, x: cc(2) - 300, y: 930, s: 1.0, e: Easing.bezier(0.4, 0, 0.6, 1)},
    {t: 722, x: CX, y: 920, s: 1.06, e: SMOOTH},
    {t: 730, x: CX, y: 900, s: 1.1, e: SMOOTH},
    {t: 748, x: CX, y: CY, s: 1.0, e: SMOOTH},
  ];
  const m = p(f, 495, 509, EASE_IO);
  const up = p(f, UP, UP + 14, EASE_IO);
  const barY = lerp(BAR.y, BAR_UP_Y, up);
  const rx = lerp(CX - DOT / 2, BAR.x, m), ry = lerp(CY - DOT / 2, barY, m);
  const rw = lerp(DOT, BAR.w, m), rh = lerp(DOT, BAR.h, m), rr = lerp(6, BAR.r, m);
  const barOut = ascentOut(f, EXPAND, 8, 220);
  const typed = typedAt(f);
  const caretX = BAR.x + 84 + textW(typed, 32, 500, 0) + 4;
  const busy = ZONES.some((z) => (f >= z.type && f < z.in + 2) || (f >= z.del && f < z.del + 6));
  const caretOn = f >= 540 && f < UP && (busy || Math.floor((f - 540) / 8) % 2 === 0);
  return (
    <Shot f={f} id="search" keys={keys}>
      {f >= CARDS_IN && CARDS.map((c, i) => <Card key={i} f={f} i={i} c={c} />)}
      {f >= 662 && (
        <div style={{position: 'absolute', left: 0, width: W, top: 1300, textAlign: 'center', fontSize: 48, fontWeight: 800,
          letterSpacing: '-0.02em', color: C.t1, ...fx(ascentIn(f, 662, 10, 50), ascentOut(f, EXPAND, 8, 200))}}>
          A <span style={{color: C.brand}}>minutos</span><br />de tu universidad
        </div>
      )}
      <div style={{position: 'absolute', left: rx, top: ry, width: rw, height: rh, borderRadius: rr,
        background: mix(C.brand, '#ffffff', m), border: m > 0.5 ? `2px solid ${f >= 549 && f < UP ? '#bcd0ff' : C.border}` : 'none',
        boxShadow: m > 0 ? `0 ${14 * m}px ${40 * m}px rgba(15,23,42,${0.08 * m})` : 'none', boxSizing: 'border-box',
        transform: `translateY(${barOut.y}px)`, opacity: barOut.o, filter: barOut.b ? `blur(${barOut.b}px)` : undefined, overflow: 'hidden'}}>
        {f >= 505 && (
          <>
            <div style={{position: 'absolute', left: 34, top: 30, opacity: tw(f, 505, 511, 0, 1), transform: `translateY(${tw(f, 505, 513, 20, 0)}px)`}}>
              <Icon name="search" size={34} color={C.t3} sw={2} />
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, opacity: tw(f, 546, 549, 1, 0)}}>
              <RiseText text="Busca por zona o colonia" f={f} start={507} stagger={0.35} size={32} weight={500}
                ls={0} x={84} y={31} color={C.t4} ghost={C.t4} />
            </div>
            <div style={{position: 'absolute', left: 84, top: 31, fontSize: 32, fontWeight: 500, color: C.t1, lineHeight: 1, whiteSpace: 'pre'}}>{typed}</div>
          </>
        )}
      </div>
      {caretOn && <div style={{position: 'absolute', left: caretX, top: barY + 26, width: 3, height: 44, background: C.brand, borderRadius: 2}} />}
    </Shot>
  );
};

const Card: React.FC<{f: number; i: number; c: typeof CARDS[number]}> = ({f, i, c}) => {
  const start = CARDS_IN + [4, 0, 8][i];
  const inn = ascentIn(f, start, 13, 360);
  const rot = tw(f, start, start + 16, (i - 1) * 6 || 3, 0);
  const isHero = i === 1;
  const exit = isHero ? NONE : ascentOut(f, EXPAND + (i === 0 ? 0 : 2), 8, 240);
  const e = isHero ? p(f, EXPAND, EXPANDED, EASE_IO) : 0;
  if (isHero && f >= EXPANDED) return null;
  const x = lerp(cardX(i), HERO.x, e), y = lerp(CARD_Y, HERO.y, e);
  const w = lerp(CARD_W, HERO.w, e), h = lerp(CARD_H, HERO.h, e), r = lerp(36, HERO.r, e);
  const infoO = 1 - p(f, EXPAND, EXPAND + 5);
  const hl = p(f, c.hl, c.hl + 6);
  const n = Math.max(1, Math.min(c.min, Math.ceil(p(f, c.hl, c.hl + 12, Easing.linear) * c.min)));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden',
      transform: `translateY(${inn.y + exit.y}px) rotate(${rot}deg)`, opacity: inn.o * exit.o, filter: inn.b + exit.b > 0.05 ? `blur(${inn.b + exit.b}px)` : undefined,
      boxShadow: '0 24px 60px rgba(15,23,42,0.14)', background: '#ddd'}}>
      <Photo src={c.img} style={{transform: `scale(${tw(f, start, start + 90, 1.16, 1.02)})`}} />
      <div style={{position: 'absolute', inset: 0, opacity: infoO, background: 'linear-gradient(180deg, rgba(15,23,42,0) 40%, rgba(15,23,42,0.86) 100%)'}}>
        <div style={{position: 'absolute', left: 24, top: 24, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px 8px 12px',
          borderRadius: 99, background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff', fontSize: 24, fontWeight: 800}}>
          <StarFill size={24} />{c.rating}
        </div>
        <div style={{position: 'absolute', left: 30, right: 26, bottom: 30, color: '#fff'}}>
          <div style={{fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1}}>{c.title}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 24, fontWeight: 500, opacity: 0.9}}>
            <Icon name="map-pin-fill" size={24} color="#fff" />{c.zona}
          </div>
          <div style={{height: 52, marginTop: 10}}>
            {f >= c.hl && (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 25, fontWeight: 800, padding: '9px 16px 9px 12px',
                marginLeft: -6, borderRadius: 99, background: `rgba(38,103,255,${hl})`, transform: `scale(${spr(f, c.hl, 9, 260)})`, transformOrigin: 'left center'}}>
                <Icon name={c.icon} size={26} color="#fff" />{n} min a la {c.uni}
              </div>
            )}
          </div>
          <div style={{marginTop: 10, fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em'}}>
            ${c.price}<span style={{fontSize: 23, fontWeight: 500, opacity: 0.8}}> /mes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 5 · Fotos y lo que incluye ---------- */
const AMENITIES = [
  {icon: 'wifi-fill', t: 'Wi-Fi', at: 798},
  {icon: 'bed-fill', t: 'Cuarto amueblado', at: 803},
  {icon: 'washing-fill', t: 'Lavandería', at: 808},
  {icon: 'cutlery-fill', t: 'Cocina compartida', at: 813},
];
const GALLERY = ['cuarto-familia.jpg', 'bano-propio.jpg', 'casa-martinez.jpg'];
const SWIPES = [768, 786];
const DX = 96;

const Detail: React.FC<{f: number}> = ({f}) => {
  if (f < EXPANDED) return null;
  const keys: Key[] = [
    {t: EXPANDED, x: CX, y: CY, s: 1},
    {t: 784, x: CX, y: 640, s: 1.12, e: SMOOTH},
    {t: 800, x: CX, y: 1380, s: 1.0, e: WHIP},
    {t: 818, x: CX, y: 1392, s: 1.0, e: Easing.linear},
    {t: 836, x: 1900, y: 1392, s: 1.0, e: IN},
  ];
  const kb = tw(f, EXPANDED, 836, 1.02, 1.14, Easing.linear);
  const idx = SWIPES.filter((s) => f >= s).length;
  return (
    <Shot f={f} id="detail" keys={keys} opacity={1 - p(f, 830, 838, Easing.linear)}>
      <div style={{position: 'absolute', left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h, borderRadius: HERO.r,
        overflow: 'hidden', boxShadow: '0 24px 60px rgba(15,23,42,0.14)', background: '#ddd'}}>
        {GALLERY.map((g, i) => {
          const inK = i === 0 ? 1 : p(f, SWIPES[i - 1], SWIPES[i - 1] + 10, EASE_IO);
          const outK = i < SWIPES.length ? p(f, SWIPES[i], SWIPES[i] + 10, EASE_IO) : 0;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - inK) * 100 - outK * 100}%)`}}>
              <Photo src={g} style={{transform: `scale(${kb})`}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 30, bottom: 30, display: 'flex', gap: 12}}>
          <div style={{transform: `scale(${spr(f, 754)})`, transformOrigin: 'left bottom'}}><Pill><Icon name="community-fill" size={22} color={C.brand} />Casa de familia</Pill></div>
          <div style={{transform: `scale(${spr(f, 759)})`, transformOrigin: 'left bottom'}}><Pill><StarFill size={22} />4.8 · 12 reseñas</Pill></div>
        </div>
        <div style={{position: 'absolute', right: 30, bottom: 32, display: 'flex', gap: 8, alignItems: 'center', padding: '10px 16px',
          borderRadius: 99, background: 'rgba(15,23,42,0.55)', transform: `scale(${spr(f, 762)})`}}>
          {[0, 1, 2, 3, 4].map((d) => (
            <div key={d} style={{width: d === idx ? 26 : 10, height: 10, borderRadius: 9, background: d === idx ? '#fff' : 'rgba(255,255,255,0.5)'}} />
          ))}
        </div>
      </div>
      <RiseText text="Quad en casa de familia" f={f} start={754} stagger={0.4} size={62} x={DX} y={1064} />
      <div style={{position: 'absolute', left: DX, top: 1158, display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 500,
        color: C.t3, ...fx(ascentIn(f, 760, 10, 40))}}>
        <Icon name="map-pin-fill" size={30} color={C.brand} />Jardines de Guadalupe · 4 min a la UCA
      </div>
      <div style={{position: 'absolute', left: DX, top: 1216, fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em', color: C.t1,
        ...fx(ascentIn(f, 766, 10, 40))}}>
        $115<span style={{fontSize: 28, fontWeight: 500, color: C.t3}}> /mes</span>
      </div>
      <div style={{position: 'absolute', left: DX, top: 1340, fontSize: 34, fontWeight: 800, color: C.t1, ...fx(ascentIn(f, 794, 9, 40))}}>
        Lo que incluye
      </div>
      {AMENITIES.map((a, i) => {
        if (f < a.at) return null;
        const col = i % 2, row = Math.floor(i / 2);
        return (
          <div key={i} style={{position: 'absolute', left: DX + col * 454, top: 1404 + row * 140, width: 434, height: 120, borderRadius: 28,
            background: '#fff', border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px',
            boxSizing: 'border-box', transform: `scale(${spr(f, a.at, 10, 240)})`, transformOrigin: 'left center', boxShadow: '0 10px 30px rgba(15,23,42,0.05)'}}>
            <div style={{width: 68, height: 68, borderRadius: 22, background: C.brandSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name={a.icon} size={36} color={C.brand} />
            </div>
            <div style={{fontSize: 30, fontWeight: 800, color: C.t1, letterSpacing: '-0.01em'}}>{a.t}</div>
          </div>
        );
      })}
    </Shot>
  );
};

/* ---------- 6 · La familia ---------- */
const MEMBERS = [
  {name: 'Andrea', rol: 'Anfitriona', img: 'andrea.jpg', tone: '#dce6ff'},
  {name: 'Rosa', rol: 'Mamá', img: 'rosa.jpg', tone: '#fce7f3'},
  {name: 'Carlos', rol: 'Papá', img: 'carlos.jpg', tone: '#dcfce7'},
  {name: 'Toby', rol: 'Perro', img: 'toby.jpg', tone: '#fdebd3'},
];
const AV = 170, AV_Y = 780, AV_STEP = 240;
const avX = (i: number) => CX + (i - 1.5) * AV_STEP - AV / 2;
const RULES = [
  {icon: 'clock-fill', text: 'Llegada hasta las 10 p. m.', at: 872},
  {icon: 'cutlery-fill', text: 'Cocina libre hasta las 9 p. m.', at: 882},
  {icon: 'no-smoking-fill', text: 'No se fuma', at: 892},
];
const RULE_Y = 1090, RULE_STEP = 100;
const BLIND_AT = 940;
const PANEL = {x: 90, y: 400, w: 900, h: 1120};
const HEAD_AV = {x: PANEL.x + 44, y: PANEL.y + 40, s: 84};
const CHAT_S0 = 4.0;

const famKeys: Key[] = [
  {t: 820, x: -560, y: 880, s: 1.0},
  {t: 848, x: CX, y: 880, s: 1.0, e: OUT},
  {t: 932, x: CX, y: 900, s: 1.04, e: Easing.linear},
  {t: 958, x: CX, y: 1160, s: 1.04, e: GLIDE},
  {t: 1010, x: CX, y: 1172, s: 1.08, e: Easing.linear},
];
const andreaFrom = () => {
  const c = camAt(famKeys, HANDOFF);
  const s = toScreen(c, avX(0) + AV / 2, AV_Y + AV / 2, CX, CY);
  return {x: s.x, y: s.y, d: AV * c.s};
};

const Family: React.FC<{f: number}> = ({f}) => {
  const keys = famKeys;
  const away = {filter: `blur(${tw(f, 984, 1002, 0, 22, Easing.bezier(0.5, 0, 0.8, 1))}px)`, opacity: 1 - p(f, 992, 1006, Easing.linear)};
  const T1 = 'Conoce a la familia';
  const s1 = 'y sus reglas, ', s2 = 'antes de llegar';
  const w1 = textW(s1, 56), w2 = textW(s2, 56);
  const b1 = 'Aquí nadie llega', b2a = 'a ', b2b = 'ciegas.';
  const wb2a = textW(b2a, 100), wb2b = textW(b2b, 100);
  const unblur = tw(f, BLIND_AT + 18, BLIND_AT + 40, 16, 0, Easing.bezier(0.3, 0, 0.2, 1));
  return (
    <Shot f={f} id="family" keys={keys}>
      <div style={{position: 'absolute', inset: 0, ...away}}>
      <RiseText text={T1} f={f} start={834} stagger={0.5} size={92} x={CX - textW(T1, 92) / 2} y={520} />
      <RiseText text={s1} f={f} start={868} stagger={0.45} size={56} x={CX - (w1 + w2) / 2} y={640} color={C.t3} />
      <RiseText text={s2} f={f} start={902} stagger={0.45} size={56} x={CX - (w1 + w2) / 2 + w1} y={640} color={C.brand} />
      {MEMBERS.map((mb, i) => {
        const t = 828 + i * 4;
        if (f < t) return null;
        const inn = ascentIn(f, t, 10, 80);
        const ring = 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: avX(i), top: AV_Y, visibility: i === 0 ? 'hidden' : 'visible', width: AV, height: AV, borderRadius: 999, overflow: 'hidden',
              background: mb.tone, transform: `translateY(${inn.y}px) scale(${spr(f, t)})`, opacity: inn.o,
              boxShadow: `0 0 0 ${ring}px ${C.brand}, 0 14px 34px rgba(15,23,42,0.12)`}}>
              <Photo src={mb.img} />
            </div>
            <div style={{position: 'absolute', left: avX(i) - 30, top: AV_Y + AV + 18, width: AV + 60, textAlign: 'center', ...fx(ascentIn(f, t + 3, 10, 40))}}>
              <div style={{fontSize: 32, fontWeight: 800, color: C.t1}}>{mb.name}</div>
              <div style={{fontSize: 24, fontWeight: 500, color: C.t3, marginTop: 4}}>{mb.rol}</div>
            </div>
          </React.Fragment>
        );
      })}
      {RULES.map((r, i) => {
        if (f < r.at) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 0, width: W, top: RULE_Y + i * RULE_STEP, display: 'flex', justifyContent: 'center',
            transform: `scale(${spr(f, r.at, 10, 240)})`}}>
            <div style={{fontSize: 30}}><Pill big><Icon name={r.icon} size={30} color={C.brand} />{r.text}</Pill></div>
          </div>
        );
      })}
      <RiseText text={b1} f={f} start={BLIND_AT} stagger={0.5} size={100} x={CX - textW(b1, 100) / 2} y={1440} />
      <RiseText text={b2a} f={f} start={BLIND_AT + 10} stagger={0.5} size={100} x={CX - (wb2a + wb2b) / 2} y={1556} />
      <div style={{position: 'absolute', inset: 0, filter: `blur(${unblur}px)`}}>
        <RiseText text={b2b} f={f} start={BLIND_AT + 14} stagger={0.8} size={100} x={CX - (wb2a + wb2b) / 2 + wb2a} y={1556} color={C.brand} />
      </div>
      </div>
      {f >= 828 && f < HANDOFF && (
        <div style={{position: 'absolute', left: avX(0), top: AV_Y, width: AV, height: AV, borderRadius: 999, overflow: 'hidden', background: '#dce6ff',
          transform: `translateY(${ascentIn(f, 828, 10, 80).y}px) scale(${spr(f, 828)})`, opacity: ascentIn(f, 828, 10, 80).o,
          boxShadow: `0 0 0 ${tw(f, 984, 996, 0, 7)}px ${C.brand}, 0 14px 34px rgba(15,23,42,0.12)`}}>
          <Photo src="andrea.jpg" />
        </div>
      )}
    </Shot>
  );
};

/* ---------- 7 · Chat ---------- */
const MSG_BOTTOM = PANEL.y + PANEL.h - 44;
const MSGS = [
  {who: 'a', t: 1016, h: 120, text: '¡Hola, Sofía! Pregúntame lo que necesites.'},
  {who: 'y', t: 1034, h: 120, text: '¿Puedo usar la cocina después de clases?'},
  {who: 'a', t: 1054, h: 78, text: 'Sí, es libre hasta las 9 p. m.'},
  {who: 'y', t: 1070, h: 78, text: '¿Puedo ir a conocer la casa?'},
  {who: 'v', t: 1084, h: 204, text: ''},
];
const VISIT = {x: PANEL.x + 44, w: 560};
const BTN_C = {x: VISIT.x + 26 + 125, y: MSG_BOTTOM - 26 - 34};
const FILL = 1158;

const Chat: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 998, x: CX, y: CY, s: 1.0},
    {t: 1030, x: CX, y: CY, s: 1.0},
    {t: 1060, x: CX, y: 1000, s: 1.08, e: SMOOTH},
    {t: 1080, x: CX, y: 1040, s: 1.1, e: Easing.linear},
    {t: 1100, x: 480, y: 1280, s: 1.3, e: SMOOTH},
    {t: 1112, x: 476, y: 1288, s: 1.32, e: Easing.linear},
    {t: 1138, x: BTN_C.x, y: BTN_C.y, s: 1.85, e: GLIDE},
    {t: FILL, x: BTN_C.x, y: BTN_C.y, s: 1.95, e: Easing.linear},
    {t: 1174, x: BTN_C.x, y: BTN_C.y, s: 2.7, e: IN},
  ];
  const offsetFor = (i: number) => MSGS.slice(i + 1).reduce((s, mm) => s + (mm.h + 18) * p(f, mm.t, mm.t + 8, EASE), 0);
  const headO = ascentIn(f, 1010, 10, 30);
  return (
    <Shot f={f} id="chat" keys={keys}>
      <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 48,
        background: '#fff', boxShadow: '0 30px 80px rgba(15,23,42,0.12)', border: `1.5px solid ${C.border}`, overflow: 'hidden',
        ...fx(ascentIn(f, 1006, 14, 90))}}>
        <div style={{position: 'absolute', left: 148, top: 46, ...fx(headO)}}>
          <div style={{fontSize: 36, fontWeight: 800, color: C.t1, letterSpacing: '-0.02em'}}>Andrea Martínez</div>
          <div style={{fontSize: 24, fontWeight: 500, color: C.t3, marginTop: 6}}>Anfitriona · responde en minutos</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 164, height: 1.5, background: C.border, opacity: headO.o}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 166, bottom: 0, overflow: 'hidden'}}>
          {MSGS.map((mm, i) => {
            const k = p(f, mm.t, mm.t + 9);
            if (k <= 0) return null;
            const bottom = MSG_BOTTOM - offsetFor(i) - PANEL.y - 166;
            const s = spr(f, mm.t, 12, 260);
            const style: React.CSSProperties = {position: 'absolute', top: bottom - mm.h, height: mm.h,
              transform: `translateY(${(1 - k) * 50}px) scale(${lerp(0.8, 1, s)})`, opacity: tw(f, mm.t, mm.t + 4, 0, 1),
              transformOrigin: mm.who === 'y' ? 'bottom right' : 'bottom left'};
            if (mm.who === 'v') return <Visit key={i} f={f} style={{...style, left: VISIT.x - PANEL.x, width: VISIT.w}} />;
            const mine = mm.who === 'y';
            return (
              <div key={i} style={{...style, ...(mine ? {right: 44} : {left: 44}), display: 'flex', alignItems: 'flex-end'}}>
                <div style={{maxWidth: 600, padding: '20px 28px', fontSize: 30, lineHeight: '40px', fontWeight: 500,
                  borderRadius: mine ? '30px 30px 8px 30px' : '30px 30px 30px 8px',
                  background: mine ? C.brand : '#eef2f7', color: mine ? '#fff' : C.t1}}>{mm.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      {f >= HANDOFF && <FlyingAvatar f={f} from={andreaFrom()} to={{x: HEAD_AV.x + HEAD_AV.s / 2, y: HEAD_AV.y + HEAD_AV.s / 2, d: HEAD_AV.s}} />}
      {f >= 1140 && <AcceptMorph f={f} at={BTN_C} />}
    </Shot>
  );
};

/* ---------- 8 · Cuenta institucional (tarjetas apiladas) ---------- */
const STUD = {x: 110, y: 330, w: 860, h: 620};
const HOST = {x: 110, y: 1010, w: 860, h: 620};
const iconC = (c: typeof STUD) => ({x: c.x + 56 + 48, y: c.y + 56 + 48});

const Access: React.FC<{f: number}> = ({f}) => {
  const fieldY = (c: typeof STUD) => c.y + 340 + 44;
  const keys: Key[] = [
    {t: 1170, x: CX, y: 660, s: 1.6},
    {t: 1198, x: CX, y: 660, s: 1.2, e: OUT},
    {t: 1220, x: 520, y: 640, s: 1.28, e: SMOOTH},
    {t: 1230, x: 340, y: fieldY(STUD), s: 1.6, e: GLIDE},
    {t: 1270, x: 640, y: fieldY(STUD), s: 1.6, e: GLIDE},
    {t: 1294, x: CX, y: 650, s: 1.18, e: SMOOTH},
    {t: 1310, x: CX, y: 662, s: 1.16, e: Easing.linear},
    {t: 1328, x: CX, y: 1330, s: 1.18, e: WHIP},
    {t: 1338, x: 340, y: fieldY(HOST), s: 1.6, e: SMOOTH},
    {t: 1372, x: 690, y: fieldY(HOST), s: 1.6, e: GLIDE},
    {t: 1392, x: 430, y: 1470, s: 1.3, e: SMOOTH},
    {t: 1414, x: CX, y: 980, s: 0.96, e: SMOOTH},
    {t: 1438, x: CX, y: 980, s: 0.93, e: Easing.linear},
    {t: 1452, x: CX, y: 2400, s: 0.93, e: IN},
  ];
  return (
    <Shot f={f} id="access" keys={keys} opacity={1 - p(f, 1446, 1454, Easing.linear)}>
      <AccessCard f={f} c={STUD} icon="user-solid" tag="Estudiantes" l1="Ingresa con tu cuenta" l2="institucional"
        t1={1209} t2={1222} mail="sofia.ramirez@uca.edu.sv" typeAt={1228} okAt={1278} note="Solo correos @uca.edu.sv" iconIn={1182} />
      {f >= 1300 && (
        <AccessCard f={f} c={HOST} icon="home-solid" tag="Anfitriones" l1="Ofrece tu espacio con" l2="tu correo institucional"
          t1={1312} t2={1326} mail="andrea.martinez@ues.edu.sv" typeAt={1336} okAt={1370} button iconIn={1306} />
      )}
    </Shot>
  );
};

/* ---------- 9 · Seguridad ---------- */
const BADGE = {cx: CX, cy: 600, s: 300, r: 86};
const SAFE_ROWS = [
  {icon: 'user-solid', t: 'Identidades verificadas', at: 1460, y: 860},
  {icon: 'doc', t: 'Contrato', at: 1503, y: 990},
  {icon: 'dollar-circle-fill', t: 'Pagos', at: 1520, y: 1120},
];
const ALL_IN = 1543, SAFE_OUT = 1586;
const safeKeys: Key[] = [
  {t: 1436, x: CX, y: -560, s: 1.05},
  {t: 1462, x: CX, y: 700, s: 1.14, rx: -8, e: OUT},
  {t: 1500, x: CX, y: 880, s: 1.12, rx: -3, e: Easing.linear},
  {t: 1530, x: CX, y: 1060, s: 1.1, rx: 4, e: GLIDE},
  {t: 1558, x: CX, y: 980, s: 1.0, rx: 0, e: SMOOTH},
  {t: 1586, x: CX + 5, y: 975, s: 1.03, e: Easing.linear},
  {t: 1600, x: CX, y: CY, s: 1.0, e: SMOOTH},
];

const Safe: React.FC<{f: number}> = ({f}) => {
  const ex = (k: number) => ascentOut(f, SAFE_OUT + k, 8, 200);
  const SAFE_X = CX - (100 + 32 + textW(SAFE_ROWS[0].t, 54) + 18 + 50) / 2;
  const L = sentenceLayout(1600);
  const target = toWorld(camAt(safeKeys, 1600), L.startX, L.startY + DOT / 2, CX, CY);
  const d = p(f, SAFE_OUT + 2, 1600, EASE_IO);
  const bIn = ascentIn(f, 1446, 12, 160);
  const cx = lerp(BADGE.cx, target.x + DOT / 2, d), cy = lerp(BADGE.cy, target.y, d);
  const s = lerp(BADGE.s, DOT, d), r = lerp(BADGE.r, 6, d);
  return (
    <Shot f={f} id="safe" keys={safeKeys} opacity={p(f, 1440, 1448, Easing.linear)}>
      {SAFE_ROWS.map((row, i) => {
        if (f < row.at) return null;
        const tw_ = textW(row.t, 54);
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...fx(ascentIn(f, row.at, 10, 60), ex(i))}}>
            <div style={{position: 'absolute', left: SAFE_X, top: row.y, width: 100, height: 100, borderRadius: 30, background: C.brandSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${spr(f, row.at, 10, 240)})`}}>
              {row.icon === 'doc' ? <DocIcon f={f} at={row.at} /> : <Icon name={row.icon} size={50} color={C.brand} />}
            </div>
            <RiseText text={row.t} f={f} start={row.at + 2} stagger={0.45} size={54} x={SAFE_X + 132} y={row.y + 23} />
            <div style={{position: 'absolute', left: SAFE_X + 132 + tw_ + 18, top: row.y + 25, transform: `scale(${spr(f, row.at + 12, 9, 260)})`}}>
              <Icon name="check-circle-fill" size={50} color={C.brand} style={{['--icon-cut' as any]: '#fff'}} />
            </div>
          </div>
        );
      })}
      {f >= ALL_IN && (
        <div style={{position: 'absolute', inset: 0, ...fx(NONE, ex(3))}}>
          <RiseText text="Todo dentro" f={f} start={ALL_IN} stagger={0.5} size={96} x={SAFE_X} y={1290} />
          <RiseText text="de Quad." f={f} start={ALL_IN + 8} stagger={0.5} size={96} x={SAFE_X} y={1400} accentFrom={3} accentTo={6} />
        </div>
      )}
      {f >= 1446 && (
        <div style={{position: 'absolute', left: cx - s / 2, top: cy - s / 2, width: s, height: s, borderRadius: r,
          background: 'radial-gradient(120% 120% at 25% 15%, #4a82ff 0%, #2667ff 55%, #1a4fd6 100%)',
          transform: `translateY(${bIn.y * (1 - d)}px) scale(${d > 0 ? 1 : spr(f, 1446, 10, 200)})`, opacity: bIn.o,
          boxShadow: `0 ${30 * (1 - d)}px ${70 * (1 - d)}px rgba(38,103,255,${0.35 * (1 - d)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: 1 - p(f, SAFE_OUT, SAFE_OUT + 6), transform: `scale(${tw(f, 1452, 1466, 0.5, 1)}) rotate(${tw(f, 1452, 1466, -18, 0)}deg)`}}>
            <Icon name="shield-check-fill" size={160} color="#fff" style={{['--icon-cut' as any]: C.brand}} />
          </div>
        </div>
      )}
    </Shot>
  );
};

/* ---------- 10 · Hecho para… (cuatro líneas) ---------- */
type Word = {t?: string; img?: string; at: number; accent?: boolean};
const LINES: {top: number; words: Word[]}[] = [
  {top: 680, words: [{t: 'Hecho', at: 1607}, {t: 'para', at: 1615}, {img: 'sofia.jpg', at: 1622}]},
  {top: 800, words: [{t: 'estudiantes', at: 1626, accent: true}, {t: 'foráneos', at: 1641, accent: true}]},
  {top: 960, words: [{t: 'y', at: 1657}, {t: 'para', at: 1661}, {img: 'andrea.jpg', at: 1668}, {t: 'familias', at: 1671, accent: true}]},
  {top: 1080, words: [{t: 'que', at: 1684}, {t: 'abren', at: 1689}, {t: 'su', at: 1696}, {t: 'casa', at: 1700}]},
];
const S_SIZE = 88, S_GAP = 24, S_IMG = 110;
const SENT_OUT = 1722, DOT_Q = 1734;

const sentenceLayout = (f: number) => {
  const wOf = (w: Word) => (w.t ? textW(w.t, S_SIZE) : S_IMG);
  const placed = LINES.map((ln, li) => {
    const last = li === LINES.length - 1;
    const width = ln.words.reduce((s, w) => s + wOf(w), 0) + S_GAP * (ln.words.length - 1) + (last ? DOT_GAP + DOT : 0);
    let acc = CX - width / 2;
    const words = ln.words.map((w) => { const x = acc; acc += wOf(w) + S_GAP; return {...w, x, w: wOf(w)}; });
    return {top: ln.top, x0: CX - width / 2, words, last};
  });
  const lineFront = (ln: typeof placed[number]) =>
    ln.words.reduce((x, it, i) => lerp(x, it.x + it.w + (ln.last && i === ln.words.length - 1 ? DOT_GAP : S_GAP / 2 - DOT / 2), p(f, it.at, it.at + 7, EASE)), ln.x0 - DOT - 6);
  const dotY = (ln: typeof placed[number]) => ln.top + S_SIZE * 0.83 - DOT;
  let dx = lineFront(placed[0]), dy = dotY(placed[0]);
  for (let i = 1; i < placed.length; i++) {
    const k = p(f, placed[i].words[0].at - 4, placed[i].words[0].at + 6, EASE_IO);
    dx = lerp(dx, lineFront(placed[i]), k); dy = lerp(dy, dotY(placed[i]), k);
  }
  return {placed, dx, dy, startX: placed[0].x0 - DOT - 6, startY: dotY(placed[0])};
};

const K0 = 7;
const MARK0 = {x: CX - 26 * K0, y: CY - 26 * K0};

const Sentence: React.FC<{f: number}> = ({f}) => {
  const L = sentenceLayout(f);
  const keys: Key[] = [
    {t: 1598, x: CX, y: CY, s: 1},
    {t: 1601, x: CX, y: CY, s: 1},
    {t: 1616, x: CX, y: 760, s: 1.16, e: SMOOTH},
    {t: 1640, x: CX, y: 830, s: 1.16, e: GLIDE},
    {t: 1664, x: CX, y: 1000, s: 1.16, e: SMOOTH},
    {t: 1704, x: CX, y: 1080, s: 1.16, e: GLIDE},
    {t: 1716, x: CX, y: CY, s: 1.0, e: SMOOTH},
  ];
  const all = L.placed.flatMap((ln) => ln.words.map((w) => ({...w, top: ln.top})));
  const q = p(f, SENT_OUT, DOT_Q, EASE_IO);
  const ss = SMALL.s * K0;
  const x = lerp(L.dx, MARK0.x + SMALL.x * K0, q), y = lerp(L.dy, MARK0.y + SMALL.y * K0, q);
  return (
    <Shot f={f} id="sentence" keys={keys}>
      {all.map((it, i) => {
        if (f < it.at) return null;
        const e = ascentOut(f, SENT_OUT - 4 + i * 0.5, 8, 200);
        if (it.img) {
          return (
            <div key={i} style={{position: 'absolute', left: it.x, top: it.top + S_SIZE * 0.5 - S_IMG / 2 + 4, width: S_IMG, height: S_IMG,
              borderRadius: 28, overflow: 'hidden', transform: `translateY(${e.y}px) scale(${spr(f, it.at, 10, 240)}) rotate(${tw(f, it.at, it.at + 12, -14, i < 3 ? -4 : 4)}deg)`,
              boxShadow: '0 12px 30px rgba(15,23,42,0.18)', opacity: e.o, filter: e.b ? `blur(${e.b}px)` : undefined}}>
              <Photo src={it.img} />
            </div>
          );
        }
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...fx(e)}}>
            <RiseText text={it.t!} f={f} start={it.at} stagger={0.5} size={S_SIZE} x={it.x} y={it.top} color={it.accent ? C.brand : C.t1} />
          </div>
        );
      })}
      {f >= 1600 && f < DOT_Q + 2 && (
        <div style={{position: 'absolute', left: x, top: y, width: lerp(DOT, ss, q), height: lerp(DOT, ss, q), borderRadius: lerp(6, 0, q), background: C.brand}} />
      )}
    </Shot>
  );
};

/* ---------- 11 · Logo ---------- */
const BIG_AT = 1726, LOCK = 1736, WIPE = 1740;

const Finale: React.FC<{f: number}> = ({f}) => {
  const big = ascentIn(f, BIG_AT, 10, 160);
  const bigS = spr(f, BIG_AT, 9, 220);
  const lock = f < LOCK ? 1 : tw(f, LOCK, LOCK + 8, 1.07, 1);
  const wp = p(f, WIPE, WIPE + 14, EASE_IO);
  const rad = lerp(260, 0, wp);
  const WS = 170;
  const wW = textW('Quad', WS);
  const k1 = 4.6, period = 36;
  const total = PIECE * k1 + 44 + wW + 12 + period;
  const gx = CX - total / 2;
  const cy = 900;
  const s = p(f, WIPE + 15, WIPE + 29, EASE_IO);
  const k = lerp(K0, k1, s);
  const ox = lerp(MARK0.x, gx - PIECE0 * k1, s), oy = lerp(MARK0.y, cy - 26 * k1, s);
  const wordX = gx + PIECE * k1 + 44;
  const endZoom = tw(f, WIPE + 29, DURATION, 1, 1.07, Easing.linear);
  const Mark = ({color}: {color: string}) => (
    <div style={{position: 'absolute', left: ox, top: oy, width: 52 * k, height: 52 * k, transform: `scale(${lock})`}}>
      <svg width={52 * k} height={52 * k} viewBox="0 0 52 52" style={{position: 'absolute', overflow: 'visible'}}>
        {f >= BIG_AT && (
          <g style={{transformOrigin: '24px 24px', transform: `translateY(${big.y / k}px) scale(${bigS})`, opacity: big.o}}>
            <path d={BIG_PIECE} fill={color} />
          </g>
        )}
        {f >= DOT_Q + 2 && <rect x={SMALL.x} y={SMALL.y} width={SMALL.s} height={SMALL.s} fill={color} />}
      </svg>
    </div>
  );
  return (
    <AbsoluteFill>
      <Mark color={C.brand} />
      <div style={{position: 'absolute', top: -80, left: -80, right: -80, bottom: -80, clipPath: `inset(${(1 - wp) * 100}% 0 0 0 round ${rad}px ${rad}px 0 0)`,
        background: 'radial-gradient(120% 80% at 25% 15%, #4a82ff 0%, #2667ff 48%, #1a4fd6 100%)'}}>
        <div style={{position: 'absolute', top: 80, left: 80, width: 1080, height: 1920, transform: `scale(${endZoom})`}}>
          <Mark color="#fff" />
          {f >= WIPE + 15 && (
            <>
              <RiseText text="Quad" f={f} start={WIPE + 25} stagger={2} size={WS} x={wordX} y={cy - WS * 0.53} color="#fff" ghost="#9db8ff" />
              <div style={{position: 'absolute', left: wordX + wW + 12, top: cy + WS * 0.42 - period, width: period, height: period,
                background: '#fff', borderRadius: 7, transform: `scale(${spr(f, WIPE + 36, 9, 240)})`}} />
              <RiseText text="Tu lugar cerca de la U." f={f} start={WIPE + 38} stagger={0.5} size={66} x={0} y={1060} width={1080}
                align="center" color="#fff" ghost="#9db8ff" />
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
