# ascii-mation

real-time video to ascii converter built with next.js and typescript. upload any video and it gets turned into animated ascii art, frame by frame, with everything running client-side in the browser. Access at: https://ascii-mation.vercel.app

## features

- converts video to ascii in real time using canvas
- full image processing pipeline: brightness, contrast, gamma, blur, edge detection (sobel/canny/laplacian), dithering (floyd-steinberg, bayer, atkinson)
- per-cell color support with palette quantization
- multiple export formats: gif, webm, mp4, and html+js for embedding in your own projects
- presets + a randomizer for quick starting points

## rendering pipeline

```
video -> canvas drawImage (downscale) -> pixel data
  -> luma extraction -> adjustments (brightness/contrast/gamma)
  -> blur -> edge detection -> dithering -> character mapping
  -> color extraction -> palette quantization
  -> render to canvas with fillText
```

entire process runs in a requestAnimationFrame loop. each frame goes through the pipeline and gets rendered to a canvas using fillText with a monospace font (i chose monospace due to its character size properties)

## export

- **gif** — uses gifenc (~15kb lib). good for short clips
- **webm** — uses MediaRecorder api. chrome/firefox/edge only
- **mp4** — also MediaRecorder. works in most modern browsers
- **html + js** - exports your frames as a standalone player you can drop into any project. downloads a `frames.js` with the frame data and an `animation.html` with a simple player function. probably the most useful one if you want to embed ascii animations in your own site

## performance notes

- grid size is the biggest factor. 80-120 cols is the sweet spot, going above 200 gets sluggish especially with color on
- color mode is noticeably slower than mono (one fillText call per character vs per line)
- floyd-steinberg and atkinson dithering are sequential so they add overhead. bayer is fast
- canny edge detection is the heaviest (does blur + sobel + threshold under the hood)

## potential improvements

- audio support in exports?
- webcodecs for faster video decoding (currently using video element + canvas which works fine but isn't the fastest)
- better gif quality at high resolutions (gifenc's palette quantizer is limiting)
- safari webm/mp4 recording support
- memory optimization for really long videos during export

## run locally

```bash
npm install
npm run dev
```

open http://localhost:xxxx

## stack

next.js, react, typescript, tailwind v4, zustand, framer-motion, gifenc
