"""
Quad · música y efectos de sonido sintetizados (sin samples externos, sin licencias).
v2: house a 120 BPM (4 en el piso, palmas en 2 y 4, bajo en contratiempo con
sidechain, arpegio en semicorcheas). Genera public/audio/music.wav y sfx.wav.
Los tiempos de los efectos están en frames (30 fps) y coinciden con QuadPromo.tsx.
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, os

SR = 48000
DUR = 28.0
N = int(SR * DUR)
FPS = 30
BEAT = 0.5          # 120 BPM: un pulso = 15 frames
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
F = lambda fr: fr / FPS


def t_(d):
    return np.arange(int(SR * d)) / SR


def place(buf, sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], 1) * np.sqrt(2)
    s0 = 0
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


def reverb(x, secs=1.8, wet=0.25, damp=6000):
    n = int(SR * secs)
    env = np.exp(-np.linspace(0, 7, n))
    ir = np.stack([filt(rng.standard_normal(n), 'low', damp) * env, filt(rng.standard_normal(n), 'low', damp) * env], 1)
    ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet


# ------------------------------------------------------------------ instrumentos
def kick():
    t = t_(0.32)
    fr = 48 + 110 * np.exp(-t / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.14)
    s[:200] += filt(rng.standard_normal(200), 'high', 2000) * 0.3 * np.linspace(1, 0, 200)
    return np.tanh(1.4 * s) * 0.9


def clap():
    t = t_(0.25)
    n = filt(rng.standard_normal(len(t)), 'band', [900, 4000])
    env = np.zeros_like(t)
    for k, d in enumerate([0, 0.011, 0.022]):
        env += (t >= d) * np.exp(-np.clip(t - d, 0, None) / (0.008 if k < 2 else 0.07))
    return n * env * 0.5


def chat_(open_=False):
    d = 0.22 if open_ else 0.05
    t = t_(d)
    return filt(rng.standard_normal(len(t)), 'high', 7500, 3) * np.exp(-t / (0.07 if open_ else 0.012)) * (0.22 if open_ else 0.13)


def pluck(f0, d=0.35, bright=1.0):
    t = t_(d)
    s = np.sign(np.sin(2 * np.pi * f0 * t)) * 0.35 + np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(4 * np.pi * f0 * t)
    s = filt(s, 'low', 1800 + 3500 * bright)
    return s * np.exp(-t / 0.09) * np.minimum(1, t / 0.002) * 0.12


def bass(f0, d=0.22):
    t = t_(d)
    s = np.tanh(2.2 * (np.sin(2 * np.pi * f0 * t) + 0.3 * np.sin(4 * np.pi * f0 * t)))
    s = filt(s, 'low', 700) * np.minimum(1, t / 0.004) * np.clip((d - t) / 0.03, 0, 1)
    return s * 0.34


def pad_note(f0, d):
    t = t_(d)
    s = np.zeros_like(t)
    for det in (-0.1, 0.0, 0.1):
        ff = f0 * 2 ** (det / 12)
        for h in range(1, 7):
            s += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h ** 1.5
    return s * np.minimum(1, t / 0.08) * np.clip((d - t) / 0.15, 0, 1) * 0.045


def stab(notes, d=0.25):
    s = sum(pluck(midi(m), d, 0.6) for m in notes)
    return s * 0.9


# Progresión (un acorde por compás de 2 s): Dmaj9 · Bm9 · Gmaj9 · A6/9
CH = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [45, 52, 57, 61, 64]]
ROOT = [38, 35, 31, 33]
ARP = [[74, 78, 81, 85, 81, 78, 76, 78], [74, 78, 81, 83, 81, 78, 73, 78],
       [74, 79, 83, 86, 83, 79, 78, 79], [73, 76, 81, 85, 81, 76, 78, 76]]

drums = np.zeros((N, 2)); bassb = np.zeros((N, 2)); syn = np.zeros((N, 2)); pads = np.zeros((N, 2))
side = np.ones(N)  # sidechain

DROP = F(120)       # 4 s: el punto se vuelve el buscador
BREAK = F(690)      # 23 s: se quita la batería
LOCK = F(720)       # 24 s: encaja la Q
FINAL_DROP = F(750)  # 25 s: termina el barrido azul
END_HIT = F(810)    # 27 s: último golpe

def kick_on(tt):
    return (tt < BREAK) or (FINAL_DROP <= tt < END_HIT)

for b in range(int(DUR / BEAT)):
    tt = b * BEAT
    bar = int(tt // 2) % 4
    beat_in_bar = b % 4
    full = DROP <= tt < BREAK or FINAL_DROP <= tt < END_HIT
    if kick_on(tt):
        place(drums, kick(), tt, 1.0 if full else 0.75)
        # sidechain: baja el resto 220 ms en cada bombo
        i = int(tt * SR); n = int(0.22 * SR)
        side[i:i + n] = np.minimum(side[i:i + n], 1 - 0.6 * np.exp(-np.arange(n) / (0.06 * SR)))
    if full and beat_in_bar in (1, 3):
        place(drums, clap(), tt, 0.9, 0.05)
    if tt < BREAK or tt >= FINAL_DROP:
        for k in range(4):     # semicorcheas de charles
            if tt + k * BEAT / 4 < END_HIT:
                place(drums, chat_(), tt + k * BEAT / 4, (1.0 if k == 2 else 0.55) * (1 if full else 0.6), 0.3)
        if full and tt >= F(240):
            place(drums, chat_(True), tt + BEAT / 2, 0.8, -0.25)
    # bajo en contratiempo
    if full:
        place(bassb, bass(midi(ROOT[bar])), tt + BEAT / 2, 1.0)
        if beat_in_bar == 3:
            place(bassb, bass(midi(ROOT[bar] + 12), 0.1), tt + BEAT * 0.75, 0.6)
    # arpegio en semicorcheas
    if tt < END_HIT:
        for k in range(4):
            idx = (beat_in_bar * 4 + k) % 8
            note = ARP[bar][idx]
            bright = 1.0 if full else 0.25
            place(syn, pluck(midi(note), 0.3, bright), tt + k * BEAT / 4, (0.9 if k % 2 == 0 else 0.6), pan=[-0.4, 0.4][k % 2])
    # acordes cortos en el contratiempo del 2 y 4
    if full and beat_in_bar in (1, 3):
        place(syn, stab(CH[bar][1:]), tt + BEAT / 2, 0.55)
    if beat_in_bar == 0:
        for m in CH[bar]:
            place(pads, pad_note(midi(m + 12), 2.0), tt, 1.0 if full else 0.7, rng.uniform(-0.5, 0.5))

# intro con filtro que se abre hacia el drop
intro = int(DROP * SR)
mix_pre = syn[:intro] + pads[:intro]
seg = 8
out = np.zeros_like(mix_pre)
for s in range(seg):
    a, b2 = s * intro // seg, (s + 1) * intro // seg
    fc = 500 * (6000 / 500) ** (s / (seg - 1))
    out[a:b2] = filt(mix_pre[max(0, a - 2000):b2], 'low', fc)[-(b2 - a):]
syn[:intro] = out; pads[:intro] = 0

# subidas de ruido: hacia el drop (4 s) y hacia el barrido (25 s)
def riser(d):
    t = t_(d); x = rng.standard_normal(len(t)); y = np.zeros_like(t)
    for k, (lo, hi) in enumerate([(400, 1200), (1200, 3500), (3500, 9000)]):
        y += filt(x, 'band', [lo, hi]) * np.clip((t / d) * 3 - k, 0, 1)
    return y * (t / d) ** 2 * 0.25

place(syn, riser(2.0), DROP - 2.0, 0.8)
place(syn, riser(FINAL_DROP - BREAK), BREAK, 1.0)
# redoble de palmas en el corte
for k in range(16):
    tt = BREAK + (FINAL_DROP - BREAK) * (1 - 0.5 ** (k / 3)) if False else BREAK + k * (FINAL_DROP - BREAK) / 16
    place(drums, clap(), tt, 0.25 + 0.5 * k / 16)

# golpes: crash suave en los drops + acorde final
def crash():
    t = t_(1.6)
    return filt(rng.standard_normal(len(t)), 'high', 5000) * np.exp(-t / 0.45) * 0.18

place(drums, crash(), DROP, 1.0)
place(drums, crash(), FINAL_DROP, 1.2)
fin = np.zeros((N, 2))
for m in [38, 50, 57, 62, 64, 66, 69, 73]:
    place(fin, pad_note(midi(m), DUR - END_HIT) * 2.0, END_HIT, 1.0, rng.uniform(-0.6, 0.6))
place(fin, kick(), END_HIT, 1.0)
place(fin, crash(), END_HIT, 1.0)
place(fin, stab([62, 66, 69, 73], 1.2), END_HIT, 1.2)

sc = side[:, None]
music = drums + bassb * sc + reverb(syn, 1.4, 0.22) * sc + reverb(pads, 2.2, 0.35) * sc + reverb(fin, 2.6, 0.3)
tt = np.arange(N) / SR
music *= np.clip((DUR - tt) / 0.6, 0, 1)[:, None]
music = np.tanh(music * 1.3) / 1.3

# ------------------------------------------------------------------ efectos
def whoosh(d=0.28, lo=600, hi=7500, peak=0.75):
    n = int(SR * d); x = rng.standard_normal(n); tn = np.arange(n) / n
    fc = lo * (hi / lo) ** np.clip(tn / peak, 0, 1)
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros(n); z = 0.0
    for i in range(n):
        z = a[i] * z + (1 - a[i]) * x[i]; y[i] = z
    y = filt(y, 'high', 200)
    env = np.where(tn < peak, (tn / peak) ** 2.5, np.exp(-(tn - peak) / 0.06))
    body = np.sin(2 * np.pi * np.cumsum(120 + 300 * np.clip(tn / peak, 0, 1)) / SR) * env * 0.15
    y = y * env / (np.abs(y * env).max() + 1e-9) + body
    return y


def pop(f0=520, f1=300, d=0.1):
    t = t_(d); fr = f1 + (f0 - f1) * np.exp(-t / 0.015)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.03) * np.minimum(1, t / 0.0015)


def tick(f0=2600, d=0.03):
    t = t_(d)
    return np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.006) + filt(rng.standard_normal(len(t)), 'band', [2000, 6000]) * np.exp(-t / 0.004) * 0.4


def key():
    t = t_(0.03)
    return filt(rng.standard_normal(len(t)), 'band', [1500, 5000]) * np.exp(-t / 0.005) + np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.004) * 0.3


def chirp(a=900, b=1600):
    t = t_(0.14); fr = a + (b - a) * np.clip(t / 0.05, 0, 1)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.045) * np.minimum(1, t / 0.002)


def thump():
    t = t_(0.6); fr = 42 + 60 * np.exp(-t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.25) + filt(rng.standard_normal(len(t)), 'low', 300) * np.exp(-t / 0.03) * 0.4


sfx = np.zeros((N, 2))


def W(frame, d=0.28, g=0.3, lo=600, hi=7500):
    w = whoosh(d, lo, hi)
    place(sfx, np.stack([w, np.roll(w, 80)], 1), F(frame) - d * 0.75, g)


rp = lambda a, b: rng.uniform(a, b)
place(sfx, pop(760, 420), F(0), 0.32)
for fr in range(4, 24, 2): place(sfx, key(), F(fr), 0.04, rp(-0.3, 0.3))
W(38, 0.22, 0.22)
for k, fr in enumerate([40, 55, 70]):
    place(sfx, pop(480 + k * 90, 300 + k * 50), F(fr + 2), 0.26); place(sfx, tick(2400 + k * 300), F(fr), 0.08)
W(86, 0.22, 0.24)
for fr in range(88, 102, 2): place(sfx, key(), F(fr), 0.04, rp(-0.3, 0.3))
W(120, 0.4, 0.34, 400, 6000)
place(sfx, pop(420, 260), F(128), 0.3)
for fr in range(137, 154): place(sfx, key(), F(fr), 0.09 if fr % 2 else 0.06, rp(-0.2, 0.2))
W(160, 0.2, 0.16)
for k, fr in enumerate([160, 164, 168]): place(sfx, pop(560 + k * 70, 320 + k * 30), F(fr + 6), 0.3, [-0.4, 0, 0.4][[1, 0, 2][k]])
place(sfx, tick(2400), F(174), 0.12)
place(sfx, chirp(), F(189), 0.12)
W(214, 0.36, 0.34, 350, 6000)
for fr in (228, 233, 236): place(sfx, pop(700, 450, 0.08), F(fr + 2), 0.16)
place(sfx, pop(520, 300), F(246), 0.28); place(sfx, pop(640, 380), F(250), 0.24)
for fr in range(252, 268, 2): place(sfx, tick(3000 + (fr - 252) * 60, 0.02), F(fr), 0.05)
place(sfx, chirp(1000, 1800), F(282), 0.15)
W(292, 0.22, 0.24)
w = whoosh(0.2, 900, 5000); place(sfx, np.stack([w, w * 0.5], 1), F(304) - 0.15, 0.14)
for k, fr in enumerate([310, 314, 318, 322]): place(sfx, pop(560 + k * 70, 320 + k * 40), F(fr + 3), 0.27, -0.3 + k * 0.2)
for k, fr in enumerate([332, 338, 344]): place(sfx, tick(2300 + k * 250), F(fr + 3), 0.12)
place(sfx, chirp(), F(377), 0.12)
W(394, 0.3, 0.3)
for k, fr in enumerate([414, 426, 440, 452, 466]):
    mine = k in (1, 3)
    place(sfx, pop(780 if mine else 540, 440 if mine else 310), F(fr + 2), 0.3, 0.35 if mine else -0.35)
place(sfx, tick(1900), F(PRESS := 490), 0.25); place(sfx, tick(1500), F(493), 0.18)
place(sfx, chirp(), F(500), 0.22)
W(514, 0.3, 0.3)
place(sfx, pop(380, 220, 0.18), F(524), 0.34)
for k, fr in enumerate([542, 550, 558]): place(sfx, pop(700 + k * 120, 500 + k * 80, 0.08), F(fr + 2), 0.18)
W(604, 0.28, 0.28)
for fr, img in [(618, 0), (625, 0), (632, 1), (638, 0), (650, 0), (656, 1), (662, 0)]:
    place(sfx, pop(600, 360) if img else key(), F(fr), 0.26 if img else 0.12)
place(sfx, tick(2800), F(680), 0.1)
W(702, 0.24, 0.26)
place(sfx, thump(), F(720), 0.34); place(sfx, pop(900, 600), F(720), 0.1)
W(748, 0.5, 0.4, 250, 6500)
for fr in range(754, 764, 2): place(sfx, key(), F(fr), 0.06)
place(sfx, pop(820, 520), F(768), 0.28)

sfx = reverb(sfx, 1.0, 0.15, 7000)


def write(name, x, peak_db):
    x = x / (np.abs(x).max() + 1e-9) * 10 ** (peak_db / 20)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


write('music.wav', music, -7.5)
write('sfx.wav', sfx, -5.0)
print('ok')
