# Quad · video promocional v3 (63 s)

Video de 1920×1080 a 30 fps hecho con Remotion, sincronizado con la voz en off de ElevenLabs (voz "Luisa", 10 clips).

## Comandos

```
npm install
npm run audio     # genera public/audio/voz.wav, music.wav, sfx.wav y mix-preview.wav
npm run studio    # vista previa
npm run render    # out/quad-promo.mp4 (1920×1080)
npm run render:vertical   # out/quad-promo-vertical.mp4 (1080×1920)
```

El `quad-promo-v3.mp4` entregado lleva la mezcla de `mix-preview.wav` masterizada a −14 LUFS con ffmpeg (`loudnorm=I=-14:TP=-1.2`).

## Escenas

| Frames | Voz | Cámara y transición |
| --- | --- | --- |
| 0–192 | Llegaste a estudiar a la capital. ¿Dónde vas a vivir? ¿Con quién? | Zoom out lento; baja con cada pregunta; zoom a través del punto |
| 180–318 | Entre grupos y anuncios sueltos, nunca sabes en quién confiar. | Llega con zoom; anuncios que se desenfocan; todo colapsa en el punto |
| 315–495 | Conoce Quad, tu vivienda digna para la U, con personas verificadas. | Se aleja del punto mientras se arma el logo; baja a la frase y a las personas |
| 495–752 | Busca por zona: Antiguo Cuscatlán, La Sultana, Santa Tecla. Cada quad te dice cuántos minutos hay a tu universidad. | Acercamiento al buscador; sigue el texto de izquierda a derecha; recorre las zonas; se aleja a las tarjetas |
| 752–836 | Mira las fotos del cuarto y lo que incluye. | Acerca a la galería; se desliza a lo que incluye; latigazo de salida |
| 820–1008 | Conoce a la familia y sus reglas antes de llegar. Aquí nadie llega a ciegas. | Entra desde la derecha; baja a "ciegas" (borroso → nítido); zoom hacia Andrea |
| 998–1170 | Pregúntale lo que quieras a tu anfitrión, agenda una visita y acepta con un toque. | Sale del avatar al chat; se acerca al botón; el check llena la pantalla |
| 1170–1452 | En Quad solo pueden ingresar estudiantes con su cuenta institucional… pueden ofrecer uno. | El azul se encoge al ícono; sigue cada correo; latigazo entre tarjetas; se aleja |
| 1440–1600 | Identidades verificadas, contrato y pagos, todo dentro de Quad. | Sube desde abajo; recorrido con inclinación 3D; el escudo se vuelve el punto |
| 1600–1740 | Hecho para estudiantes foráneos y para familias que abren su casa. | Lee la frase de izquierda a derecha con el punto como cursor |
| 1740–1890 | (solo música) | Barrido azul de abajo hacia arriba y logo |

## Archivos

- `src/camera.tsx` cámara virtual: llaves con curvas de velocidad, zoom logarítmico, inclinación 3D y desenfoque de movimiento direccional.
- `src/QuadPromoVertical.tsx` versión vertical: mismos tiempos y audio, composición adaptada al formato alto.
- `src/QuadPromo.tsx` escenas. `VO` lista el frame donde empieza cada clip de voz.
- `audio/make_audio.py` voz, música (120 BPM, baja sola cuando habla la voz) y efectos. Los tiempos están en frames.
- `public/audio/voz/vo01…vo10.wav` clips de ElevenLabs en orden.
- `archive/` versión anterior (v2, 28 s).
