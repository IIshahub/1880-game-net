const OUTPUT_SIZE = 512;
const JPEG_QUALITY = 0.88;
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

/** Crop upper-center square (head focus) and return a JPEG data URL — same idea as Ali. */
export async function cropCharacterPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Image too large (max 8MB)');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const w = img.width;
    const h = img.height;
    const cropH = h * 0.42;
    const cropW = Math.min(w, cropH);
    const sx = (w - cropW) / 2;
    const sy = h * 0.06;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
