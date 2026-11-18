import {
  DataTexture, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace,
} from 'three';

const size = 192;

function categoryEngraving(x, y) {
  const dx = Math.abs(x - .5), dy = Math.abs(y - .5);
  const hex = Math.max(dy, .866 * dx + .5 * dy);
  return Math.abs(hex - .30) < .013 || Math.abs(hex - .21) < .010;
}

function repositoryEngraving(x, y) {
  for (const i of [-1, 0, 1]) {
    const row = .50 + i * .128;
    if ((x > .17 && x < .62 && Math.abs(y - row) < .017) ||
        (x >= .62 && x < .77 && Math.abs(y - row - (x - .62) * .55) < .019) ||
        Math.hypot(x - .78, y - row - .087) < .033 ||
        Math.hypot(x - .16, y - row) < .029) return true;
  }
  return false;
}

function algorithmEngraving(x, y) {
  const r = Math.hypot(x - .5, y - .5);
  return Math.abs(r - .17) < .009 || Math.abs(r - .32) < .013 ||
    (r > .36 && r < .41 && (Math.abs(x - .5) < .012 || Math.abs(y - .5) < .012));
}

function texture(values, colored) {
  const result = new DataTexture(values, size, size);
  if (colored) result.colorSpace = SRGBColorSpace;
  result.magFilter = LinearFilter;
  result.minFilter = LinearMipmapLinearFilter;
  result.generateMipmaps = true;
  result.needsUpdate = true;
  return result;
}

export function createLayeredTextures() {
  let seed = 7143;
  return Object.fromEntries(Object.entries({
    category: categoryEngraving, file: repositoryEngraving,
    algorithm: algorithmEngraving,
  }).map(([kind, motif]) => {
    const pigment = new Uint8Array(size * size * 4);
    const finish = new Uint8Array(pigment.length);
    for (let i = 0; i < size * size; i++) {
      const x = (i % size + .5) / size, y = (Math.floor(i / size) + .5) / size;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = ((seed >>> 24) / 255 - .5) * 15;
      const etched = motif(x, y);
      const softEdge = Math.max(0, Math.abs(x - .5) + Math.abs(y - .5) - .52) * 18;
      const brushed = kind === 'file' ? 3 * Math.sin(i % size * 1.73) : 0;
      const tone = Math.round(236 + grain + brushed - softEdge - (etched ? 52 : 0));
      const rough = Math.round(143 + grain * 1.8 + (etched ? 35 : 0));
      pigment.set([tone, tone, tone, 255], i * 4);
      finish.set([rough, rough, rough, 255], i * 4);
    }
    return [kind, { map: texture(pigment, true), roughnessMap: texture(finish, false) }];
  }));
}
