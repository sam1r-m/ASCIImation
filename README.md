# ascii-mator

turn video into ascii motion. a next.js + typescript app that converts video to real-time ascii art with per-cell color, dithering, edge detection, and client-side export.

## run locally

```bash
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000). click "open editor", upload a video, and tweak.

## how it works

### pipeline

```
video file → <video> element → canvas drawImage (downscale to grid) → ImageData
  → luma extraction (BT.601)
  → brightness / contrast / gamma / invert
  → blur (box blur)
  → edge detection (sobel / canny / laplacian) + blend
  → dithering (floyd-steinberg / bayer / atkinson)
  → charset mapping (luma → character)
  → per-cell RGB color extraction
  → optional palette quantization (median-cut)
  → AsciiFrame { lines, colors, cols, rows }
  → canvas fillText rendering
```

all processing happens client-side. no server-side ffmpeg, no api calls. the preview runs a `requestAnimationFrame` loop throttled to your fps cap.

### rendering

ascii is rendered to a `<canvas>` using `ctx.fillText()` with a monospace font. in monochrome mode, each line is a single `fillText` call (fast). in color mode, each character gets its own `fillStyle` (slower but gives per-cell color).

### export

- **GIF**: uses [gifenc](https://github.com/mattdesl/gifenc) (~15KB). renders frames to an offscreen canvas, quantizes with gifenc's built-in quantizer, and encodes. good for short clips. large grids + many frames = big files + slow encoding.
- **WebM**: uses `canvas.captureStream()` + `MediaRecorder`. browser-native, no extra libs. only works if the browser supports `video/webm` recording (chrome, firefox, edge — not safari).
- **MP4**: not available client-side without wasm ffmpeg. the UI explains this.

### project structure

```
src/
  app/              # next.js app router pages
  components/       # react components
    ui/             # reusable atoms (accordion, slider, etc.)
    landing/        # landing page hero
    editor/         # editor shell, preview, control panel
      sections/     # individual control panel sections
  hooks/            # react hooks (video decoder, pipeline, export)
  lib/
    ascii/          # core algorithms (pure functions, no react)
      types.ts      # shared types
      sampler.ts    # downsample + extract luma/color
      luma.ts       # brightness/contrast/gamma/invert
      charsets.ts   # character set definitions
      dither.ts     # floyd-steinberg, bayer, atkinson
      blur.ts       # box blur
      edges.ts      # sobel, canny, laplacian
      palette.ts    # median-cut color quantization
      pipeline.ts   # orchestrator: ImageData → AsciiFrame
      renderer.ts   # AsciiFrame → canvas fillText
      presets.ts    # preset definitions + randomizer
    export/         # gif + webm export
    decode/         # (reserved for webcodecs)
  store/            # zustand state management
```

## performance tips

- **grid size matters most.** 80-120 cols is the sweet spot. 200+ cols will be slow, especially with color enabled.
- **fps cap.** keep it at 15-24 for preview. higher = more work per second.
- **color mode** is ~3-5x slower than mono (one fillText per cell vs per line).
- **dithering** adds overhead. floyd-steinberg and atkinson are error-diffusion (sequential, can't parallelize easily). bayer is fast (no dependencies between cells).
- **edge detection** adds a convolution pass. canny is the slowest (blur + sobel + nms + threshold). sobel and laplacian are fast.
- **export** processes frames sequentially by seeking through the video. large duration + high fps = many frames = slow.

## deploy on vercel

works with default vercel settings. no server-side processing needed — everything is client-side.

```bash
npm run build
```

## dependencies

- **next** 15 — app router, react 19
- **tailwindcss** 4 — styling
- **framer-motion** — page transitions + accordion animations
- **zustand** — settings state + localStorage persistence
- **gifenc** — lightweight gif encoding (MIT, ~15KB)

## limitations

- no audio in exports (ascii video only)
- gif quality degrades with large palettes / high resolution
- webm export not available in safari (no MediaRecorder support)
- very long videos may cause memory pressure during export
- webcodecs decoding not yet implemented (using video element + canvas fallback)
