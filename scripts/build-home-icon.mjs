import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseGIF, decompressFrames } from "gifuct-js";
import gifenc from "gifenc";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcPath = path.join(rootDir, "src/assets/icons/home-animated.gif");
const lightOut = path.join(rootDir, "src/assets/icons/home-animated-transparent.gif");

const gif = parseGIF(fs.readFileSync(srcPath));
const frames = decompressFrames(gif, true);
const width = gif.lsd.width;
const height = gif.lsd.height;

const canvas = new Uint8ClampedArray(width * height * 4);

const blitFrame = (frame) => {
  const { top, left, width: frameWidth, height: frameHeight } = frame.dims;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const sourceIndex = y * frameWidth + x;
      const colorIndex = frame.pixels[sourceIndex];

      if (colorIndex === frame.transparentIndex) {
        continue;
      }

      const [r, g, b] = frame.colorTable[colorIndex] || [0, 0, 0];
      const targetIndex = ((top + y) * width + (left + x)) * 4;
      canvas[targetIndex] = r;
      canvas[targetIndex + 1] = g;
      canvas[targetIndex + 2] = b;
      canvas[targetIndex + 3] = 255;
    }
  }
};

const cloneCanvas = () => new Uint8ClampedArray(canvas);

const isBackgroundWhite = (r, g, b) => r >= 245 && g >= 245 && b >= 245;

const removeBackgroundWhite = (rgba, imageWidth, imageHeight) => {
  const visited = new Uint8Array(imageWidth * imageHeight);
  const queue = [];

  const tryPush = (x, y) => {
    const visitIndex = y * imageWidth + x;
    if (visited[visitIndex]) {
      return;
    }

    const pixelIndex = visitIndex * 4;
    if (!isBackgroundWhite(rgba[pixelIndex], rgba[pixelIndex + 1], rgba[pixelIndex + 2])) {
      return;
    }

    visited[visitIndex] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < imageWidth; x += 1) {
    tryPush(x, 0);
    tryPush(x, imageHeight - 1);
  }

  for (let y = 0; y < imageHeight; y += 1) {
    tryPush(0, y);
    tryPush(imageWidth - 1, y);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const pixelIndex = (y * imageWidth + x) * 4;
    rgba[pixelIndex] = 0;
    rgba[pixelIndex + 1] = 0;
    rgba[pixelIndex + 2] = 0;
    rgba[pixelIndex + 3] = 0;

    if (x > 0) tryPush(x - 1, y);
    if (x < imageWidth - 1) tryPush(x + 1, y);
    if (y > 0) tryPush(x, y - 1);
    if (y < imageHeight - 1) tryPush(x, y + 1);
  }
};

const findTransparentIndex = (palette) => {
  for (let i = 0; i < palette.length; i += 1) {
    if (palette[i][3] === 0) {
      return i;
    }
  }
  return 0;
};

const encodeGif = (frameRgbaList, delays, outputPath) => {
  const encoder = GIFEncoder();

  frameRgbaList.forEach((rgba, index) => {
    const palette = quantize(rgba, 256);
    const transparentIndex = findTransparentIndex(palette);
    const indexed = applyPalette(rgba, palette);

    encoder.writeFrame(indexed, width, height, {
      palette,
      delay: delays[index] || 50,
      transparent: true,
      transparentIndex,
      repeat: 0,
      dispose: 2,
    });
  });

  encoder.finish();
  fs.writeFileSync(outputPath, Buffer.from(encoder.bytes()));
};

const lightFrames = [];
const delays = [];

for (const frame of frames) {
  blitFrame(frame);
  const snapshot = cloneCanvas();

  const lightRgba = new Uint8ClampedArray(snapshot);
  removeBackgroundWhite(lightRgba, width, height);
  lightFrames.push(lightRgba);

  delays.push(frame.delay || 50);
}

encodeGif(lightFrames, delays, lightOut);

console.log(`Built ${lightFrames.length} frames -> ${lightOut}`);
