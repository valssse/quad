import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, EASE, EASE_IO, tw, p, lerp, mix, ascentIn, ascentOut, textW} from './theme';
import {Icon, StarFill, RiseText, Photo, BIG_PIECE, SMALL} from './ui';

/* =====================================================================
   Quad · Video promocional v2 (28 s · 1920×1080 · 30 fps · 120 BPM)

   Hilo conductor: el punto azul (la pieza pequeña del logo de Quad).
   Es el punto final de cada frase, se vuelve el buscador, el botón
   "Aceptar", el escudo, el cursor de la última frase y al final encaja
   en la Q: encontró su lugar.

   Ritmo: un pulso = 15 frames. Cada corte cae en un pulso y en cada
   segundo pasa algo (texto, cámara, foto, ícono).
   ===================================================================== */

export const DURATION = 840;
const spr = (f: number, t: number, damping = 11, stiffness = 210) =>
  spring({frame: f - t, fps: 30, config: {damping, stiffness, mass: 0.6}});
type Fx = {y: number; o: number; b: number};
const fx = (a: Fx, b: Fx = {y: 0, o: 1, b: 0}): React.CSSProperties => ({
  transform: `translateY(${a.y + b.y}px)`, opacity: a.o * b.o, filter: `blur(${a.b + b.b}px)`,
});
const NONE: Fx = {y: 0, o: 1, b: 0};

/* ---------- Escena 1 · Gancho (0–120) ---------- */
const H_SIZE = 92, H_TOP = 488, DOT = 22, DOT_GAP = 10;
const LINE_A = 'Llegaste a estudiar a la capital';
const LINE_B = 'Ahora falta tu lugar';
const QS = [
  {t: 40, text: '¿Dónde vas a vivir?'},
  {t: 55, text: '¿Con quién?'},
  {t: 70, text: '¿Es seguro?'},
];
const Q_STEP = 120;
const PARK = {x: 960 - DOT / 2, y: 640};

/* ---------- Escena 2 · Buscar (120–228) ---------- */
const BAR = {x: 560, y: 492, w: 800, h: 96, r: 48};
const BAR_UP_Y = 150;
const TYPED = 'Antiguo Cuscatlán';
const CARDS = [
  {img: 'habitacion-amplia.jpg', title: 'Habitación amplia', zona: 'Antiguo Cuscatlán', walk: '9 min a la Peatonal', price: 125, rating: '4.9'},
  {img: 'cuarto-familia.jpg', title: 'Quad en casa de familia', zona: 'Jardines de Guadalupe', walk: '4 min a la Peatonal', price: 115, rating: '4.8'},
  {img: 'bano-propio.jpg', title: 'Quad con baño propio', zona: 'Col. La Sultana', walk: '6 min a la Peatonal', price: 140, rating: '4.6'},
];
const CARD_W = 380, CARD_H = 500, CARD_Y = 316, CARD_GAP = 60;
const cardX = (i: number) => 960 - (CARD_W * 3 + CARD_GAP * 2) / 2 + i * (CARD_W + CARD_GAP);
const EXPAND = 210;

/* ---------- Escena 3 · Detalle (224–404) ---------- */
const HERO = {x: 120, y: 140, w: 760, h: 800, r: 40};
const COL = 980;
const MEMBERS = [
  {name: 'Andrea', rol: 'Anfitriona', img: 'andrea.jpg', tone: '#dce6ff'},
  {name: 'Rosa', rol: 'Mamá', img: 'rosa.jpg', tone: '#fce7f3'},
  {name: 'Carlos', rol: 'Papá', img: 'carlos.jpg', tone: '#dcfce7'},
  {name: 'Toby', rol: 'Perro', img: 'toby.jpg', tone: '#fdebd3'},
];
const AV = 132, AV_Y = 400, AV_STEP = 196;
const RULES = [
  {icon: 'clock-fill', text: 'Llegada hasta las 10 p. m.'},
  {icon: 'cutlery-fill', text: 'Cocina libre hasta las 9 p. m.'},
  {icon: 'group-fill', text: 'Visitas en la sala hasta las 8 p. m.'},
];
const ROUTE = {y: 600, x1: 1010, x2: 1600};
const FAM = 292;     /* entra "Conoce a la familia" */
const TO_CHAT = 392; /* sale el detalle */

/* ---------- Escena 4 · Chat (392–528) ---------- */
const PANEL = {x: 560, y: 100, w: 800, h: 880};
const HEAD_AV = {x: 604, y: 140, s: 84};
const MSG_BOTTOM = 940;
const MSGS = [
  {who: 'a', t: 414, h: 108, text: '¡Hola, Sofía! Pregúntame lo que necesites.'},
  {who: 'y', t: 426, h: 108, text: '¿Puedo usar la cocina después de clases?'},
  {who: 'a', t: 440, h: 72, text: 'Sí, es libre hasta las 9 p. m.'},
  {who: 'y', t: 452, h: 72, text: '¿Puedo ir a conocer la casa?'},
  {who: 'v', t: 466, h: 204, text: ''},
];
const VISIT = {x: 604, w: 560};
const BTN = {x: VISIT.x + 26, y: MSG_BOTTOM - 26 - 68, w: 250, h: 68};
const PRESS = 490;
const CHAT_OUT = 512;

/* ---------- Escena 5 · Seguro (512–612) ---------- */
const BADGE = {cx: 640, cy: 540, s: 232, r: 68};
const SAFE = ['Identidad verificada', 'Contrato dentro de la app', 'Pagos dentro de la app'];
const SAFE_OUT = 600;

/* ---------- Escena 6 · Para quién (600–716) ---------- */
const S_SIZE = 84, S_TOP = 488, S_GAP = 24, S_IMG = 110, ANCHOR = 1400;
const WORDS: {t?: string; img?: string; at: number; accent?: boolean}[] = [
  {t: 'Hecho', at: 618},
  {t: 'para', at: 625},
  {img: 'sofia.jpg', at: 632},
  {t: 'estudiantes', at: 638, accent: true},
  {t: 'y', at: 650},
  {img: 'andrea.jpg', at: 656},
  {t: 'familias', at: 662, accent: true},
];
const CENTER_AT = 678;
const SENT_OUT = 700;

/* ---------- Escena 7 · Tu lugar (700–840) ---------- */
const K0 = 7;
const MARK0 = {x: 960 - 26 * K0, y: 540 - 26 * K0};
const LOCK = 720;
const WIPE = 738;

/* Cámara: nunca está quieta */
const camera = (f: number) => ({
  s: 1.012 + 0.01 * Math.sin(f / 37),
  x: 7 * Math.sin(f / 61),
  y: 6 * Math.sin(f / 47 + 1),
});

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
  const cam = camera(f);

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`}}>
        {f < 240 && <HookAndSearch f={f} />}
        {f >= 200 && f < 420 && <Detail f={f} />}
        {f >= 390 && f < 540 && <Chat f={f} />}
        {f >= 500 && f < 620 && <Safe f={f} />}
        {f >= 600 && f < 730 && <Sentence f={f} />}
        {f >= PRESS && f < SENT_OUT + 16 && <Thread f={f} />}
        {f >= 700 && <Finale f={f} />}
      </AbsoluteFill>
      <Audio src={staticFile('audio/music.wav')} />
      <Audio src={staticFile('audio/sfx.wav')} />
    </AbsoluteFill>
  );
};

/* =====================================================================
   1 + 2 · El punto → las preguntas → el buscador → las tarjetas
   ===================================================================== */
const HookAndSearch: React.FC<{f: number}> = ({f}) => {
  const wA = textW(LINE_A, H_SIZE), wB = textW(LINE_B, H_SIZE);
  const startA = 960 - (wA + DOT_GAP + DOT) / 2;
  const startB = 960 - (wB + DOT_GAP + DOT) / 2;
  const dotY = H_TOP + H_SIZE * 0.83 - DOT;
  const perA = {x: startA + wA + DOT_GAP, y: dotY};
  const perB = {x: startB + wB + DOT_GAP, y: dotY};
  /* zoom lento sobre el texto, como invideo */
  const zoom = tw(f, 0, 120, 1.07, 1, Easing.linear);

  /* --- el punto --- */
  const pop = spr(f, 0);
  let dx = 960 - DOT / 2, dy = 540 - DOT / 2;
  const legs: [number, number, {x: number; y: number}][] = [[4, 20, perA], [36, 46, PARK], [88, 100, perB]];
  for (const [a, b, to] of legs) { const k = p(f, a, b, EASE_IO); dx = lerp(dx, to.x, k); dy = lerp(dy, to.y, k); }
  /* el punto vive dentro del mismo zoom que el texto */
  dx = 960 + (dx + DOT / 2 - 960) * zoom - DOT / 2; dy = 540 + (dy + DOT / 2 - 540) * zoom - DOT / 2;
  const breathe = f >= 46 && f < 88 ? 1 + 0.18 * Math.max(0, Math.sin((f - 46) / 15 * Math.PI)) : 1;
  /* morph a buscador */
  const m = p(f, 116, 128, EASE_IO);
  const up = p(f, 158, 168, EASE_IO);
  const barY = lerp(BAR.y, BAR_UP_Y, up);
  const rx = lerp(dx, BAR.x, m), ry = lerp(dy, barY, m);
  const rw = lerp(DOT, BAR.w, m), rh = lerp(DOT, BAR.h, m);
  const rr = lerp(5, BAR.r, m);
  const out = ascentOut(f, EXPAND, 8, 220);

  const typedN = Math.max(0, Math.min(TYPED.length, f - 136));
  const typed = TYPED.slice(0, typedN);
  const caretX = BAR.x + 84 + textW(typed, 32, 500, 0) + 4;
  const caretOn = f >= 132 && f < 168 && Math.floor((f - 132) / 8) % 2 === 0;

  const exA = ascentOut(f, 36, 7, 170);
  const exB = ascentOut(f, 114, 7, 170);
  const listOut = (i: number) => ascentOut(f, 84 + i, 7, 200);
  const cap = ascentIn(f, 172, 10, 60);
  const capOut = ascentOut(f, EXPAND, 8, 200);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', inset: 0, ...fx(exA)}}>
          <RiseText text={LINE_A} f={f} start={4} stagger={0.5} size={H_SIZE} x={startA} y={H_TOP} />
        </div>
        {/* preguntas que suben como una lista */}
        {f >= 38 && f < 96 && QS.map((q, i) => {
          const shift = QS.slice(i + 1).reduce((s, qq) => s + Q_STEP * p(f, qq.t, qq.t + 8, EASE_IO), 0);
          const old = Math.min(1, shift / Q_STEP);
          const w = textW(q.text, 88);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, ...fx(listOut(QS.length - i))}}>
              <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-shift}px) scale(${1 - 0.14 * old})`,
                transformOrigin: '960px 530px', width: 1920, height: 1080}}>
                <RiseText text={q.text} f={f} start={q.t} stagger={0.35} size={88} x={960 - w / 2} y={H_TOP}
                  color={mix(C.t1, '#cbd5e1', old)} />
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', inset: 0, ...fx(exB)}}>
          <RiseText text={LINE_B} f={f} start={88} stagger={0.5} size={H_SIZE} x={startB} y={H_TOP} accentFrom={12} />
        </div>
      </AbsoluteFill>

      {/* tarjetas */}
      {f >= 158 && CARDS.map((c, i) => <Card key={i} f={f} i={i} c={c} />)}

      {/* leyenda */}
      {f >= 172 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 878, textAlign: 'center', fontSize: 42, fontWeight: 800,
          letterSpacing: '-0.02em', color: C.t1, ...fx(cap, capOut)}}>
          Quads a <span style={{color: C.brand}}>minutos</span> de la U
        </div>
      )}

      {/* el punto / buscador */}
      <div style={{position: 'absolute', left: rx, top: ry, width: rw, height: rh, borderRadius: rr,
        background: mix(C.brand, '#ffffff', m), border: m > 0.5 ? `2px solid ${C.border}` : 'none',
        boxShadow: m > 0 ? `0 ${14 * m}px ${40 * m}px rgba(15,23,42,${0.08 * m})` : 'none',
        transform: `translateY(${out.y}px) scale(${m > 0 ? 1 : pop * breathe})`, opacity: out.o, filter: `blur(${out.b}px)`, overflow: 'hidden'}}>
        {f >= 124 && (
          <>
            <div style={{position: 'absolute', left: 34, top: 30, opacity: tw(f, 124, 130, 0, 1), transform: `translateY(${tw(f, 124, 132, 20, 0)}px)`}}>
              <Icon name="search" size={34} color={C.t3} sw={2} />
            </div>
            <div style={{position: 'absolute', left: 0, top: 0, opacity: tw(f, 134, 137, 1, 0)}}>
              <RiseText text="Busca por colonia o calle" f={f} start={124} stagger={0.3} size={32} weight={500}
                ls={0} x={84} y={31} color={C.t4} ghost={C.t4} />
            </div>
            <div style={{position: 'absolute', left: 84, top: 31, fontSize: 32, fontWeight: 500, color: C.t1, lineHeight: 1, whiteSpace: 'pre'}}>{typed}</div>
          </>
        )}
      </div>
      {caretOn && <div style={{position: 'absolute', left: caretX, top: barY + 26, width: 3, height: 44, background: C.brand, borderRadius: 2}} />}
    </AbsoluteFill>
  );
};

const Card: React.FC<{f: number; i: number; c: typeof CARDS[number]}> = ({f, i, c}) => {
  const start = 160 + [4, 0, 8][i];
  const inn = ascentIn(f, start, 12, 300);
  const rot = tw(f, start, start + 14, (i - 1) * 6 || 3, 0);
  const isHero = i === 1;
  const exit = isHero ? NONE : ascentOut(f, EXPAND + (i === 0 ? 0 : 2), 8, 240);
  const e = isHero ? p(f, EXPAND, EXPAND + 14, EASE_IO) : 0;
  const x = lerp(cardX(i), HERO.x, e), y = lerp(CARD_Y, HERO.y, e);
  const w = lerp(CARD_W, HERO.w, e), h = lerp(CARD_H, HERO.h, e), r = lerp(32, HERO.r, e);
  const infoO = 1 - p(f, EXPAND, EXPAND + 5);
  const hl = isHero ? p(f, 188, 194) : 0;
  const hlS = isHero ? spr(f, 188, 9, 260) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden',
      transform: `translateY(${inn.y + exit.y}px) rotate(${rot}deg)`, opacity: inn.o * exit.o, filter: `blur(${inn.b + exit.b}px)`,
      boxShadow: '0 24px 60px rgba(15,23,42,0.14)', background: '#ddd'}}>
      <Photo src={c.img} style={{transform: `scale(${tw(f, start, start + 60, 1.15, 1.02)})`}} />
      {isHero && <Photo src="casa-martinez.jpg" style={{position: 'absolute', inset: 0, opacity: p(f, EXPAND + 3, EXPAND + 12, Easing.linear)}} />}
      <div style={{position: 'absolute', inset: 0, opacity: infoO,
        background: 'linear-gradient(180deg, rgba(15,23,42,0) 38%, rgba(15,23,42,0.82) 100%)'}}>
        <div style={{position: 'absolute', left: 20, top: 20, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px 7px 10px',
          borderRadius: 99, background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff', fontSize: 20, fontWeight: 800}}>
          <StarFill size={20} />{c.rating}
        </div>
        <div style={{position: 'absolute', left: 26, right: 22, bottom: 24, color: '#fff'}}>
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1}}>{c.title}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 19, fontWeight: 500, opacity: 0.9}}>
            <Icon name="map-pin-fill" size={20} color="#fff" />{c.zona}
          </div>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 19, fontWeight: 800,
            padding: '6px 12px 6px 8px', marginLeft: -8, borderRadius: 99, background: `rgba(38,103,255,${hl})`,
            transform: `scale(${isHero ? lerp(1, hlS, hl) : 1})`, transformOrigin: 'left center'}}>
            <Icon name="walking-fill" size={20} color="#fff" />{c.walk}
          </div>
          <div style={{marginTop: 14, fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em'}}>
            ${c.price}<span style={{fontSize: 19, fontWeight: 500, opacity: 0.8}}> /mes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   3 · Detalle: a 4 min de la U → conoce a la familia
   ===================================================================== */
const Detail: React.FC<{f: number}> = ({f}) => {
  if (f < EXPAND + 14) return null;
  const hero = ascentOut(f, TO_CHAT, 8, 260);
  const ex1 = (k: number) => ascentOut(f, FAM - 4 + k, 7, 200);
  const ex2 = (k: number) => ascentOut(f, TO_CHAT + k, 7, 200);
  /* galería: Ken Burns + deslizar a la siguiente foto */
  const kb = tw(f, 224, 404, 1.02, 1.12, Easing.linear);
  const sw = p(f, 300, 310, EASE_IO);
  const andreaGone = f >= TO_CHAT + 2;

  /* ruta */
  const walk = p(f, 254, 282, Easing.bezier(0.45, 0, 0.55, 1));
  const mins = Math.max(1, Math.ceil(walk * 4));
  const DOTS = 18;

  return (
    <AbsoluteFill>
      {/* foto principal */}
      <div style={{position: 'absolute', left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h, borderRadius: HERO.r,
        overflow: 'hidden', boxShadow: '0 24px 60px rgba(15,23,42,0.14)', ...fx(hero)}}>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-sw * 100}%)`}}>
          <Photo src="casa-martinez.jpg" style={{transform: `scale(${kb})`}} />
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - sw) * 100}%)`}}>
          <Photo src="cuarto-familia.jpg" style={{transform: `scale(${kb})`}} />
        </div>
        <div style={{position: 'absolute', left: 28, bottom: 28, display: 'flex', gap: 12}}>
          <div style={{transform: `scale(${spr(f, 228)})`, transformOrigin: 'left bottom'}}><Pill><Icon name="community-fill" size={22} color={C.brand} />Casa de familia</Pill></div>
          <div style={{transform: `scale(${spr(f, 233)})`, transformOrigin: 'left bottom'}}><Pill><StarFill size={22} />4.8 · 12 reseñas</Pill></div>
        </div>
        <div style={{position: 'absolute', right: 28, bottom: 28, padding: '8px 16px', borderRadius: 99, background: 'rgba(15,23,42,0.55)',
          color: '#fff', fontSize: 20, fontWeight: 800, transform: `scale(${spr(f, 236)})`}}>{f < 305 ? '1' : '2'} / 8</div>
      </div>

      {/* --- beat 1: a 4 min de la U --- */}
      {f < FAM + 10 && (
        <>
          <div style={{position: 'absolute', left: COL, top: 200, fontSize: 28, fontWeight: 500, color: C.t3, ...fx(ascentIn(f, 226, 10, 40), ex1(0))}}>
            Quad en casa de familia · Jardines de Guadalupe
          </div>
          <div style={{position: 'absolute', inset: 0, ...fx(ex1(1))}}>
            <RiseText text="A 4 min de la U" f={f} start={232} stagger={0.6} size={110} x={COL} y={248} accentFrom={2} accentTo={6} />
          </div>
          <div style={{position: 'absolute', inset: 0, ...fx(ex1(2))}}>
            {/* puntos de la ruta */}
            {Array.from({length: DOTS}).map((_, i) => {
              const x = lerp(ROUTE.x1 + 70, ROUTE.x2 - 90, i / (DOTS - 1));
              const s = spr(f, 250 + i * 0.9, 12, 300);
              const passed = walk * (DOTS - 1) >= i;
              return <div key={i} style={{position: 'absolute', left: x - 5, top: ROUTE.y - 5, width: 10, height: 10, borderRadius: 9,
                background: passed ? C.brand : '#cbd5e1', transform: `scale(${s})`}} />;
            })}
            {/* casa */}
            <div style={{position: 'absolute', left: ROUTE.x1 - 46, top: ROUTE.y - 46, width: 92, height: 92, borderRadius: 30,
              background: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${spr(f, 244)})`,
              boxShadow: '0 12px 30px rgba(38,103,255,0.3)'}}>
              <Icon name="home-solid" size={46} color="#fff" />
            </div>
            {/* UCA */}
            <div style={{position: 'absolute', left: ROUTE.x2 - 60, top: ROUTE.y - 40, height: 80, padding: '0 28px', borderRadius: 26,
              background: C.t1, color: '#fff', display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800,
              transform: `scale(${spr(f, 248)})`, transformOrigin: 'left center'}}>UCA</div>
            {/* quien camina */}
            {f >= 252 && (
              <div style={{position: 'absolute', left: lerp(ROUTE.x1 + 50, ROUTE.x2 - 110, walk), top: ROUTE.y - 30, width: 60, height: 60,
                borderRadius: 99, background: '#fff', border: `3px solid ${C.brand}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${spr(f, 252)}) translateY(${-Math.abs(Math.sin(f / 3)) * 6 * (walk > 0 && walk < 1 ? 1 : 0)}px)`,
                boxShadow: '0 8px 20px rgba(15,23,42,0.12)'}}>
                <Icon name="walking-fill" size={32} color={C.brand} />
              </div>
            )}
            {f >= 254 && (
              <div style={{position: 'absolute', left: lerp(ROUTE.x1 + 50, ROUTE.x2 - 110, walk) - 30, top: ROUTE.y - 104, width: 120,
                textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.brand, transform: `scale(${spr(f, 254)})`}}>{mins} min</div>
            )}
            <div style={{position: 'absolute', left: COL, top: 700, fontSize: 28, fontWeight: 500, color: C.t3, ...fx(ascentIn(f, 270, 10, 40))}}>
              Caminando a la Peatonal de la UCA
            </div>
          </div>
        </>
      )}

      {/* --- beat 2: conoce a la familia --- */}
      {f >= FAM && (
        <>
          <div style={{position: 'absolute', inset: 0, ...fx(ex2(0))}}>
            <RiseText text="Conoce a la familia" f={f} start={FAM} stagger={0.5} size={84} x={COL} y={150} />
          </div>
          <div style={{position: 'absolute', inset: 0, ...fx(ex2(1))}}>
            <RiseText text="antes de llegar" f={f} start={FAM + 8} stagger={0.5} size={84} x={COL} y={244} accentFrom={0} />
          </div>
          {MEMBERS.map((mb, i) => {
            const t = FAM + 18 + i * 4;
            const inn = ascentIn(f, t, 10, 80);
            const s = spr(f, t);
            const isA = i === 0;
            if (isA && andreaGone) return null;
            const e = isA ? NONE : ex2(2 + i);
            const ring = isA ? tw(f, 376, 384, 0, 6) : 0;
            const ringPulse = isA ? 1 + 0.08 * Math.sin(Math.max(0, f - 376) / 3) * (f >= 376 ? 1 : 0) : 1;
            return (
              <React.Fragment key={i}>
                <div style={{position: 'absolute', left: COL + i * AV_STEP, top: AV_Y, width: AV, height: AV, borderRadius: 999, overflow: 'hidden',
                  background: mb.tone, transform: `translateY(${inn.y + e.y}px) scale(${s * ringPulse})`, opacity: inn.o * e.o,
                  filter: `blur(${inn.b + e.b}px)`, boxShadow: `0 0 0 ${ring}px ${C.brand}`}}>
                  <Photo src={mb.img} />
                </div>
                <div style={{position: 'absolute', left: COL + i * AV_STEP - 10, top: AV_Y + AV + 18, width: AV + 20, textAlign: 'center',
                  ...fx(ascentIn(f, t + 3, 10, 40), ex2(2 + i))}}>
                  <div style={{fontSize: 26, fontWeight: 800, color: C.t1}}>{mb.name}</div>
                  <div style={{fontSize: 19, fontWeight: 500, color: C.t3, marginTop: 4}}>{mb.rol}</div>
                </div>
              </React.Fragment>
            );
          })}
          {RULES.map((r, i) => (
            <div key={i} style={{position: 'absolute', left: COL, top: 680 + i * 80, ...fx(ascentIn(f, FAM + 40 + i * 6, 10, 60), ex2(6 + i))}}>
              <Pill big><Icon name={r.icon} size={26} color={C.brand} />{r.text}</Pill>
            </div>
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};

const Pill: React.FC<{children: React.ReactNode; big?: boolean}> = ({children, big}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: big ? '14px 24px 14px 18px' : '10px 18px 10px 14px',
    borderRadius: 99, background: '#fff', border: big ? `1.5px solid ${C.border}` : 'none', fontSize: big ? 24 : 20,
    fontWeight: 800, color: C.t1, whiteSpace: 'nowrap', boxShadow: big ? 'none' : '0 6px 18px rgba(15,23,42,0.12)'}}>{children}</div>
);

/* =====================================================================
   4 · Chat y visita
   ===================================================================== */
const Chat: React.FC<{f: number}> = ({f}) => {
  const inn = ascentIn(f, TO_CHAT + 6, 12, 320);
  const out = ascentOut(f, CHAT_OUT, 8, 260);
  const headO = ascentIn(f, TO_CHAT + 12, 10, 30);
  const av = p(f, TO_CHAT + 2, TO_CHAT + 16, EASE_IO);
  const offsetFor = (i: number) => MSGS.slice(i + 1).reduce((s, mm) => s + (mm.h + 16) * p(f, mm.t, mm.t + 7, EASE), 0);
  /* la cámara sigue la conversación */
  const push = tw(f, TO_CHAT, CHAT_OUT, 1, 1.05, Easing.linear);

  return (
    <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '960px 700px'}}>
      <div style={{position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 44,
        background: '#fff', boxShadow: '0 30px 80px rgba(15,23,42,0.12)', border: `1.5px solid ${C.border}`, overflow: 'hidden', ...fx(inn, out)}}>
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
      {/* avatar de Andrea: viene de la familia */}
      <div style={{position: 'absolute', left: lerp(COL, HEAD_AV.x, av), top: lerp(AV_Y, HEAD_AV.y, av), width: lerp(AV, HEAD_AV.s, av),
        height: lerp(AV, HEAD_AV.s, av), borderRadius: 999, overflow: 'hidden', background: '#dce6ff',
        boxShadow: `0 0 0 ${tw(f, TO_CHAT + 16, TO_CHAT + 30, 6, 0)}px ${C.brand}`, ...fx(NONE, out)}}>
        <Photo src="andrea.jpg" />
      </div>
    </AbsoluteFill>
  );
};

const Visit: React.FC<{f: number; style: React.CSSProperties}> = ({f, style}) => (
  <div style={{...style, borderRadius: 30, border: `1.5px solid ${C.border}`, background: '#fff', padding: 26, boxSizing: 'border-box',
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 500, color: C.t3}}>
      <Icon name="calendar-fill" size={24} color={C.brand} />Visita propuesta
    </div>
    <div style={{fontSize: 30, fontWeight: 800, color: C.t1, marginTop: 10, letterSpacing: '-0.02em'}}>Sáb 7 de nov · 10:00 a. m.</div>
    <div style={{position: 'absolute', left: 26, bottom: 26, display: 'flex', gap: 14}}>
      <div style={{width: BTN.w, height: BTN.h, borderRadius: 18, background: f < PRESS ? C.brand : 'transparent', color: '#fff',
        fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{f < PRESS ? 'Aceptar' : ''}</div>
      <div style={{width: 230, height: BTN.h, borderRadius: 18, border: `1.5px solid ${C.border}`, color: C.t1,
        fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Otra fecha</div>
    </div>
  </div>
);

/* =====================================================================
   Hilo: Aceptar → check → escudo → cursor de la frase → pieza de la Q
   ===================================================================== */
const sentenceLayout = (f: number) => {
  const items = WORDS.map((w) => {
    const width = w.t ? textW(w.t, S_SIZE) : S_IMG;
    return {...w, width, c: (width + S_GAP) * p(f, w.at, w.at + 7, EASE)};
  });
  const W = items.reduce((s, it) => s + it.c, 0) + DOT;
  const left = lerp(ANCHOR - W, 960 - W / 2, p(f, CENTER_AT, CENTER_AT + 12, EASE_IO));
  let acc = left;
  const xs = items.map((it) => { const x = acc; acc += it.c; return x; });
  return {items, xs, dotX: acc, dotY: S_TOP + S_SIZE * 0.83 - DOT};
};

const Thread: React.FC<{f: number}> = ({f}) => {
  const press = f < PRESS + 4 ? tw(f, PRESS, PRESS + 3, 1, 0.93) : tw(f, PRESS + 3, PRESS + 10, 0.93, 1);
  const c = p(f, PRESS + 2, PRESS + 12, EASE_IO);
  let cx = BTN.x + BTN.w / 2, cy = BTN.y + BTN.h / 2;
  let w = lerp(BTN.w, 76, c), h = lerp(BTN.h, 76, c), r = lerp(18, 38, c);
  /* la conversación sube y el check viaja (con la cámara del chat) */
  const chatPush = tw(f, TO_CHAT, CHAT_OUT, 1, 1.05, Easing.linear);
  cx = 960 + (cx - 960) * chatPush; cy = 700 + (cy - 700) * chatPush;
  const b = p(f, CHAT_OUT + 2, CHAT_OUT + 16, EASE_IO);
  cx = lerp(cx, BADGE.cx, b); cy = lerp(cy, BADGE.cy, b);
  w = lerp(w, BADGE.s, b); h = lerp(h, BADGE.s, b); r = lerp(r, BADGE.r, b);
  let x = cx - w / 2, y = cy - h / 2;
  /* el escudo vuelve a ser el punto: el cursor de la frase */
  const L = sentenceLayout(f);
  const d = p(f, SAFE_OUT + 2, SAFE_OUT + 16, EASE_IO);
  x = lerp(x, L.dotX, d); y = lerp(y, L.dotY, d); w = lerp(w, DOT, d); h = lerp(h, DOT, d); r = lerp(r, 5, d);
  /* y luego la pieza pequeña de la Q */
  const q = p(f, SENT_OUT + 2, SENT_OUT + 16, EASE_IO);
  const ss = SMALL.s * K0;
  x = lerp(x, MARK0.x + SMALL.x * K0, q); y = lerp(y, MARK0.y + SMALL.y * K0, q);
  w = lerp(w, ss, q); h = lerp(h, ss, q); r = lerp(r, 0, q);

  const iconS = Math.min(w / 76, 1.6);
  const checkDraw = tw(f, PRESS + 8, PRESS + 18, 1, 0);
  const toShield = p(f, CHAT_OUT + 8, CHAT_OUT + 16);
  const iconO = 1 - p(f, SAFE_OUT, SAFE_OUT + 6);
  const caretPulse = f >= SAFE_OUT + 16 && f < SENT_OUT ? 1 + 0.12 * Math.max(0, Math.sin((f - SAFE_OUT) / 7.5 * Math.PI)) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: C.brand,
      transform: `scale(${press * caretPulse})`, boxShadow: `0 ${20 * b}px ${60 * b}px rgba(38,103,255,${0.3 * b * (1 - d)})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', color: '#fff', fontSize: 24, fontWeight: 800, opacity: 1 - p(f, PRESS + 2, PRESS + 6)}}>Aceptar</div>
      <div style={{position: 'absolute', opacity: (1 - toShield) * iconO, transform: `scale(${iconS})`}}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={22} strokeDashoffset={22 * checkDraw} />
        </svg>
      </div>
      <div style={{position: 'absolute', opacity: toShield * iconO, transform: `scale(${tw(f, CHAT_OUT + 8, CHAT_OUT + 18, 0.6, 1)}) rotate(${tw(f, CHAT_OUT + 8, CHAT_OUT + 18, -20, 0)}deg)`}}>
        <Icon name="shield-check-fill" size={w * 0.52} color="#fff" style={{['--icon-cut' as any]: C.brand}} />
      </div>
    </div>
  );
};

/* =====================================================================
   5 · Todo seguro
   ===================================================================== */
const Safe: React.FC<{f: number}> = ({f}) => {
  const ex = (k: number) => ascentOut(f, SAFE_OUT + k, 7, 200);
  const X = 840;
  const zoom = tw(f, 512, 612, 1.05, 1, Easing.linear);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '960px 540px'}}>
      <div style={{position: 'absolute', inset: 0, ...fx(ex(0))}}><RiseText text="Todo seguro," f={f} start={520} stagger={0.5} size={88} x={X} y={286} /></div>
      <div style={{position: 'absolute', inset: 0, ...fx(ex(1))}}><RiseText text="dentro de Quad" f={f} start={528} stagger={0.5} size={88} x={X} y={384} accentFrom={0} /></div>
      {SAFE.map((s, i) => {
        const t = 540 + i * 8;
        return (
          <div key={i} style={{position: 'absolute', left: X, top: 530 + i * 76, display: 'flex', alignItems: 'center', gap: 16,
            ...fx(ascentIn(f, t, 10, 60), ex(2 + i)), fontSize: 36, fontWeight: 500, color: C.t1, letterSpacing: '-0.01em'}}>
            <div style={{transform: `scale(${spr(f, t + 2)}) rotate(${tw(f, t + 2, t + 12, -90, 0)}deg)`}}>
              <Icon name="check-circle-fill" size={40} color={C.brand} style={{['--icon-cut' as any]: '#fff'}} />
            </div>
            {s}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* =====================================================================
   6 · Hecho para estudiantes y familias (texto que avanza, como invideo)
   ===================================================================== */
const Sentence: React.FC<{f: number}> = ({f}) => {
  const L = sentenceLayout(f);
  const last = L.items.reduce((k, it, i) => (f >= it.at ? i : k), -1);
  const centered = f >= CENTER_AT;
  const zoom = tw(f, 612, SENT_OUT, 1.06, 1, Easing.linear);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '960px 540px'}}>
      {L.items.map((it, i) => {
        const x = L.xs[i];
        const e = ascentOut(f, SENT_OUT + i, 7, 200);
        const grey = !centered && i < last - 1;
        const color = grey ? '#b8c2d3' : it.accent && centered ? C.brand : C.t1;
        if (f < it.at) return null;
        if (it.img) {
          const s = spr(f, it.at, 10, 240);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: S_TOP + S_SIZE * 0.5 - S_IMG / 2 + 6, width: S_IMG, height: S_IMG,
              borderRadius: 26, overflow: 'hidden', transform: `scale(${s}) rotate(${tw(f, it.at, it.at + 12, -14, i === 2 ? -4 : 4)}deg)`,
              boxShadow: '0 12px 30px rgba(15,23,42,0.18)', ...fx(NONE, e), filter: `blur(${e.b}px) grayscale(${grey ? 0.6 : 0})`}}>
              <Photo src={it.img} />
            </div>
          );
        }
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...fx(e)}}>
            <RiseText text={it.t!} f={f} start={it.at} stagger={0.5} size={S_SIZE} x={x} y={S_TOP} color={color} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* =====================================================================
   7 · Tu lugar cerca de la U
   ===================================================================== */
const Finale: React.FC<{f: number}> = ({f}) => {
  const big = ascentIn(f, 708, 10, 160);
  const bigS = spr(f, 708, 9, 220);
  const lock = f < LOCK ? 1 : tw(f, LOCK, LOCK + 8, 1.06, 1);
  const wp = p(f, WIPE, WIPE + 12, EASE_IO);
  const clipTop = (1 - wp) * 100;
  const rad = lerp(200, 0, wp);
  const word = 'Quad';
  const WS = 190;
  const wW = textW(word, WS);
  const k1 = 5.2, PIECE0 = 12.84, PIECE = 26.32;
  const period = 40;
  const total = PIECE * k1 + 50 + wW + 14 + period;
  const gx = 960 - total / 2;
  const cy = 470;
  const s = p(f, WIPE + 14, WIPE + 26, EASE_IO);
  const k = lerp(K0, k1, s);
  const ox = lerp(MARK0.x, gx - PIECE0 * k1, s), oy = lerp(MARK0.y, cy - 26 * k1, s);
  const wordX = gx + PIECE * k1 + 50;
  const wordTop = cy - WS * 0.53;
  const per = spr(f, WIPE + 28, 9, 240);
  const endZoom = tw(f, WIPE + 26, DURATION, 1, 1.06, Easing.linear);

  const Mark = ({color}: {color: string}) => (
    <div style={{position: 'absolute', left: ox, top: oy, width: 52 * k, height: 52 * k, transform: `scale(${lock})`}}>
      <svg width={52 * k} height={52 * k} viewBox="0 0 52 52" style={{position: 'absolute', overflow: 'visible'}}>
        {f >= 708 && (
          <g style={{transformOrigin: '24px 24px', transform: `translateY(${big.y / k}px) scale(${bigS})`, opacity: big.o}}>
            <path d={BIG_PIECE} fill={color} />
          </g>
        )}
        {f >= SENT_OUT + 16 && <rect x={SMALL.x} y={SMALL.y} width={SMALL.s} height={SMALL.s} fill={color} />}
      </svg>
    </div>
  );

  return (
    <AbsoluteFill>
      <Mark color={C.brand} />
      <AbsoluteFill style={{top: -80, left: -80, right: -80, bottom: -80, clipPath: `inset(${clipTop}% 0 0 0 round ${rad}px ${rad}px 0 0)`,
        background: 'radial-gradient(120% 120% at 25% 15%, #4a82ff 0%, #2667ff 48%, #1a4fd6 100%)'}}>
        <AbsoluteFill style={{top: 80, left: 80, right: 80, bottom: 80, transform: `scale(${endZoom})`}}>
          <Mark color="#fff" />
          {f >= WIPE + 14 && (
            <>
              <RiseText text={word} f={f} start={WIPE + 16} stagger={2} size={WS} x={wordX} y={wordTop} color="#fff" ghost="#9db8ff" />
              <div style={{position: 'absolute', left: wordX + wW + 14, top: cy + WS * 0.42 - period, width: period, height: period,
                background: '#fff', borderRadius: 7, transform: `scale(${per})`}} />
              <RiseText text="Tu lugar cerca de la U." f={f} start={WIPE + 34} stagger={0.5} size={64} x={0} y={650} width={1920}
                align="center" color="#fff" ghost="#9db8ff" />
            </>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
