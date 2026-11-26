import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, EASE, EASE_IO, tw, p, lerp, mix, ascentIn, ascentOut, textW} from './theme';
import {Icon, StarFill, RiseText, Photo, BIG_PIECE, SMALL} from './ui';
import {Shot, Key, camAt, toWorld, toScreen, SMOOTH, WHIP, GLIDE, OUT, IN} from './camera';

/* =====================================================================
   Quad · Video promocional v3 (63 s · 1920×1080 · 30 fps · 120 BPM)

   Sincronizado con la voz en off de ElevenLabs (10 clips, Luisa).
   Cada escena tiene su propia cámara: acercamientos, alejamientos,
   paneos con curva de velocidad, una ligera inclinación 3D y desenfoque
   de movimiento según la dirección y la velocidad de la cámara.

   Hilo conductor: el punto azul (la pieza pequeña del logo de Quad).
   ===================================================================== */

export const DURATION = 1890;
/* inicio de cada clip de voz, en frames (ver audio/make_audio.py) */
export const VO = [18, 192, 330, 510, 750, 840, 1020, 1185, 1455, 1605];

const spr = (f: number, t: number, damping = 11, stiffness = 210) =>
  spring({frame: f - t, fps: 30, config: {damping, stiffness, mass: 0.6}});
type Fx = {y: number; o: number; b: number};
const NONE: Fx = {y: 0, o: 1, b: 0};
const fx = (a: Fx, b: Fx = NONE): React.CSSProperties => ({
  transform: `translateY(${a.y + b.y}px)`, opacity: a.o * b.o, filter: a.b + b.b > 0.05 ? `blur(${a.b + b.b}px)` : undefined,
});
const DOT = 22, DOT_GAP = 10;

export const QuadPromo: React.FC = () => {
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

/* =====================================================================
   1 · Gancho (0–192) — "Llegaste a estudiar a la capital. ¿Dónde vas a
   vivir? ¿Con quién?" La cámara baja con cada pregunta.
   ===================================================================== */
const H_SIZE = 92, Q_SIZE = 88;
const A_TOP = 440, Q1_TOP = 592, Q2_TOP = 744;
const LINE_A = 'Llegaste a estudiar a la capital';
const Q1 = '¿Dónde vas a vivir?', Q2 = '¿Con quién?';
const Q1_AT = 90, Q2_AT = 146;

const Hook: React.FC<{f: number}> = ({f}) => {
  const wA = textW(LINE_A, H_SIZE), w1 = textW(Q1, Q_SIZE), w2 = textW(Q2, Q_SIZE);
  const xA = 960 - (wA + DOT_GAP + DOT) / 2, x1 = 960 - w1 / 2, x2 = 960 - (w2 + DOT_GAP + DOT) / 2;
  const perA = {x: xA + wA + DOT_GAP, y: A_TOP + H_SIZE * 0.83 - DOT};
  const per2 = {x: x2 + w2 + DOT_GAP + 6, y: Q2_TOP + Q_SIZE * 0.83 - DOT};
  const keys: Key[] = [
    {t: 0, x: 960, y: 500, s: 1.22},
    {t: 84, x: 960, y: 488, s: 1.04, e: OUT},
    {t: 106, x: 960, y: 612, s: 1.1, e: GLIDE},
    {t: 142, x: 960, y: 624, s: 1.06, e: Easing.linear},
    {t: 164, x: 960, y: 712, s: 1.04, e: GLIDE},
    {t: 178, x: 975, y: 716, s: 1.02, e: Easing.linear},
    {t: 194, x: per2.x + DOT / 2, y: per2.y + DOT / 2, s: 2.8, e: IN},
  ];
  /* el punto: aparece, se vuelve el punto final y espera la respuesta */
  let dx = 960 - DOT / 2, dy = 540 - DOT / 2;
  for (const [a, b, to] of [[18, 40, perA], [Q2_AT + 6, Q2_AT + 20, per2]] as const) {
    const k = p(f, a, b, EASE_IO); dx = lerp(dx, to.x, k); dy = lerp(dy, to.y, k);
  }
  const hop = f >= Q2_AT + 6 && f < Q2_AT + 20 ? -60 * Math.sin(p(f, Q2_AT + 6, Q2_AT + 20, Easing.linear) * Math.PI) : 0;
  const breathe = f >= 168 ? 1 + 0.2 * Math.max(0, Math.sin((f - 168) / 15 * Math.PI)) : 1;
  const greyA = p(f, Q1_AT, Q1_AT + 10), grey1 = p(f, Q2_AT, Q2_AT + 10);
  return (
    <Shot f={f} id="hook" keys={keys} opacity={1 - p(f, 184, 194, Easing.linear)}>
      <RiseText text={LINE_A} f={f} start={18} stagger={0.5} size={H_SIZE} x={xA} y={A_TOP} color={mix(C.t1, '#c3ccd9', greyA)} />
      <RiseText text={Q1} f={f} start={Q1_AT} stagger={0.4} size={Q_SIZE} x={x1} y={Q1_TOP} color={mix(C.t1, '#c3ccd9', grey1)} />
      <RiseText text={Q2} f={f} start={Q2_AT} stagger={0.5} size={Q_SIZE} x={x2} y={Q2_TOP} accentFrom={5} />
      <div style={{position: 'absolute', left: dx, top: dy + hop, width: DOT, height: DOT, borderRadius: 6, background: C.brand,
        transform: `scale(${spr(f, 0) * breathe})`}} />
    </Shot>
  );
};

/* =====================================================================
   2 · El problema (180–318) — "Entre grupos y anuncios sueltos, nunca
   sabes en quién confiar." Anuncios que se amontonan y luego se
   desenfocan; al final todo se encoge en un punto.
   ===================================================================== */
type Clip = {t: number; x: number; y: number; r: number; kind: 'pill' | 'bubble' | 'note'; text: string; sub?: string};
const CLUTTER: Clip[] = [
  {t: 194, x: 250, y: 170, r: -4, kind: 'pill', text: 'Cuartos en alquiler SS · 3,2 mil miembros'},
  {t: 201, x: 1290, y: 150, r: 3, kind: 'bubble', text: '¿Sigue disponible?'},
  {t: 212, x: 170, y: 470, r: -6, kind: 'note', text: 'SE ALQUILA CUARTO', sub: '$200 + depósito · info al DM'},
  {t: 220, x: 1370, y: 410, r: 5, kind: 'note', text: 'Solo señoritas', sub: 'Zona UCA · sin fotos'},
  {t: 229, x: 700, y: 790, r: 2, kind: 'note', text: 'Cuarto amueblado', sub: 'Llamar después de las 6'},
  {t: 243, x: 1260, y: 800, r: -3, kind: 'bubble', text: '¿La foto es real?'},
  {t: 250, x: 260, y: 860, r: 4, kind: 'bubble', text: '¿Me pasas la dirección?'},
  {t: 256, x: 760, y: 190, r: -2, kind: 'bubble', text: 'Visto'},
];
const TRUST_AT = 264, COLLAPSE = 298;

const Problem: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 178, x: 960, y: 540, s: 1.5},
    {t: 208, x: 960, y: 540, s: 1.0, r: -1.2, e: OUT},
    {t: 262, x: 985, y: 548, s: 1.04, r: 0.6, e: Easing.linear},
    {t: 298, x: 960, y: 540, s: 1.08, r: 0, e: SMOOTH},
    {t: 318, x: 960, y: 540, s: 0.86, e: IN},
  ];
  const doubt = p(f, TRUST_AT - 2, TRUST_AT + 12);
  const big = 'nunca sabes';
  const big2 = '¿en quién confiar?';
  const wB = textW(big2, 112);
  return (
    <Shot f={f} id="problem" keys={keys} opacity={p(f, 180, 188, Easing.linear) * (1 - p(f, 316, 324, Easing.linear))}>
      {CLUTTER.map((c, i) => {
        if (f < c.t) return null;
        const s = spr(f, c.t, 10, 230);
        const inn = ascentIn(f, c.t, 10, 50);
        const drift = 8 * Math.sin((f + i * 30) / 26);
        /* colapso: todo vuela al centro y se encoge */
        const k = p(f, COLLAPSE + i * 0.6, COLLAPSE + 14 + i * 0.6, Easing.bezier(0.6, 0, 0.9, 0.5));
        const w = c.kind === 'note' ? 400 : textW(c.text, 28, 500, 0) + (c.kind === 'pill' ? 110 : 64);
        const cx = c.x + w / 2, cy = c.y + 60;
        const tx = lerp(0, 960 - cx, k), ty = lerp(0, 540 - cy, k);
        return (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y + drift, width: w,
            transform: `translate(${tx}px, ${ty + inn.y}px) rotate(${c.r * (1 + doubt * 0.6)}deg) scale(${s * (1 - k)})`,
            opacity: inn.o * (1 - doubt * 0.62) * (1 - k * 0.5),
            filter: `blur(${inn.b + doubt * 5}px) grayscale(${doubt})`}}>
            <ClutterItem c={c} />
          </div>
        );
      })}
      {f >= TRUST_AT - 22 && (
        <div style={{position: 'absolute', inset: 0, ...fx(NONE, ascentOut(f, COLLAPSE, 9, 160))}}>
          <RiseText text={big} f={f} start={TRUST_AT - 22} stagger={0.5} size={60} weight={800} x={0} y={404} width={1920}
            align="center" color={C.t3} />
          <RiseText text={big2} f={f} start={TRUST_AT} stagger={0.55} size={112} x={960 - wB / 2} y={486} accentFrom={4} accentTo={8} />
        </div>
      )}
    </Shot>
  );
};

export const ClutterItem: React.FC<{c: Clip}> = ({c}) => {
  if (c.kind === 'pill') return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 26px 16px 18px', borderRadius: 99, background: '#fff',
      border: `1.5px solid ${C.border}`, fontSize: 28, fontWeight: 500, color: C.t2, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(15,23,42,0.08)'}}>
      <Icon name="group-fill" size={30} color={C.t3} />{c.text}
    </div>
  );
  if (c.kind === 'bubble') return (
    <div style={{display: 'inline-block', padding: '18px 32px', borderRadius: '30px 30px 30px 8px', background: '#e9edf3', fontSize: 28,
      fontWeight: 500, color: C.t1, whiteSpace: 'nowrap'}}>{c.text}</div>
  );
  return (
    <div style={{width: 400, padding: '26px 30px', borderRadius: 18, background: '#fffdf4', border: '1.5px solid #efe6c8',
      boxShadow: '0 16px 40px rgba(15,23,42,0.10)', boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 800, color: C.t1, letterSpacing: '-0.01em'}}>{c.text}</div>
      <div style={{fontSize: 22, fontWeight: 500, color: C.t3, marginTop: 10}}>{c.sub}</div>
    </div>
  );
};

/* =====================================================================
   3 · Conoce Quad (315–495) — el punto se vuelve el logo, la cámara se
   aleja; baja a "Tu vivienda digna para la U" y a las personas verificadas.
   ===================================================================== */
const LK = 4.2, L_CY = 300, L_WS = 156;
export const PIECE0 = 12.84, PIECE = 26.32;
const logoLayout = () => {
  const wW = textW('Quad', L_WS);
  const total = PIECE * LK + 44 + wW;
  const gx = 960 - total / 2;
  return {ox: gx - PIECE0 * LK, oy: L_CY - 26 * LK, wordX: gx + PIECE * LK + 44, wordTop: L_CY - L_WS * 0.53};
};
const INTRO_LINE = 'Tu vivienda digna para la U';
const PEOPLE = [{img: 'sofia.jpg', at: 440}, {img: 'andrea.jpg', at: 447}, {img: 'carlos.jpg', at: 454}];
const INTRO_OUT = 480;

const Intro: React.FC<{f: number}> = ({f}) => {
  const L = logoLayout();
  const keys: Key[] = [
    {t: 308, x: 960, y: L_CY, s: 1.9},
    {t: 334, x: 960, y: L_CY, s: 1.75, e: Easing.linear},
    {t: 364, x: 960, y: 350, s: 1.14, e: OUT},
    {t: 370, x: 960, y: 362, s: 1.12, e: Easing.linear},
    {t: 394, x: 960, y: 470, s: 1.08, e: GLIDE},
    {t: 436, x: 945, y: 482, s: 1.05, e: Easing.linear},
    {t: 458, x: 930, y: 560, s: 1.0, e: GLIDE},
    {t: 478, x: 960, y: 540, s: 1.0, e: SMOOTH},
  ];
  /* punto → pieza pequeña de la Q → (al salir) centro de la pantalla */
  const sp = {x: L.ox + SMALL.x * LK, y: L.oy + SMALL.y * LK, s: SMALL.s * LK};
  const a = p(f, 336, 350, EASE_IO);
  let x = lerp(960 - DOT / 2, sp.x, a), y = lerp(L_CY - DOT / 2, sp.y, a), s = lerp(DOT, sp.s, a), r = lerp(6, 0, a);
  const b = p(f, INTRO_OUT + 4, 496, EASE_IO);
  x = lerp(x, 960 - DOT / 2, b); y = lerp(y, 540 - DOT / 2, b); s = lerp(s, DOT, b); r = lerp(r, 6, b);
  const pop = spr(f, 312);
  const bigIn = ascentIn(f, 349, 10, 90);
  const bigS = spr(f, 349, 9, 220);
  const out = (k: number) => ascentOut(f, INTRO_OUT + k, 8, 200);
  const wLine = textW(INTRO_LINE, 76);
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
        <RiseText text={INTRO_LINE} f={f} start={370} stagger={0.45} size={76} x={960 - wLine / 2} y={480} accentFrom={12} accentTo={16} />
      </div>
      {PEOPLE.map((pp, i) => {
        const cx = 960 + (i - 1) * 170;
        const sc = spr(f, pp.at, 10, 230);
        const badge = spr(f, pp.at + 9, 9, 260);
        if (f < pp.at) return null;
        return (
          <div key={i} style={{position: 'absolute', left: cx - 64, top: 630, width: 128, height: 128, ...fx(NONE, out(3 + i)),
            transform: `translateY(${out(3 + i).y}px) scale(${sc})`}}>
            <div style={{width: 128, height: 128, borderRadius: 99, overflow: 'hidden', boxShadow: '0 12px 30px rgba(15,23,42,0.16)', background: '#dce6ff'}}>
              <Photo src={pp.img} />
            </div>
            <div style={{position: 'absolute', right: -6, bottom: -6, width: 48, height: 48, borderRadius: 99, background: C.brand,
              border: '4px solid #f5f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`}}>
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2}
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray={22} strokeDashoffset={22 * tw(f, pp.at + 11, pp.at + 19, 1, 0)} /></svg>
            </div>
          </div>
        );
      })}
      {f >= 452 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontSize: 38, fontWeight: 800, color: C.t1,
          letterSpacing: '-0.02em', ...fx(ascentIn(f, 452, 10, 40), out(6))}}>
          Personas <span style={{color: C.brand}}>verificadas</span>
        </div>
      )}
      {f < 497 && (
        <div style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: r, background: C.brand,
          transform: `scale(${a > 0 ? 1 : pop})`}} />
      )}
    </Shot>
  );
};

/* =====================================================================
   4 · Busca por zona (495–752) — la cámara se acerca al buscador y
   sigue el texto de izquierda a derecha; recorre las zonas; se aleja
   para mostrar los quads y los minutos a la U.
   ===================================================================== */
const BAR = {x: 560, y: 492, w: 800, h: 96, r: 48};
const BAR_UP_Y = 110;
/* cada zona se escribe cuando la voz la dice, y se borra para la siguiente */
const ZONES = [
  {t: 'Antiguo Cuscatlán', type: 549, in: 567, sel: 570, del: 571},
  {t: 'La Sultana', type: 577, in: 588, sel: 591, del: 592},
  {t: 'Santa Tecla', type: 600, in: 612, sel: 615, del: Infinity},
];
const TYPE_AT = ZONES[0].type, TYPE_STEP = 1, DEL_SPEED = 3.4;
const typedAt = (f: number) => {
  let out = '';
  for (const z of ZONES) {
    if (f < z.type) break;
    const n = Math.min(z.t.length, Math.floor((f - z.type) / TYPE_STEP) + 1);
    out = f >= z.del ? z.t.slice(0, Math.max(0, z.t.length - Math.floor((f - z.del) * DEL_SPEED))) : z.t.slice(0, n);
  }
  return out;
};
const CHIP_Y = 610, CHIP_H = 72, CHIP_GAP = 18;
const chipW = (t: string) => textW(t, 28, 800, -0.01) + 36 + 10 + 54;
const chipX = (i: number) => {
  const ws = ZONES.map((z) => chipW(z.t));
  const total = ws.reduce((s, w) => s + w, 0) + CHIP_GAP * (ws.length - 1);
  return 960 - total / 2 + ws.slice(0, i).reduce((s, w) => s + w + CHIP_GAP, 0);
};
const CARDS = [
  {img: 'habitacion-amplia.jpg', title: 'Habitación amplia', zona: 'Antiguo Cuscatlán', min: 9, icon: 'car-fill', uni: 'ESEN', price: 125, rating: '4.9', hl: 672},
  {img: 'cuarto-familia.jpg', title: 'Quad en casa de familia', zona: 'Jardines de Guadalupe', min: 4, icon: 'walking-fill', uni: 'UCA', price: 115, rating: '4.8', hl: 682},
  {img: 'bano-propio.jpg', title: 'Quad con baño propio', zona: 'Col. La Sultana', min: 15, icon: 'bus-fill', uni: 'USAM', price: 140, rating: '4.6', hl: 692},
];
const CARD_W = 380, CARD_H = 500, CARD_Y = 300, CARD_GAP = 60;
const cardX = (i: number) => 960 - (CARD_W * 3 + CARD_GAP * 2) / 2 + i * (CARD_W + CARD_GAP);
const UP = 640, CARDS_IN = 648, EXPAND = 735, EXPANDED = 752;
const HERO = {x: 120, y: 140, w: 760, h: 800, r: 40};

const Search: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 492, x: 960, y: 540, s: 1},
    {t: 512, x: 960, y: 540, s: 1},
    {t: 540, x: 742, y: 545, s: 1.55, e: SMOOTH},
    {t: 549, x: 746, y: 545, s: 1.55},
    {t: 569, x: 900, y: 552, s: 1.55, e: GLIDE},
    {t: 578, x: 770, y: 552, s: 1.55, e: SMOOTH},
    {t: 592, x: 860, y: 552, s: 1.55, e: GLIDE},
    {t: 601, x: 770, y: 552, s: 1.55, e: SMOOTH},
    {t: 614, x: 870, y: 560, s: 1.55, e: GLIDE},
    {t: 628, x: 884, y: 562, s: 1.55, e: Easing.linear},
    {t: 662, x: 960, y: 540, s: 1.0, e: SMOOTH},
    {t: 664, x: 925, y: 548, s: 1.03, e: Easing.linear},
    {t: 704, x: 1000, y: 552, s: 1.05, e: Easing.linear},
    {t: 728, x: 960, y: 560, s: 1.12, e: SMOOTH},
    {t: 748, x: 960, y: 540, s: 1.0, e: SMOOTH},
  ];
  /* punto → buscador */
  const m = p(f, 495, 509, EASE_IO);
  const up = p(f, UP, UP + 14, EASE_IO);
  const barY = lerp(BAR.y, BAR_UP_Y, up);
  const rx = lerp(960 - DOT / 2, BAR.x, m), ry = lerp(540 - DOT / 2, barY, m);
  const rw = lerp(DOT, BAR.w, m), rh = lerp(DOT, BAR.h, m), rr = lerp(6, BAR.r, m);
  const barOut = ascentOut(f, EXPAND, 8, 220);
  const typed = typedAt(f);
  const caretX = BAR.x + 84 + textW(typed, 32, 500, 0) + 4;
  const caretOn = f >= 540 && f < UP && (ZONES.some((z) => f >= z.type && f < z.in + 2) || f >= z0del(f) || Math.floor((f - 540) / 8) % 2 === 0);
  const cap = ascentIn(f, 662, 10, 50);
  const capOut = ascentOut(f, EXPAND, 8, 200);
  return (
    <Shot f={f} id="search" keys={keys}>
      {/* tarjetas */}
      {f >= CARDS_IN && CARDS.map((c, i) => <Card key={i} f={f} i={i} c={c} />)}
      {f >= 662 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontSize: 42, fontWeight: 800,
          letterSpacing: '-0.02em', color: C.t1, ...fx(cap, capOut)}}>
          A <span style={{color: C.brand}}>minutos</span> de tu universidad
        </div>
      )}
      {/* el punto / buscador */}
      <div style={{position: 'absolute', left: rx, top: ry, width: rw, height: rh, borderRadius: rr,
        background: mix(C.brand, '#ffffff', m), border: m > 0.5 ? `2px solid ${f >= TYPE_AT && f < UP ? '#bcd0ff' : C.border}` : 'none',
        boxShadow: m > 0 ? `0 ${14 * m}px ${40 * m}px rgba(15,23,42,${0.08 * m})` : 'none', boxSizing: 'border-box',
        transform: `translateY(${barOut.y}px)`, opacity: barOut.o, filter: barOut.b ? `blur(${barOut.b}px)` : undefined, overflow: 'hidden'}}>
        {f >= 505 && (
          <>
            <div style={{position: 'absolute', left: 34, top: 30, opacity: tw(f, 505, 511, 0, 1), transform: `translateY(${tw(f, 505, 513, 20, 0)}px)`}}>
              <Icon name="search" size={34} color={C.t3} sw={2} />
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, opacity: tw(f, TYPE_AT - 3, TYPE_AT, 1, 0)}}>
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

const z0del = (f: number) => (ZONES.some((z) => f >= z.del && f < z.del + 6) ? f : Infinity);

const Card: React.FC<{f: number; i: number; c: typeof CARDS[number]}> = ({f, i, c}) => {
  const start = CARDS_IN + [4, 0, 8][i];
  const inn = ascentIn(f, start, 13, 320);
  const rot = tw(f, start, start + 16, (i - 1) * 6 || 3, 0);
  const isHero = i === 1;
  const exit = isHero ? NONE : ascentOut(f, EXPAND + (i === 0 ? 0 : 2), 8, 240);
  const e = isHero ? p(f, EXPAND, EXPANDED, EASE_IO) : 0;
  if (isHero && f >= EXPANDED) return null;
  const x = lerp(cardX(i), HERO.x, e), y = lerp(CARD_Y, HERO.y, e);
  const w = lerp(CARD_W, HERO.w, e), h = lerp(CARD_H, HERO.h, e), r = lerp(32, HERO.r, e);
  const infoO = 1 - p(f, EXPAND, EXPAND + 5);
  /* minutos: el badge aparece y cuenta cuando la voz dice "cuántos minutos" */
  const hl = p(f, c.hl, c.hl + 6);
  const hlS = spr(f, c.hl, 9, 260);
  const n = Math.max(1, Math.min(c.min, Math.ceil(p(f, c.hl, c.hl + 12, Easing.linear) * c.min)));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden',
      transform: `translateY(${inn.y + exit.y}px) rotate(${rot}deg)`, opacity: inn.o * exit.o, filter: inn.b + exit.b > 0.05 ? `blur(${inn.b + exit.b}px)` : undefined,
      boxShadow: '0 24px 60px rgba(15,23,42,0.14)', background: '#ddd'}}>
      <Photo src={c.img} style={{transform: `scale(${tw(f, start, start + 90, 1.16, 1.02)})`}} />
      <div style={{position: 'absolute', inset: 0, opacity: infoO,
        background: 'linear-gradient(180deg, rgba(15,23,42,0) 36%, rgba(15,23,42,0.84) 100%)'}}>
        <div style={{position: 'absolute', left: 20, top: 20, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px 7px 10px',
          borderRadius: 99, background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff', fontSize: 20, fontWeight: 800}}>
          <StarFill size={20} />{c.rating}
        </div>
        <div style={{position: 'absolute', left: 26, right: 22, bottom: 24, color: '#fff'}}>
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1}}>{c.title}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 19, fontWeight: 500, opacity: 0.9}}>
            <Icon name="map-pin-fill" size={20} color="#fff" />{c.zona}
          </div>
          <div style={{height: 44, marginTop: 8}}>
            {f >= c.hl && (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 800,
                padding: '8px 14px 8px 10px', marginLeft: -6, borderRadius: 99, background: `rgba(38,103,255,${hl})`,
                transform: `scale(${hlS})`, transformOrigin: 'left center'}}>
                <Icon name={c.icon} size={22} color="#fff" />{n} min a la {c.uni}
              </div>
            )}
          </div>
          <div style={{marginTop: 10, fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em'}}>
            ${c.price}<span style={{fontSize: 19, fontWeight: 500, opacity: 0.8}}> /mes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   5 · Mira las fotos y lo que incluye (752–836) — la cámara se acerca
   a la galería y luego se desliza hacia lo que incluye; sale en latigazo.
   ===================================================================== */
const COL = 980;
const AMENITIES = [
  {icon: 'wifi-fill', t: 'Wi-Fi', at: 798},
  {icon: 'bed-fill', t: 'Cuarto amueblado', at: 803},
  {icon: 'washing-fill', t: 'Lavandería', at: 808},
  {icon: 'cutlery-fill', t: 'Cocina compartida', at: 813},
];
const GALLERY = ['cuarto-familia.jpg', 'bano-propio.jpg', 'casa-martinez.jpg'];
const SWIPES = [768, 786];

const Detail: React.FC<{f: number}> = ({f}) => {
  if (f < EXPANDED) return null;
  const keys: Key[] = [
    {t: EXPANDED, x: 960, y: 540, s: 1},
    {t: 784, x: 600, y: 540, s: 1.16, e: SMOOTH},
    {t: 800, x: 1290, y: 610, s: 1.2, e: WHIP},
    {t: 818, x: 1310, y: 610, s: 1.2, e: Easing.linear},
    {t: 836, x: 2700, y: 610, s: 1.2, e: IN},
  ];
  const kb = tw(f, EXPANDED, 836, 1.02, 1.14, Easing.linear);
  const idx = SWIPES.filter((s) => f >= s).length;
  return (
    <Shot f={f} id="detail" keys={keys} opacity={1 - p(f, 830, 838, Easing.linear)}>
      <div style={{position: 'absolute', left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h, borderRadius: HERO.r,
        overflow: 'hidden', boxShadow: '0 24px 60px rgba(15,23,42,0.14)', background: '#ddd'}}>
        {GALLERY.map((g, i) => {
          /* cada foto entra empujando a la anterior */
          const inK = i === 0 ? 1 : p(f, SWIPES[i - 1], SWIPES[i - 1] + 10, EASE_IO);
          const outK = i < SWIPES.length ? p(f, SWIPES[i], SWIPES[i] + 10, EASE_IO) : 0;
          const xx = (1 - inK) * 100 - outK * 100;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${xx}%)`}}>
              <Photo src={g} style={{transform: `scale(${kb})`}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 28, bottom: 28, display: 'flex', gap: 12}}>
          <div style={{transform: `scale(${spr(f, 754)})`, transformOrigin: 'left bottom'}}><Pill><Icon name="community-fill" size={22} color={C.brand} />Casa de familia</Pill></div>
          <div style={{transform: `scale(${spr(f, 759)})`, transformOrigin: 'left bottom'}}><Pill><StarFill size={22} />4.8 · 12 reseñas</Pill></div>
        </div>
        <div style={{position: 'absolute', right: 28, bottom: 28, display: 'flex', gap: 8, alignItems: 'center', padding: '10px 16px',
          borderRadius: 99, background: 'rgba(15,23,42,0.55)', transform: `scale(${spr(f, 762)})`}}>
          {[0, 1, 2, 3, 4].map((d) => (
            <div key={d} style={{width: d === idx ? 26 : 10, height: 10, borderRadius: 9, background: d === idx ? '#fff' : 'rgba(255,255,255,0.5)'}} />
          ))}
        </div>
      </div>
      <RiseText text="Quad en casa de familia" f={f} start={754} stagger={0.4} size={62} x={COL} y={176} />
      <div style={{position: 'absolute', left: COL, top: 268, display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 500,
        color: C.t3, ...fx(ascentIn(f, 760, 10, 40))}}>
        <Icon name="map-pin-fill" size={28} color={C.brand} />Jardines de Guadalupe · 4 min a la UCA
      </div>
      <div style={{position: 'absolute', left: COL, top: 326, fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', color: C.t1,
        ...fx(ascentIn(f, 766, 10, 40))}}>
        $115<span style={{fontSize: 26, fontWeight: 500, color: C.t3}}> /mes</span>
      </div>
      <div style={{position: 'absolute', left: COL, top: 450, fontSize: 30, fontWeight: 800, color: C.t1, ...fx(ascentIn(f, 794, 9, 40))}}>
        Lo que incluye
      </div>
      {AMENITIES.map((a, i) => {
        const s = spr(f, a.at, 10, 240);
        const col = i % 2, row = Math.floor(i / 2);
        if (f < a.at) return null;
        return (
          <div key={i} style={{position: 'absolute', left: COL + col * 380, top: 510 + row * 136, width: 356, height: 116, borderRadius: 26,
            background: '#fff', border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px',
            boxSizing: 'border-box', transform: `scale(${s})`, transformOrigin: 'left center', boxShadow: '0 10px 30px rgba(15,23,42,0.05)'}}>
            <div style={{width: 64, height: 64, borderRadius: 20, background: C.brandSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name={a.icon} size={34} color={C.brand} />
            </div>
            <div style={{fontSize: 27, fontWeight: 800, color: C.t1, letterSpacing: '-0.01em'}}>{a.t}</div>
          </div>
        );
      })}
    </Shot>
  );
};

const AndreaAvatar: React.FC<{f: number}> = ({f}) => {
  const inn = ascentIn(f, 828, 10, 80);
  const ring = tw(f, 984, 996, 0, 7);
  return (
    <div style={{position: 'absolute', left: avX(0), top: AV_Y, width: AV, height: AV, borderRadius: 999, overflow: 'hidden',
      background: '#dce6ff', transform: `translateY(${inn.y}px) scale(${spr(f, 828)})`, opacity: inn.o,
      boxShadow: `0 0 0 ${ring}px ${C.brand}, 0 14px 34px rgba(15,23,42,0.12)`}}>
      <Photo src="andrea.jpg" />
    </div>
  );
};

export const Pill: React.FC<{children: React.ReactNode; big?: boolean}> = ({children, big}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: big ? '16px 26px 16px 20px' : '10px 18px 10px 14px',
    borderRadius: 99, background: '#fff', border: big ? `1.5px solid ${C.border}` : 'none', fontSize: big ? 26 : 20,
    fontWeight: 800, color: C.t1, whiteSpace: 'nowrap', boxShadow: big ? '0 8px 24px rgba(15,23,42,0.05)' : '0 6px 18px rgba(15,23,42,0.12)'}}>{children}</div>
);

/* =====================================================================
   6 · Conoce a la familia (825–1008) — entra desde la derecha; baja a
   "Aquí nadie llega a ciegas" (la palabra pasa de borrosa a nítida);
   sale con un zoom hacia Andrea, que se vuelve el encabezado del chat.
   ===================================================================== */
const MEMBERS = [
  {name: 'Andrea', rol: 'Anfitriona', img: 'andrea.jpg', tone: '#dce6ff'},
  {name: 'Rosa', rol: 'Mamá', img: 'rosa.jpg', tone: '#fce7f3'},
  {name: 'Carlos', rol: 'Papá', img: 'carlos.jpg', tone: '#dcfce7'},
  {name: 'Toby', rol: 'Perro', img: 'toby.jpg', tone: '#fdebd3'},
];
const AV = 150, AV_Y = 330, AV_STEP = 230;
const avX = (i: number) => 960 + (i - 1.5) * AV_STEP - AV / 2;
const RULES = [
  {icon: 'clock-fill', text: 'Llegada hasta las 10 p. m.', at: 872},
  {icon: 'cutlery-fill', text: 'Cocina libre hasta las 9 p. m.', at: 882},
  {icon: 'no-smoking-fill', text: 'No se fuma', at: 892},
];
const RULE_Y = 600;
const BLIND_Y = 830, BLIND_AT = 940;
const HEAD_AV = {x: 604, y: 140, s: 84};
const CHAT_S0 = 4.0;

/* Andrea pasa nítida de la familia al chat; lo demás se desenfoca */
export const HANDOFF = 1004;
const famKeys: Key[] = [
  {t: 820, x: -620, y: 420, s: 1.0},
  {t: 848, x: 960, y: 420, s: 1.0, e: OUT},
  {t: 932, x: 960, y: 444, s: 1.05, e: Easing.linear},
  {t: 958, x: 960, y: 700, s: 1.05, e: GLIDE},
  {t: 1010, x: 960, y: 712, s: 1.09, e: Easing.linear},
];
const andreaFrom = () => {
  const c = camAt(famKeys, HANDOFF);
  const s = toScreen(c, avX(0) + AV / 2, AV_Y + AV / 2);
  return {x: s.x, y: s.y, d: AV * c.s};
};

const Family: React.FC<{f: number}> = ({f}) => {
  const keys = famKeys;
  const away = {filter: `blur(${tw(f, 984, 1002, 0, 22, Easing.bezier(0.5, 0, 0.8, 1))}px)`, opacity: 1 - p(f, 992, 1006, Easing.linear)};
  const ruleWs = RULES.map((r) => textW(r.text, 26, 800, 0) + 96);
  const rulesTotal = ruleWs.reduce((s, w) => s + w, 0) + 24 * 2;
  const blindA = 'Aquí nadie llega a ', blindB = 'ciegas.';
  const wA = textW(blindA, 92), wB = textW(blindB, 92);
  const bx = 960 - (wA + wB) / 2;
  const unblur = tw(f, BLIND_AT + 18, BLIND_AT + 40, 16, 0, Easing.bezier(0.3, 0, 0.2, 1));
  const wTitle = textW('Conoce a la familia', 100);
  const wSub1 = textW('y sus reglas, ', 54), wSub2 = textW('antes de llegar', 54);
  return (
    <Shot f={f} id="family" keys={keys}>
      <div style={{position: 'absolute', inset: 0, ...away}}>
      <RiseText text="Conoce a la familia" f={f} start={834} stagger={0.5} size={100} x={960 - wTitle / 2} y={110} />
      <RiseText text="y sus reglas, " f={f} start={868} stagger={0.45} size={54} x={960 - (wSub1 + wSub2) / 2} y={236} color={C.t3} />
      <RiseText text="antes de llegar" f={f} start={902} stagger={0.45} size={54} x={960 - (wSub1 + wSub2) / 2 + wSub1} y={236} color={C.brand} />
      {MEMBERS.map((mb, i) => {
        const t = 828 + i * 4;
        if (f < t) return null;
        const inn = ascentIn(f, t, 10, 80);
        const s = spr(f, t);
        const ring = 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: avX(i), top: AV_Y, visibility: i === 0 ? 'hidden' : 'visible', width: AV, height: AV, borderRadius: 999, overflow: 'hidden',
              background: mb.tone, transform: `translateY(${inn.y}px) scale(${s})`, opacity: inn.o,
              boxShadow: `0 0 0 ${ring}px ${C.brand}, 0 14px 34px rgba(15,23,42,0.12)`}}>
              <Photo src={mb.img} />
            </div>
            <div style={{position: 'absolute', left: avX(i) - 30, top: AV_Y + AV + 18, width: AV + 60, textAlign: 'center', ...fx(ascentIn(f, t + 3, 10, 40))}}>
              <div style={{fontSize: 28, fontWeight: 800, color: C.t1}}>{mb.name}</div>
              <div style={{fontSize: 21, fontWeight: 500, color: C.t3, marginTop: 4}}>{mb.rol}</div>
            </div>
          </React.Fragment>
        );
      })}
      {RULES.map((r, i) => {
        if (f < r.at) return null;
        const x = 960 - rulesTotal / 2 + ruleWs.slice(0, i).reduce((s, w) => s + w + 24, 0);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: RULE_Y, transform: `scale(${spr(f, r.at, 10, 240)})`, transformOrigin: 'center'}}>
            <Pill big><Icon name={r.icon} size={28} color={C.brand} />{r.text}</Pill>
          </div>
        );
      })}
      <RiseText text={blindA} f={f} start={BLIND_AT} stagger={0.5} size={92} x={bx} y={BLIND_Y} />
      <div style={{position: 'absolute', inset: 0, filter: `blur(${unblur}px)`}}>
        <RiseText text={blindB} f={f} start={BLIND_AT + 14} stagger={0.8} size={92} x={bx + wA} y={BLIND_Y} color={C.brand} />
      </div>
      </div>
      {f >= 828 && f < HANDOFF && <AndreaAvatar f={f} />}
    </Shot>
  );
};

/* =====================================================================
   7 · Chat, visita y "acepta con un toque" (1000–1172) — la cámara
   sale del avatar, sigue la conversación y se acerca al botón; el
   botón se vuelve un check que crece hasta llenar la pantalla.
   ===================================================================== */
const PANEL = {x: 560, y: 100, w: 800, h: 880};
const MSG_BOTTOM = 940;
const MSGS = [
  {who: 'a', t: 1016, h: 108, text: '¡Hola, Sofía! Pregúntame lo que necesites.'},
  {who: 'y', t: 1034, h: 108, text: '¿Puedo usar la cocina después de clases?'},
  {who: 'a', t: 1054, h: 72, text: 'Sí, es libre hasta las 9 p. m.'},
  {who: 'y', t: 1070, h: 72, text: '¿Puedo ir a conocer la casa?'},
  {who: 'v', t: 1084, h: 204, text: ''},
];
const VISIT = {x: 604, w: 560};
const BTN = {x: VISIT.x + 26, y: MSG_BOTTOM - 26 - 68, w: 250, h: 68};
const BTN_C = {x: BTN.x + BTN.w / 2, y: BTN.y + BTN.h / 2};
const PRESS = 1141;
const FILL = 1158;

const Chat: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 998, x: 960, y: 540, s: 1.0},
    {t: 1030, x: 960, y: 540, s: 1.0},
    {t: 1080, x: 960, y: 566, s: 1.04, e: SMOOTH},
    {t: 1100, x: 900, y: 764, s: 1.3, e: SMOOTH},
    {t: 1112, x: 896, y: 772, s: 1.32, e: Easing.linear},
    {t: 1138, x: BTN_C.x, y: BTN_C.y, s: 1.85, e: GLIDE},
    {t: FILL, x: BTN_C.x, y: BTN_C.y, s: 1.95, e: Easing.linear},
    {t: 1174, x: BTN_C.x, y: BTN_C.y, s: 2.7, e: IN},
  ];
  const offsetFor = (i: number) => MSGS.slice(i + 1).reduce((s, mm) => s + (mm.h + 16) * p(f, mm.t, mm.t + 8, EASE), 0);
  const headO = ascentIn(f, 1010, 10, 30);
  return (
    <Shot f={f} id="chat" keys={keys}>
      <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 44,
        background: '#fff', boxShadow: '0 30px 80px rgba(15,23,42,0.12)', border: `1.5px solid ${C.border}`, overflow: 'hidden',
        ...fx(ascentIn(f, 1006, 14, 90))}}>
        <div style={{position: 'absolute', left: 140, top: 50, ...fx(headO)}}>
          <div style={{fontSize: 32, fontWeight: 800, color: C.t1, letterSpacing: '-0.02em'}}>Andrea Martínez</div>
          <div style={{fontSize: 22, fontWeight: 500, color: C.t3, marginTop: 6}}>Anfitriona · responde en minutos</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 160, height: 1.5, background: C.border, opacity: headO.o}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 162, bottom: 0, overflow: 'hidden'}}>
          {MSGS.map((mm, i) => {
            const k = p(f, mm.t, mm.t + 9);
            if (k <= 0) return null;
            const bottom = MSG_BOTTOM - offsetFor(i) - PANEL.y - 162;
            const s = spr(f, mm.t, 12, 260);
            const style: React.CSSProperties = {position: 'absolute', top: bottom - mm.h, height: mm.h,
              transform: `translateY(${(1 - k) * 50}px) scale(${lerp(0.8, 1, s)})`, opacity: tw(f, mm.t, mm.t + 4, 0, 1),
              transformOrigin: mm.who === 'y' ? 'bottom right' : 'bottom left'};
            if (mm.who === 'v') return <Visit key={i} f={f} style={{...style, left: VISIT.x - PANEL.x, width: VISIT.w}} />;
            const mine = mm.who === 'y';
            return (
              <div key={i} style={{...style, ...(mine ? {right: 40} : {left: 44}), display: 'flex', alignItems: 'flex-end'}}>
                <div style={{maxWidth: 470, padding: '18px 26px', fontSize: 26, lineHeight: '36px', fontWeight: 500,
                  borderRadius: mine ? '28px 28px 8px 28px' : '28px 28px 28px 8px',
                  background: mine ? C.brand : '#eef2f7', color: mine ? '#fff' : C.t1}}>{mm.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      {f >= HANDOFF && <FlyingAvatar f={f} from={andreaFrom()} to={{x: HEAD_AV.x + HEAD_AV.s / 2, y: HEAD_AV.y + HEAD_AV.s / 2, d: HEAD_AV.s}} />}
      {f >= PRESS - 1 && <AcceptMorph f={f} />}
    </Shot>
  );
};

export const Visit: React.FC<{f: number; style: React.CSSProperties}> = ({f, style}) => (
  <div style={{...style, borderRadius: 30, border: `1.5px solid ${C.border}`, background: '#fff', padding: 26, boxSizing: 'border-box',
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 500, color: C.t3}}>
      <Icon name="calendar-fill" size={24} color={C.brand} />Visita propuesta
    </div>
    <div style={{fontSize: 30, fontWeight: 800, color: C.t1, marginTop: 10, letterSpacing: '-0.02em'}}>Sáb 7 de nov · 10:00 a. m.</div>
    <div style={{position: 'absolute', left: 26, bottom: 26, display: 'flex', gap: 14}}>
      <div style={{width: BTN.w, height: BTN.h, borderRadius: 18, background: f < PRESS ? C.brand : 'transparent', color: '#fff',
        fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: f < PRESS ? `0 0 0 ${6 * Math.max(0, Math.sin(Math.max(0, f - 1112) / 6))}px rgba(38,103,255,0.18)` : 'none'}}>{f < PRESS ? 'Aceptar' : ''}</div>
      <div style={{width: 230, height: BTN.h, borderRadius: 18, border: `1.5px solid ${C.border}`, color: C.t1,
        fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Otra fecha</div>
    </div>
  </div>
);

/** El avatar viaja nítido de la familia al encabezado del chat. */
export const FlyingAvatar: React.FC<{f: number; from: {x: number; y: number; d: number}; to: {x: number; y: number; d: number}}> = ({f, from, to}) => {
  const k = p(f, HANDOFF, HANDOFF + 22, EASE_IO);
  const arc = -60 * Math.sin(k * Math.PI);
  const x = lerp(from.x, to.x, k), y = lerp(from.y, to.y, k) + arc, d = lerp(from.d, to.d, k);
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 999, overflow: 'hidden',
      background: '#dce6ff', boxShadow: `0 0 0 ${lerp(7, 0, p(f, HANDOFF + 8, HANDOFF + 24))}px ${C.brand}, 0 ${lerp(14, 4, k)}px ${lerp(34, 10, k)}px rgba(15,23,42,0.14)`}}>
      <Photo src="andrea.jpg" />
    </div>
  );
};

/** Aceptar → toque → check blanco → la cámara entra al check y la pantalla queda en blanco. */
export const AcceptMorph: React.FC<{f: number; at?: {x: number; y: number}}> = ({f, at}) => {
  const BC = at ?? BTN_C;
  const press = f < PRESS + 4 ? tw(f, PRESS, PRESS + 3, 1, 0.92) : tw(f, PRESS + 3, PRESS + 11, 0.92, 1);
  const c = p(f, PRESS + 3, PRESS + 13, EASE_IO);
  const g = p(f, FILL, 1167, Easing.bezier(0.55, 0, 0.85, 0.4));
  const w = lerp(BTN.w, 76, c), h = lerp(BTN.h, 76, c);
  const r = lerp(18, 38, c);
  const white = p(f, FILL + 3, 1168, Easing.bezier(0.6, 0, 0.9, 0.5));
  const ripple = p(f, PRESS, PRESS + 16, Easing.out(Easing.quad));
  return (
    <>
      <div style={{position: 'absolute', left: BC.x - 90 * ripple, top: BC.y - 90 * ripple, width: 180 * ripple, height: 180 * ripple,
        borderRadius: 999, border: `3px solid ${C.brand}`, opacity: 0.6 * (1 - ripple)}} />
      <div style={{position: 'absolute', left: BC.x - w / 2, top: BC.y - h / 2, width: w, height: h, borderRadius: r, background: C.brand,
        transform: `scale(${press})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(38,103,255,0.35)'}}>
        <div style={{position: 'absolute', color: '#fff', fontSize: 24, fontWeight: 800, opacity: 1 - p(f, PRESS + 2, PRESS + 6)}}>Aceptar</div>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" style={{position: 'absolute', overflow: 'visible',
          transform: `scale(${1 + g * 14})`}}>
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={22} strokeDashoffset={22 * tw(f, PRESS + 9, PRESS + 18, 1, 0)} />
        </svg>
      </div>
      {white > 0 && (
        <div style={{position: 'absolute', left: BC.x - 1200 * white, top: BC.y - 6 - 1200 * white, width: 2400 * white, height: 2400 * white,
          borderRadius: 9999, background: C.bg}} />
      )}
    </>
  );
};

/* =====================================================================
   8 · Cuenta institucional (1170–1452) — el azul se encoge hasta el
   ícono de la tarjeta de estudiantes; la cámara sigue el correo que se
   escribe; latigazo a la tarjeta de anfitriones; se aleja para ver ambas.
   ===================================================================== */
const STUD = {x: 240, y: 250, w: 680, h: 600};
const HOST = {x: 1000, y: 250, w: 680, h: 600};
const ICON_S = 96;
const iconC = (c: typeof STUD) => ({x: c.x + 56 + ICON_S / 2, y: c.y + 56 + ICON_S / 2});
const MAIL_S = 'sofia.ramirez@uca.edu.sv', MAIL_H = 'andrea.martinez@ues.edu.sv';
const DOMAIN = '@uca.edu.sv';
const TYPE_S = 1228, TYPE_H = 1336;
const OK_S = 1278, OK_H = 1370;
const PUBLISH = 1398;

const Access: React.FC<{f: number}> = ({f}) => {
  const keys: Key[] = [
    {t: 1170, x: 560, y: 500, s: 1.7},
    {t: 1198, x: 560, y: 500, s: 1.25, e: OUT},
    {t: 1220, x: 530, y: 545, s: 1.3, e: SMOOTH},
    {t: 1230, x: 440, y: 636, s: 1.62, e: GLIDE},
    {t: 1270, x: 760, y: 636, s: 1.62, e: GLIDE},
    {t: 1294, x: 580, y: 560, s: 1.22, e: SMOOTH},
    {t: 1310, x: 596, y: 560, s: 1.2, e: Easing.linear},
    {t: 1328, x: 1340, y: 560, s: 1.22, e: WHIP},
    {t: 1338, x: 1196, y: 636, s: 1.62, e: SMOOTH},
    {t: 1372, x: 1530, y: 636, s: 1.62, e: GLIDE},
    {t: 1392, x: 1330, y: 640, s: 1.32, e: SMOOTH},
    {t: 1414, x: 960, y: 550, s: 0.95, e: SMOOTH},
    {t: 1438, x: 960, y: 550, s: 0.92, e: Easing.linear},
    {t: 1452, x: 960, y: 1550, s: 0.92, e: IN},
  ];
  return (
    <Shot f={f} id="access" keys={keys} opacity={1 - p(f, 1446, 1454, Easing.linear)}>
      <AccessCard f={f} c={STUD} icon="user-solid" tag="Estudiantes" l1="Ingresa con tu cuenta" l2="institucional"
        t1={1209} t2={1222} mail={MAIL_S} typeAt={TYPE_S} okAt={OK_S} note="Solo correos @uca.edu.sv" iconIn={1182} />
      {f >= 1300 && (
        <AccessCard f={f} c={HOST} icon="home-solid" tag="Anfitriones" l1="Ofrece tu espacio con" l2="tu correo institucional"
          t1={1312} t2={1326} mail={MAIL_H} typeAt={TYPE_H} okAt={OK_H} button iconIn={1306} />
      )}
    </Shot>
  );
};

export const AccessCard: React.FC<{
  f: number; c: typeof STUD; icon: string; tag: string; l1: string; l2: string; t1: number; t2: number;
  mail: string; typeAt: number; okAt: number; note?: string; button?: boolean; iconIn: number;
}> = ({f, c, icon, tag, l1, l2, t1, t2, mail, typeAt, okAt, note, button, iconIn}) => {
  const cardIn = button ? ascentIn(f, 1300, 12, 120) : ascentIn(f, 1170, 14, 120);
  const cardO = 1;
  const n = Math.max(0, Math.min(mail.length, Math.floor((f - typeAt) / 1.45) + 1));
  const typed = f >= typeAt ? mail.slice(0, n) : '';
  const at = mail.indexOf('@');
  const ok = p(f, okAt, okAt + 6);
  const FX = c.x + 48, FY = c.y + 340, FW = c.w - 96, FH = 88;
  const caretX = FX + 74 + textW(typed, 30, 500, 0) + 3;
  const caretOn = f >= typeAt - 10 && f < okAt && (f < typeAt || Math.floor(f / 7) % 2 === 0 || f < typeAt + mail.length * 1.45);
  const iconS = spr(f, iconIn, 10, 220);
  const pressK = f >= PUBLISH ? (f < PUBLISH + 4 ? tw(f, PUBLISH, PUBLISH + 3, 1, 0.93) : tw(f, PUBLISH + 3, PUBLISH + 11, 0.93, 1)) : 1;
  const done = p(f, PUBLISH + 4, PUBLISH + 12);
  return (
    <div style={{position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, borderRadius: 40, background: '#fff',
      border: `1.5px solid ${C.border}`, boxShadow: '0 30px 80px rgba(15,23,42,0.10)', boxSizing: 'border-box',
      transform: `translateY(${cardIn.y}px)`, opacity: cardIn.o * cardO, filter: cardIn.b > 0.05 ? `blur(${cardIn.b}px)` : undefined}}>
      <div style={{position: 'absolute', left: 56, top: 56, width: ICON_S, height: ICON_S, borderRadius: 999, background: C.brand,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${iconS})`}}>
        <Icon name={icon} size={48} color="#fff" />
      </div>
      <div style={{position: 'absolute', left: 176, top: 82, transform: `scale(${spr(f, t1 - 6, 10, 240)})`, transformOrigin: 'left center'}}>
        <div style={{padding: '10px 20px', borderRadius: 99, background: C.brandSoft, color: C.brand, fontSize: 24, fontWeight: 800}}>{tag}</div>
      </div>
      <RiseText text={l1} f={f} start={t1} stagger={0.4} size={46} x={56} y={190} />
      <RiseText text={l2} f={f} start={t2} stagger={0.4} size={46} x={56} y={248} accentFrom={l2.indexOf('institucional')} />
      {/* campo de correo */}
      <div style={{position: 'absolute', left: FX - c.x, top: FY - c.y, width: FW, height: FH, borderRadius: 24, boxSizing: 'border-box',
        border: `2px solid ${f >= typeAt - 8 ? mix('#bcd0ff', C.brand, ok) : C.border}`, background: '#fff',
        opacity: p(f, typeAt - 12, typeAt - 4), transform: `translateY(${tw(f, typeAt - 12, typeAt - 2, 24, 0)}px)`}}>
        <div style={{position: 'absolute', left: 26, top: 26}}><Icon name="mail" size={34} color={C.t3} /></div>
        <div style={{position: 'absolute', left: 74, top: 29, fontSize: 30, fontWeight: 500, whiteSpace: 'pre', lineHeight: 1, color: C.t1}}>
          {typed.slice(0, at < 0 ? typed.length : Math.min(typed.length, at))}
          <span style={{color: mix(C.t1, C.brand, ok), fontWeight: ok > 0.5 ? 800 : 500}}>{typed.length > at ? typed.slice(at) : ''}</span>
        </div>
        <div style={{position: 'absolute', right: 18, top: 18, width: 52, height: 52, borderRadius: 99, background: C.brand,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${f >= okAt ? spr(f, okAt, 9, 260) : 0})`}}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3.2}
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray={22} strokeDashoffset={22 * tw(f, okAt + 3, okAt + 11, 1, 0)} /></svg>
        </div>
      </div>
      {caretOn && f < okAt && <div style={{position: 'absolute', left: caretX - c.x, top: FY - c.y + 22, width: 3, height: 44, background: C.brand, borderRadius: 2}} />}
      {note && f >= okAt + 6 && (
        <div style={{position: 'absolute', left: 56, top: 466, display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 500,
          color: C.t3, ...fx(ascentIn(f, okAt + 6, 10, 30))}}>
          <Icon name="shield-check-fill" size={30} color={C.brand} style={{['--icon-cut' as any]: '#fff'}} />
          Solo correos <span style={{color: C.brand, fontWeight: 800}}>{DOMAIN}</span>
        </div>
      )}
      {button && f >= okAt + 4 && (
        <div style={{position: 'absolute', left: 48, top: 462, height: 76, padding: '0 30px', borderRadius: 22, display: 'flex', alignItems: 'center',
          gap: 12, background: mix(C.brand, '#16a34a', done * 0), color: '#fff', fontSize: 26, fontWeight: 800,
          transform: `scale(${spr(f, okAt + 4, 10, 240) * pressK})`, transformOrigin: 'left center', boxShadow: '0 12px 30px rgba(38,103,255,0.3)'}}>
          <Icon name={done > 0.5 ? 'check' : 'plus'} size={30} color="#fff" sw={2.6} />{done > 0.5 ? 'Quad publicado' : 'Publicar mi quad'}
        </div>
      )}
    </div>
  );
};

/* =====================================================================
   9 · Seguridad (1440–1600) — entra desde abajo; la cámara empieza
   cerca del escudo, recorre las tres ideas con una inclinación 3D y se
   aleja en "todo dentro de Quad". El escudo se vuelve el punto.
   ===================================================================== */
const BADGE = {cx: 560, cy: 520, s: 280, r: 80};
const SAFE_X = 800;
const SAFE_ROWS = [
  {icon: 'user-solid', t: 'Identidades verificadas', at: 1460, y: 300},
  {icon: 'doc', t: 'Contrato', at: 1503, y: 420},
  {icon: 'dollar-circle-fill', t: 'Pagos', at: 1520, y: 540},
];
const ALL_IN = 1543, SAFE_OUT = 1586;
const safeKeys: Key[] = [
  {t: 1436, x: 960, y: -420, s: 1.05},
  {t: 1462, x: 700, y: 470, s: 1.34, ry: 10, e: OUT},
  {t: 1500, x: 920, y: 420, s: 1.28, ry: 4, e: Easing.linear},
  {t: 1530, x: 1160, y: 470, s: 1.22, ry: -6, e: GLIDE},
  {t: 1558, x: 990, y: 548, s: 1.0, ry: 0, e: SMOOTH},
  {t: 1586, x: 975, y: 545, s: 1.03, e: Easing.linear},
  {t: 1600, x: 960, y: 540, s: 1.0, e: SMOOTH},
];

const Safe: React.FC<{f: number}> = ({f}) => {
  const ex = (k: number) => ascentOut(f, SAFE_OUT + k, 8, 200);
  /* el escudo se vuelve el cursor de la última frase */
  const cam = camAt(safeKeys, 1600);
  const L = sentenceLayout(1600);
  const target = toWorld(cam, L.l1x, L.dot1Y + DOT / 2);
  const d = p(f, SAFE_OUT + 2, 1600, EASE_IO);
  const bIn = ascentIn(f, 1446, 12, 160);
  const bS = spr(f, 1446, 10, 200);
  const cx = lerp(BADGE.cx, target.x + DOT / 2, d), cy = lerp(BADGE.cy, target.y, d);
  const s = lerp(BADGE.s, DOT, d), r = lerp(BADGE.r, 6, d);
  return (
    <Shot f={f} id="safe" keys={safeKeys} opacity={p(f, 1440, 1448, Easing.linear)}>
      {SAFE_ROWS.map((row, i) => {
        if (f < row.at) return null;
        const inn = ascentIn(f, row.at, 10, 60);
        const tile = spr(f, row.at, 10, 240);
        const chk = spr(f, row.at + 12, 9, 260);
        const tw_ = textW(row.t, 56);
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...fx(inn, ex(i))}}>
            <div style={{position: 'absolute', left: SAFE_X, top: row.y, width: 92, height: 92, borderRadius: 28, background: C.brandSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tile})`}}>
              {row.icon === 'doc' ? <DocIcon f={f} at={row.at} /> : <Icon name={row.icon} size={46} color={C.brand} />}
            </div>
            <RiseText text={row.t} f={f} start={row.at + 2} stagger={0.45} size={56} x={SAFE_X + 124} y={row.y + 18} />
            <div style={{position: 'absolute', left: SAFE_X + 124 + tw_ + 22, top: row.y + 20, transform: `scale(${chk})`}}>
              <Icon name="check-circle-fill" size={52} color={C.brand} style={{['--icon-cut' as any]: '#fff'}} />
            </div>
          </div>
        );
      })}
      {f >= ALL_IN && (
        <div style={{position: 'absolute', inset: 0, ...fx(NONE, ex(3))}}>
          <RiseText text="Todo dentro de Quad." f={f} start={ALL_IN} stagger={0.5} size={84} x={SAFE_X} y={690} accentFrom={15} accentTo={18} />
        </div>
      )}
      {f >= 1446 && (
        <div style={{position: 'absolute', left: cx - s / 2, top: cy - s / 2, width: s, height: s, borderRadius: r,
          background: 'radial-gradient(120% 120% at 25% 15%, #4a82ff 0%, #2667ff 55%, #1a4fd6 100%)',
          transform: `translateY(${bIn.y * (1 - d)}px) scale(${d > 0 ? 1 : bS})`, opacity: bIn.o,
          boxShadow: `0 ${30 * (1 - d)}px ${70 * (1 - d)}px rgba(38,103,255,${0.35 * (1 - d)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: 1 - p(f, SAFE_OUT, SAFE_OUT + 6), transform: `scale(${tw(f, 1452, 1466, 0.5, 1)}) rotate(${tw(f, 1452, 1466, -18, 0)}deg)`}}>
            <Icon name="shield-check-fill" size={150} color="#fff" style={{['--icon-cut' as any]: C.brand}} />
          </div>
        </div>
      )}
    </Shot>
  );
};

export const DocIcon: React.FC<{f: number; at: number}> = ({f, at}) => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none">
    <path d="M6 2.8h8l4.2 4.2v13.2c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V3.8c0-.6.4-1 1-1z" fill={C.brand} />
    <path d="M14 2.8V7h4.2" fill="#9db8ff" />
    {[10.5, 13.5, 16.5].map((y, i) => (
      <path key={i} d={`M8 ${y}h${i === 2 ? 5 : 8}`} stroke="#fff" strokeWidth={1.6} strokeLinecap="round"
        strokeDasharray={9} strokeDashoffset={9 * tw(f, at + 6 + i * 3, at + 12 + i * 3, 1, 0)} />
    ))}
  </svg>
);

/* =====================================================================
   10 · Hecho para estudiantes foráneos y para familias que abren su
   casa (1600–1720) — la cámara lee la frase de izquierda a derecha y el
   punto azul va al frente del texto, como cursor.
   ===================================================================== */
type Word = {t?: string; img?: string; at: number; accent?: boolean};
const LINE1: Word[] = [
  {t: 'Hecho', at: 1607}, {t: 'para', at: 1615}, {img: 'sofia.jpg', at: 1622},
  {t: 'estudiantes', at: 1626, accent: true}, {t: 'foráneos', at: 1641, accent: true},
];
const LINE2: Word[] = [
  {t: 'y', at: 1657}, {t: 'para', at: 1661}, {img: 'andrea.jpg', at: 1668}, {t: 'familias', at: 1671, accent: true},
  {t: 'que', at: 1684}, {t: 'abren', at: 1689}, {t: 'su', at: 1696}, {t: 'casa', at: 1700},
];
const S_SIZE = 84, S_GAP = 24, S_IMG = 104;
const L1_TOP = 404, L2_TOP = 530;
const SENT_OUT = 1722, DOT_Q = 1734;

const sentenceLayout = (f: number) => {
  const wOf = (w: Word) => (w.t ? textW(w.t, S_SIZE) : S_IMG);
  const lineW = (ws: Word[]) => ws.reduce((s, w) => s + wOf(w), 0) + S_GAP * (ws.length - 1);
  const W1 = lineW(LINE1), W2 = lineW(LINE2) + DOT_GAP + DOT;
  const l1x = 960 - W1 / 2, l2x = 960 - W2 / 2;
  const place = (ws: Word[], x0: number) => {
    let acc = x0;
    return ws.map((w) => { const x = acc; acc += wOf(w) + S_GAP; return {...w, x, w: wOf(w)}; });
  };
  const P1 = place(LINE1, l1x), P2 = place(LINE2, l2x);
  /* el cursor va al final de la última palabra que ya apareció */
  const front = (P: ReturnType<typeof place>, x0: number) =>
    P.reduce((x, it) => lerp(x, it.x + it.w + (it === P[P.length - 1] ? DOT_GAP : S_GAP / 2 - DOT / 2), p(f, it.at, it.at + 7, EASE)), x0 - DOT - 6);
  const dot1Y = L1_TOP + S_SIZE * 0.83 - DOT, dot2Y = L2_TOP + S_SIZE * 0.83 - DOT;
  const onL2 = p(f, LINE2[0].at - 4, LINE2[0].at + 6, EASE_IO);
  const dx = lerp(front(P1, l1x), front(P2, l2x), onL2);
  const dy = lerp(dot1Y, dot2Y, onL2);
  return {P1, P2, l1x: l1x - DOT - 6, dot1Y, dx, dy, W1, W2, l2x};
};

const Sentence: React.FC<{f: number}> = ({f}) => {
  const L = sentenceLayout(f);
  const keys: Key[] = [
    {t: 1598, x: 960, y: 540, s: 1},
    {t: 1601, x: 960, y: 540, s: 1},
    {t: 1618, x: 790, y: 482, s: 1.12, e: SMOOTH},
    {t: 1652, x: 1110, y: 482, s: 1.12, e: GLIDE},
    {t: 1672, x: 830, y: 590, s: 1.12, e: SMOOTH},
    {t: 1704, x: 1110, y: 590, s: 1.12, e: GLIDE},
    {t: 1716, x: 960, y: 540, s: 1.0, e: SMOOTH},
  ];
  const all = [...L.P1.map((it) => ({...it, top: L1_TOP, line: 1})), ...L.P2.map((it) => ({...it, top: L2_TOP, line: 2}))];
  /* el punto final viaja a la pieza pequeña de la Q */
  const q = p(f, SENT_OUT, DOT_Q, EASE_IO);
  const ss = SMALL.s * K0;
  const x = lerp(L.dx, MARK0.x + SMALL.x * K0, q), y = lerp(L.dy, MARK0.y + SMALL.y * K0, q);
  const sz = lerp(DOT, ss, q), rr = lerp(6, 0, q);
  return (
    <Shot f={f} id="sentence" keys={keys}>
      {all.map((it, i) => {
        if (f < it.at) return null;
        const e = ascentOut(f, SENT_OUT - 4 + i * 0.5, 8, 200);
        const color = it.accent ? C.brand : C.t1;
        if (it.img) {
          const s = spr(f, it.at, 10, 240);
          return (
            <div key={i} style={{position: 'absolute', left: it.x, top: it.top + S_SIZE * 0.5 - S_IMG / 2 + 4, width: S_IMG, height: S_IMG,
              borderRadius: 26, overflow: 'hidden', transform: `translateY(${e.y}px) scale(${s}) rotate(${tw(f, it.at, it.at + 12, -14, it.line === 1 ? -4 : 4)}deg)`,
              boxShadow: '0 12px 30px rgba(15,23,42,0.18)', opacity: e.o, filter: e.b ? `blur(${e.b}px)` : undefined}}>
              <Photo src={it.img} />
            </div>
          );
        }
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...fx(e)}}>
            <RiseText text={it.t!} f={f} start={it.at} stagger={0.5} size={S_SIZE} x={it.x} y={it.top} color={color} />
          </div>
        );
      })}
      {f >= 1600 && f < DOT_Q + 2 && (
        <div style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: rr, background: C.brand}} />
      )}
    </Shot>
  );
};

/* =====================================================================
   11 · Tu lugar cerca de la U (1712–1890) — encaja la Q, barrido azul
   de abajo hacia arriba y logo.
   ===================================================================== */
const K0 = 7;
const MARK0 = {x: 960 - 26 * K0, y: 540 - 26 * K0};
const BIG_AT = 1726, LOCK = 1736, WIPE = 1740;

const Finale: React.FC<{f: number}> = ({f}) => {
  const big = ascentIn(f, BIG_AT, 10, 160);
  const bigS = spr(f, BIG_AT, 9, 220);
  const lock = f < LOCK ? 1 : tw(f, LOCK, LOCK + 8, 1.07, 1);
  const wp = p(f, WIPE, WIPE + 13, EASE_IO);
  const clipTop = (1 - wp) * 100;
  const rad = lerp(220, 0, wp);
  const word = 'Quad';
  const WS = 190;
  const wW = textW(word, WS);
  const k1 = 5.2;
  const period = 40;
  const total = PIECE * k1 + 50 + wW + 14 + period;
  const gx = 960 - total / 2;
  const cy = 470;
  const s = p(f, WIPE + 15, WIPE + 29, EASE_IO);
  const k = lerp(K0, k1, s);
  const ox = lerp(MARK0.x, gx - PIECE0 * k1, s), oy = lerp(MARK0.y, cy - 26 * k1, s);
  const wordX = gx + PIECE * k1 + 50;
  const wordTop = cy - WS * 0.53;
  const per = spr(f, WIPE + 36, 9, 240);
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
      <div style={{position: 'absolute', top: -80, left: -80, right: -80, bottom: -80, clipPath: `inset(${clipTop}% 0 0 0 round ${rad}px ${rad}px 0 0)`,
        background: 'radial-gradient(120% 120% at 25% 15%, #4a82ff 0%, #2667ff 48%, #1a4fd6 100%)'}}>
        <div style={{position: 'absolute', top: 80, left: 80, width: 1920, height: 1080, transform: `scale(${endZoom})`}}>
          <Mark color="#fff" />
          {f >= WIPE + 15 && (
            <>
              <RiseText text={word} f={f} start={WIPE + 25} stagger={2} size={WS} x={wordX} y={wordTop} color="#fff" ghost="#9db8ff" />
              <div style={{position: 'absolute', left: wordX + wW + 14, top: cy + WS * 0.42 - period, width: period, height: period,
                background: '#fff', borderRadius: 7, transform: `scale(${per})`}} />
              <RiseText text="Tu lugar cerca de la U." f={f} start={WIPE + 38} stagger={0.5} size={64} x={0} y={650} width={1920}
                align="center" color="#fff" ghost="#9db8ff" />
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
