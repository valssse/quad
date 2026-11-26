"""
Quad · audio del video v3 (63 s). Genera en public/audio/:
  voz.wav    los 10 clips de ElevenLabs (public/audio/voz/vo01..vo10.wav) en su lugar
  music.wav  house a 120 BPM, que baja sola mientras habla la voz
  sfx.wav    efectos minimalistas y orgánicos, sincronizados por frame con QuadPromo.tsx

Todo es sintetizado (sin samples externos ni licencias).
Tiempos en frames a 30 fps. Si cambias un tiempo en QuadPromo.tsx, cámbialo aquí.
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, stft, istft
import wave, os

SR = 48000
FPS = 30
DUR = 1890 / FPS          # 63 s
N = int(SR * DUR)
BEAT = 0.5                # 120 BPM
rng = np.random.default_rng(7)
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public', 'audio')
F = lambda fr: fr / FPS

VO = [18, 192, 330, 510, 750, 840, 1020, 1185, 1455, 1605]   # = VO en QuadPromo.tsx


def t_(d):
    return np.arange(int(SR * d)) / SR


def stereo(sig, pan=0.0):
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([sig * l, sig * r], 1) * np.sqrt(2)


def place(buf, sig, at, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        sig = stereo(sig, pan)
    i = int(round(at * SR)); s0 = 0
    if i < 0:
        s0, i = -i, 0
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig) - s0)
    buf[i:j] += sig[s0:s0 + (j - i)] * gain


def filt(x, kind, fc, order=2):
    return sosfilt(butter(order, fc, kind, fs=SR, output='sos'), x, axis=0)


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def reverb(x, secs=1.6, wet=0.2, damp=6500, seed=3):
    r = np.random.default_rng(seed)
    n = int(SR * secs)
    env = np.exp(-np.linspace(0, 7, n))
    ir = np.stack([filt(r.standard_normal(n), 'low', damp) * env, filt(r.standard_normal(n), 'low', damp) * env], 1)
    ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet


def read_wav(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(1)
    return x


# ================================================================== voz
voz = np.zeros((N, 2))
for i, fr in enumerate(VO):
    clip = read_wav(os.path.join(OUT, 'voz', f'vo{i + 1:02d}.wav'))
    clip = filt(clip, 'high', 80)                     # limpia retumbe
    fade = np.minimum(1, np.arange(len(clip)) / (0.004 * SR)) * np.minimum(1, (len(clip) - np.arange(len(clip))) / (0.02 * SR))
    place(voz, clip * fade, F(fr), 1.0, 0.0)

# envolvente de la voz para bajar la música mientras habla
mono = np.abs(voz[:, 0])
win = int(0.03 * SR)
rms = np.sqrt(np.convolve(mono ** 2, np.ones(win) / win, 'same'))
act = np.clip(rms / (0.12 * rms.max()), 0, 1)
env = np.zeros(N); z = 0.0
att, rel = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.35 * SR))
for k in range(0, N, 16):                               # seguidor de envolvente (paso de 16 muestras)
    a = act[k]
    z = (att ** 16) * z + (1 - att ** 16) * a if a > z else (rel ** 16) * z + (1 - rel ** 16) * a
    env[k:k + 16] = z

# ================================================================== música
def kick(soft=False):
    t = t_(0.34)
    fr = 50 + 95 * np.exp(-t / 0.028)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / (0.12 if soft else 0.15))
    s[:180] += filt(rng.standard_normal(180), 'high', 1800) * 0.18 * np.linspace(1, 0, 180)
    return np.tanh(1.3 * s) * 0.85


def clap():
    t = t_(0.22)
    n = filt(rng.standard_normal(len(t)), 'band', [1000, 3800])
    env_ = np.zeros_like(t)
    for k, d in enumerate([0, 0.012, 0.023]):
        env_ += (t >= d) * np.exp(-np.clip(t - d, 0, None) / (0.008 if k < 2 else 0.06))
    return n * env_ * 0.42


def shaker(open_=False):
    d = 0.16 if open_ else 0.06
    t = t_(d)
    n = filt(rng.standard_normal(len(t)), 'band', [5000, 11000])
    e = np.minimum(1, t / 0.006) * np.exp(-t / (0.05 if open_ else 0.018))
    return n * e * (0.14 if open_ else 0.10)


def pluck(f0, d=0.35, bright=1.0):
    """Pulsado suave, más madera que sintetizador."""
    t = t_(d)
    s = np.sin(2 * np.pi * f0 * t) + 0.35 * np.sin(4 * np.pi * f0 * t) * np.exp(-t / 0.04) + 0.12 * np.sin(6 * np.pi * f0 * t) * np.exp(-t / 0.02)
    s = filt(s, 'low', 1500 + 3000 * bright)
    return s * np.exp(-t / 0.11) * np.minimum(1, t / 0.003) * 0.13


def bass(f0, d=0.24):
    t = t_(d)
    s = np.tanh(1.8 * (np.sin(2 * np.pi * f0 * t) + 0.25 * np.sin(4 * np.pi * f0 * t)))
    s = filt(s, 'low', 600) * np.minimum(1, t / 0.005) * np.clip((d - t) / 0.04, 0, 1)
    return s * 0.36


def pad_note(f0, d):
    t = t_(d)
    s = np.zeros_like(t)
    for det in (-0.08, 0.0, 0.08):
        ff = f0 * 2 ** (det / 12)
        for h in range(1, 6):
            s += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h ** 1.6
    return s * np.minimum(1, t / 0.25) * np.clip((d - t) / 0.3, 0, 1) * 0.04


def keys_chord(notes, d=0.3):
    return sum(pluck(midi(m), d, 0.45) for m in notes) * 0.8


# Dmaj9 · Bm9 · Gmaj9 · A6/9 (un acorde por compás de 2 s)
CH = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [45, 52, 57, 61, 64]]
ROOT = [38, 35, 31, 33]
ARP = [[74, 78, 81, 85, 81, 78, 76, 78], [74, 78, 81, 83, 81, 78, 73, 78],
       [74, 79, 83, 86, 83, 79, 78, 79], [73, 76, 81, 85, 81, 76, 78, 76]]

TENSION = 6.0     # el problema: entra el bombo suave
DROP = 10.5       # "Conoce Quad"
LIFT = 48.0       # seguridad: platillo
BREAK = 53.0      # "Hecho para…": se va la batería
FINAL = 58.0      # termina el barrido azul
END_HIT = 61.0

drums = np.zeros((N, 2)); bassb = np.zeros((N, 2)); syn = np.zeros((N, 2)); pads = np.zeros((N, 2))
side = np.ones(N)

for b in range(int(DUR / BEAT)):
    tt = b * BEAT
    bar = int(tt // 2) % 4
    bib = b % 4
    full = DROP <= tt < BREAK or FINAL <= tt < END_HIT
    tense = TENSION <= tt < DROP
    if full or (tense and bib in (0, 2)):
        place(drums, kick(soft=tense), tt, 0.9 if full else 0.55)
        i = int(tt * SR); n = int(0.22 * SR)
        side[i:i + n] = np.minimum(side[i:i + n], 1 - 0.55 * np.exp(-np.arange(n) / (0.06 * SR)))
    if full and bib in (1, 3):
        place(drums, clap(), tt, 0.8, 0.05)
    if (full or tense) and tt < END_HIT:
        for k in range(4):
            place(drums, shaker(), tt + k * BEAT / 4, (0.9 if k == 2 else 0.5) * (1 if full else 0.6), 0.25)
        if full:
            place(drums, shaker(True), tt + BEAT / 2, 0.7, -0.25)
    if full:
        place(bassb, bass(midi(ROOT[bar])), tt + BEAT / 2, 1.0)
        if bib == 3:
            place(bassb, bass(midi(ROOT[bar] + 12), 0.1), tt + BEAT * 0.75, 0.5)
    if tt < END_HIT:
        for k in range(4):
            if not full and k % 2 == 1 and tt < TENSION:
                continue                                  # intro: arpegio a corcheas, más aire
            note = ARP[bar][(bib * 4 + k) % 8]
            place(syn, pluck(midi(note), 0.32, 1.0 if full else 0.3), tt + k * BEAT / 4, 0.85 if k % 2 == 0 else 0.55, pan=[-0.45, 0.45][k % 2])
    if full and bib in (1, 3):
        place(syn, keys_chord(CH[bar][1:]), tt + BEAT / 2, 0.5)
    if bib == 0:
        for m in CH[bar]:
            place(pads, pad_note(midi(m + 12), 2.0), tt, 1.0 if not full else 0.75, rng.uniform(-0.5, 0.5))

# intro: filtro que se abre poco a poco hasta el drop
intro = int(DROP * SR)
pre = syn[:intro].copy(); out = np.zeros_like(pre); seg = 24
for s in range(seg):
    a, b2 = s * intro // seg, (s + 1) * intro // seg
    fc = 700 * (7000 / 700) ** (s / (seg - 1))
    out[a:b2] = filt(pre[max(0, a - 4000):b2], 'low', fc)[-(b2 - a):]
syn[:intro] = out


def riser(d, top=9000):
    t = t_(d); x = rng.standard_normal(len(t)); y = np.zeros_like(t)
    for k, (lo, hi) in enumerate([(300, 1100), (1100, 3200), (3200, top)]):
        y += filt(x, 'band', [lo, hi]) * np.clip((t / d) * 3 - k, 0, 1)
    return y * (t / d) ** 2.2 * 0.2


def crash():
    t = t_(1.8)
    return filt(rng.standard_normal(len(t)), 'band', [4000, 14000]) * np.exp(-t / 0.5) * 0.14


place(syn, stereo(riser(2.0)), DROP - 2.0, 0.7)
place(syn, stereo(riser(FINAL - BREAK)), BREAK, 0.85)
place(drums, stereo(crash()), DROP, 1.0)
place(drums, stereo(crash()), LIFT, 0.7)
place(drums, stereo(crash()), FINAL, 1.0)
fin = np.zeros((N, 2))
for m in [38, 50, 57, 62, 64, 66, 69, 73]:
    place(fin, pad_note(midi(m), DUR - END_HIT) * 2.2, END_HIT, 1.0, rng.uniform(-0.6, 0.6))
place(fin, kick(), END_HIT, 0.9)
place(fin, keys_chord([62, 66, 69, 73, 76], 1.4), END_HIT, 1.1)

sc = side[:, None]
duck_syn = (1 - 0.62 * env)[:, None]     # el arpegio comparte rango con la voz: baja más
duck_all = (1 - 0.45 * env)[:, None]
music = (drums * duck_all + bassb * sc + reverb(syn, 1.4, 0.24) * sc * duck_syn
         + reverb(pads, 2.4, 0.35) * sc * duck_all + reverb(fin, 2.8, 0.3))
tt = np.arange(N) / SR
music *= np.clip((DUR - tt) / 0.8, 0, 1)[:, None]
music = np.tanh(music * 1.2) / 1.2

# ================================================================== efectos
def air(d, lo=500, hi=6000, rising=True, pan0=0.0, pan1=0.0, peak=0.7, seed=None):
    """Aire filtrado: un paso de aire suave, sin tono. La banda sube (o baja) y el sonido viaja en el estéreo."""
    r = np.random.default_rng(seed)
    n = int(SR * d); x = r.standard_normal(n + 2048)
    f_, tt_, Z = stft(x, SR, nperseg=1024)
    tn = np.clip(tt_ / d, 0, 1)
    prog = np.clip(tn / peak, 0, 1) if rising else 1 - np.clip(tn / peak, 0, 1)
    fc = lo * (hi / lo) ** prog
    bw = 0.9
    g = np.exp(-0.5 * (np.log2(np.maximum(f_[:, None], 20) / fc[None, :]) / bw) ** 2)
    _, y = istft(Z * g, SR, nperseg=1024)
    y = y[:n]
    tn = np.arange(n) / n
    env_ = np.where(tn < peak, (tn / peak) ** 2.2, np.exp(-(tn - peak) / (0.11 * (1 - peak) + 0.02)))
    y = y * env_
    y /= np.abs(y).max() + 1e-9
    pans = pan0 + (pan1 - pan0) * tn
    l, rr = np.cos((pans + 1) * np.pi / 4), np.sin((pans + 1) * np.pi / 4)
    return np.stack([y * l, y * rr], 1) * np.sqrt(2)


def tap(f0=1700, body=1.0):
    """Toque de dedo sobre vidrio."""
    t = t_(0.09)
    s = (np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.010) * 0.55
         + np.sin(2 * np.pi * f0 * 2.71 * t) * np.exp(-t / 0.004) * 0.2
         + np.sin(2 * np.pi * 170 * t) * np.exp(-t / 0.018) * 0.5 * body)
    s += filt(rng.standard_normal(len(t)), 'band', [1500, 7000]) * np.exp(-t / 0.0025) * 0.35
    return s * np.minimum(1, t / 0.0008)


def key_tap():
    t = t_(0.05)
    f0 = rng.uniform(2300, 3300)
    s = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.004) * 0.35 + np.sin(2 * np.pi * rng.uniform(380, 460) * t) * np.exp(-t / 0.007) * 0.45
    s += filt(rng.standard_normal(len(t)), 'band', [2000, 8000]) * np.exp(-t / 0.002) * 0.3
    return s


def drop(f0=380, f1=1000, d=0.12):
    """Gota de agua: el tono sube rápido y se apaga."""
    t = t_(d)
    fr = f0 * (f1 / f0) ** np.clip(t / 0.045, 0, 1)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.035) * np.minimum(1, t / 0.002)


def marimba(m, d=0.8, g=1.0):
    f0 = midi(m); t = t_(d)
    s = (np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.32)
         + 0.35 * np.sin(2 * np.pi * 3.93 * f0 * t) * np.exp(-t / 0.045)
         + 0.08 * np.sin(2 * np.pi * 9.2 * f0 * t) * np.exp(-t / 0.012))
    return filt(s, 'low', 7000) * np.minimum(1, t / 0.0015) * g


def glass(m, d=1.4):
    """Campanita de vidrio: verificado."""
    f0 = midi(m); t = t_(d)
    s = np.zeros_like(t)
    for ratio, dec, amp in [(1, 0.7, 1.0), (2.76, 0.25, 0.35), (5.4, 0.08, 0.15)]:
        s += amp * (np.sin(2 * np.pi * f0 * ratio * t) + 0.6 * np.sin(2 * np.pi * f0 * ratio * 1.003 * t)) * np.exp(-t / dec)
    return s * np.minimum(1, t / 0.002) * 0.5


def thud():
    t = t_(0.5)
    fr = 52 + 40 * np.exp(-t / 0.04)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.16)
    s += filt(rng.standard_normal(len(t)), 'low', 260) * np.exp(-t / 0.025) * 0.5
    return s


def paper(d=0.14):
    t = t_(d)
    n = filt(rng.standard_normal(len(t)), 'band', [1200, 6000])
    e = np.minimum(1, t / (d * 0.35)) * np.exp(-np.clip(t - d * 0.35, 0, None) / (d * 0.22))
    return n * e


def suck(d=0.5, seed=None):
    """Aire al revés: todo se va hacia un punto."""
    a = air(d, 600, 7000, rising=True, peak=0.92, seed=seed)
    return a


def focus(d=0.9):
    """Enfoque: brillo que sube y se aclara (para 'ciegas')."""
    t = t_(d)
    s = np.zeros_like(t)
    for m, dl in [(81, 0.0), (85, 0.06), (88, 0.12), (93, 0.2)]:
        tt2 = np.clip(t - dl, 0, None)
        s += np.sin(2 * np.pi * midi(m) * tt2) * np.exp(-tt2 / 0.5) * (t >= dl) * np.minimum(1, tt2 / 0.03)
    return s * 0.18


sfx = np.zeros((N, 2))
W = lambda fr, d, g, lo=500, hi=6000, rising=True, p0=0.0, p1=0.0, peak=0.7: place(
    sfx, air(d, lo, hi, rising, p0, p1, peak, seed=int(fr)), F(fr) - d * peak, g)
T = lambda fr, g=0.18, f0=1700, pan=0.0: place(sfx, tap(f0), F(fr), g, pan)
D = lambda fr, a=380, b=1000, g=0.16, pan=0.0: place(sfx, drop(a, b), F(fr), g, pan)
M = lambda fr, m, g=0.14, pan=0.0: place(sfx, marimba(m), F(fr), g, pan)
G = lambda fr, m=93, g=0.07, pan=0.0: place(sfx, glass(m), F(fr), g, pan)
K = lambda a, b, step=1.5, g=0.05, pan0=-0.1, pan1=0.1: [place(sfx, key_tap(), F(a + i * step), g * rng.uniform(0.7, 1.1),
                                                         pan0 + (pan1 - pan0) * i / max(1, (b - a) / step)) for i in range(int((b - a) / step))]

# 1 · gancho
D(0, 300, 760, 0.2)
W(16, 0.5, 0.07, 800, 5000)
T(40, 0.12, 1500)
W(92, 0.45, 0.08, 700, 4500, p0=0, p1=0)            # cámara baja a la 1.ª pregunta
W(150, 0.45, 0.08, 700, 4500)
D(152, 320, 900, 0.16)                               # el punto salta
W(194, 0.55, 0.22, 400, 7000, True, 0, 0, 0.85)       # zoom a través del punto
# 2 · el problema
for c_t, kind, pan in [(194, 'p', -0.5), (201, 'b', 0.5), (212, 'n', -0.6), (220, 'n', 0.6), (229, 'n', 0.0),
                       (243, 'b', 0.5), (250, 'b', -0.5), (256, 'b', 0.1)]:
    if kind == 'n':
        place(sfx, paper(0.12), F(c_t), 0.09, pan); T(c_t + 1, 0.06, 1300, pan)
    elif kind == 'b':
        D(c_t, 500, 1100, 0.1, pan)
    else:
        T(c_t, 0.1, 1500, pan)
place(sfx, thud(), F(264), 0.12)
W(268, 0.8, 0.06, 300, 1800, False)
place(sfx, suck(0.6, 298), F(316) - 0.6, 0.2)
D(312, 260, 720, 0.18)
# 3 · conoce Quad
W(350, 0.4, 0.07, 900, 5000)
place(sfx, thud(), F(349), 0.18)
for k, m in enumerate([74, 78, 81]):
    M(350 + k * 2, m, 0.09)
W(372, 0.5, 0.06, 800, 5000)
for k, at in enumerate([440, 447, 454]):
    D(at, 360 + k * 60, 900 + k * 120, 0.14, -0.3 + k * 0.3)
    G(at + 11, 93 + [0, 2, 4][k], 0.05, -0.3 + k * 0.3)
W(486, 0.4, 0.14, 500, 6000)
# 4 · buscador
W(509, 0.45, 0.1, 300, 2500, False)
T(510, 0.1, 1400)
W(540, 0.7, 0.09, 400, 4000, True, 0, 0, 0.8)        # acercamiento
# escribe, borra y vuelve a escribir cada zona
for k, (ty, n, de) in enumerate([(549, 17, 571), (577, 10, 592), (600, 11, None)]):
    K(ty, ty + n, 1.0, 0.055, -0.3, 0.2)
    if de:
        for j in range(4):
            place(sfx, key_tap(), F(de + j * 1.2), 0.03, -0.1)
        W(de + 3, 0.3, 0.04, 2500, 700, False, 0.2, -0.3, 0.5)
W(569, 0.5, 0.06, 600, 5000, True, -0.4, 0.4)          # paneo izquierda → derecha
W(592, 0.5, 0.06, 600, 5000, True, -0.4, 0.4)
W(614, 0.5, 0.06, 600, 5000, True, -0.4, 0.4)
W(662, 0.6, 0.12, 300, 3500, False, 0, 0, 0.8)         # se aleja
for k, at in enumerate([652, 648, 656]):
    place(sfx, paper(0.16), F(at), 0.08, [-0.5, 0, 0.5][k])
for k, at in enumerate([672, 682, 692]):
    for j in range(4):
        T(at + j * 3, 0.035, 2600 + j * 150, -0.4 + k * 0.4)
    M(at + 10, [81, 83, 86][k], 0.11, -0.4 + k * 0.4)
W(744, 0.45, 0.14, 400, 5000)
# 5 · fotos y lo que incluye
for k, at in enumerate([754, 759, 762]):
    T(at, 0.06, 1800 + k * 200, -0.4)
W(784, 0.6, 0.06, 500, 3000)
for at in [768, 786]:
    place(sfx, air(0.28, 1500, 7000, True, 0.5, -0.5, 0.6, seed=at), F(at) - 0.1, 0.1)
W(800, 0.45, 0.12, 500, 6000, True, -0.6, 0.6)
for k, a in enumerate(AM := [798, 803, 808, 813]):
    D(a, 420 + k * 50, 1000 + k * 100, 0.12, 0.4)
W(836, 0.5, 0.24, 400, 7500, True, -0.8, 0.8, 0.8)    # latigazo
# 6 · la familia
W(848, 0.6, 0.12, 300, 4000, False, 0.7, -0.1, 0.25)
W(836, 0.5, 0.06, 800, 5000)
for k in range(4):
    D(828 + k * 4, 340 + k * 70, 820 + k * 110, 0.13, -0.45 + k * 0.3)
for k, at in enumerate([872, 882, 892]):
    T(at, 0.09, 1500, -0.4 + k * 0.4)
M(904, 86, 0.1)
W(958, 0.7, 0.08, 400, 3500, True, 0, 0, 0.8)          # baja a "nadie llega a ciegas"
place(sfx, focus(1.0), F(956), 0.5)
W(1000, 0.7, 0.07, 300, 2500, False, 0, 0, 0.6)       # todo se desenfoca menos Andrea
W(1016, 0.5, 0.06, 600, 4000, True, -0.2, 0.2, 0.7)    # Andrea viaja al chat
D(1026, 400, 950, 0.1)
# 7 · chat
for k, (at, mine) in enumerate([(1016, 0), (1034, 1), (1054, 0), (1070, 1)]):
    if mine:
        D(at, 600, 1300, 0.1, 0.4)
        W(at + 4, 0.25, 0.035, 2000, 7000, True, 0.2, 0.5)
    else:
        M(at, 81, 0.1, -0.35); M(at + 3, 86, 0.08, -0.35)
M(1084, 78, 0.1); M(1088, 85, 0.08)
W(1100, 0.6, 0.07, 400, 3000)
W(1138, 0.8, 0.08, 400, 3500, True, 0, 0, 0.85)
T(PRESS := 1141, 0.24, 1500)
for k, m in enumerate([74, 78, 81, 86]):
    M(1150 + k * 2.5, m, 0.13)
place(sfx, riser(0.45, 6000), F(1167) - 0.45, 0.4)
# 8 · cuenta institucional
W(1172, 0.6, 0.08, 300, 3000, False, 0, 0, 0.15)      # aparece la tarjeta sobre blanco
D(1182, 380, 950, 0.14)
W(1209, 0.45, 0.05, 900, 5000)
W(1230, 0.5, 0.07, 500, 3500)
K(1228, 1263, 1.45, 0.05, -0.4, 0.2)
G(1278, 93, 0.08)
G(1281, 98, 0.05)
W(1328, 0.45, 0.22, 400, 7500, True, -0.8, 0.8, 0.75)    # latigazo a anfitriones
D(1306, 360, 900, 0.12, 0.4)
K(1336, 1373, 1.45, 0.05, 0.0, 0.5)
G(1370, 95, 0.08, 0.3)
G(1373, 100, 0.05, 0.3)
T(1374, 0.09, 1500, 0.3)
T(PUBLISH := 1398, 0.2, 1500, 0.2)
for k, m in enumerate([78, 81, 85]):
    M(1402 + k * 2.5, m, 0.12, 0.2)
W(1414, 0.7, 0.1, 300, 3000, False, 0, 0, 0.8)          # se aleja
W(1452, 0.5, 0.2, 400, 7000, True, 0, 0, 0.8)            # sale hacia arriba
# 9 · seguridad
W(1462, 0.6, 0.1, 300, 4000, False, 0, 0, 0.2)
place(sfx, thud(), F(1450), 0.16)
for k, at in enumerate([1460, 1503, 1520]):
    T(at, 0.09, 1500)
    M(at + 12, [81, 85, 88][k], 0.12)
W(1530, 0.7, 0.07, 500, 4000, True, -0.4, 0.4)
for k, m in enumerate([62, 66, 69, 74]):
    M(1543 + k * 1.5, m + 12, 0.07)
place(sfx, suck(0.5, 1586), F(1600) - 0.5, 0.14)
D(1600, 300, 800, 0.12)
# 10 · hecho para…
for at in [1607, 1615, 1626, 1641, 1657, 1661, 1671, 1684, 1689, 1696, 1700]:
    place(sfx, key_tap(), F(at), 0.035)
D(1622, 420, 1000, 0.14, -0.3)
D(1668, 480, 1100, 0.14, 0.3)
W(1614, 0.5, 0.05, 600, 4000, True, -0.3, 0.3)
W(1666, 0.5, 0.05, 600, 4000, True, 0.3, -0.3)
W(1726, 0.5, 0.06, 500, 3500)
# 11 · logo
place(sfx, thud(), F(1726), 0.12)
T(1736, 0.18, 1200)
place(sfx, thud(), F(1736), 0.1)
W(1752, 1.1, 0.26, 200, 7000, True, 0, 0, 0.85)       # barrido azul de abajo hacia arriba
for k, m in enumerate([74, 78, 81, 85, 86]):
    M(1759 + k * 2, m, 0.08)
D(1772, 400, 1000, 0.14)
W(1778, 0.6, 0.05, 900, 5000)

sfx = reverb(sfx, 1.3, 0.2, 7500, seed=9)


# ================================================================== niveles y escritura
import pyloudnorm as pyln
meter = pyln.Meter(SR)


def lufs(x):
    return meter.integrated_loudness(x)


def to_lufs(x, target):
    return x * 10 ** ((target - lufs(x)) / 20)


voz = to_lufs(voz, -16.0)
music = to_lufs(music, -21.0)
sfx = to_lufs(sfx, -27.0)
total = voz + music + sfx
pk = np.abs(total).max()
if pk > 0.89:                     # deja margen: Remotion suma las tres pistas
    g = 0.89 / pk
    voz *= g; music *= g; sfx *= g; total *= g
print('LUFS total %.1f · voz %.1f · música %.1f · efectos %.1f · pico %.2f dBFS' % (
    lufs(total), lufs(voz), lufs(music), lufs(sfx), 20 * np.log10(np.abs(total).max())))


def write(name, x):
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


write('voz.wav', voz)
write('music.wav', music)
write('sfx.wav', sfx)
write('mix-preview.wav', total)
print('ok')
