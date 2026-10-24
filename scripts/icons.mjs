// Renders the favicons and the JSON-LD logo into public/ (docs/spec.md, section 5.4):
// favicon.svg, favicon.ico (32 × 32), apple-touch-icon.png (180 × 180, opaque) from the
// glyph in src/assets/happy-dwarf-glyph.svg, and logo.png (512 × 512) from the full team
// logo in src/assets/happy-dwarf.svg. The files are committed; run this again when a mark
// changes: node scripts/icons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const path = (relative) =>
	decodeURIComponent(new URL(relative, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');

// The glyph's currentColor becomes forge orange; colours are the tokens of DESIGN.md.
const glyph = readFileSync(path('../src/assets/happy-dwarf-glyph.svg'), 'utf8')
	.replace(/^<svg[^>]*>/, '')
	.replace(/<\/svg>\s*$/, '')
	.replaceAll('currentColor', '#f5922a');

// The favicon tile: #16171a, rx 6 on the 32 grid.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="#16171a"/>${glyph}</svg>\n`;
writeFileSync(path('../public/favicon.svg'), favicon);

// An ICO file holding one 32 × 32 PNG: a 6-byte header and one 16-byte directory entry.
const png32 = await sharp(Buffer.from(favicon)).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(header.length, 18); // offset of the PNG
writeFileSync(path('../public/favicon.ico'), Buffer.concat([header, png32]));

// iOS rounds the corners itself and shows transparency as black, so the tile fills the
// square and the glyph gets a margin.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" width="720" height="720"><rect width="38" height="38" fill="#16171a"/><g transform="translate(3 3)">${glyph}</g></svg>`;
await sharp(Buffer.from(touch))
	.resize(180, 180)
	.flatten({ background: '#16171a' })
	.png({ compressionLevel: 9 })
	.toFile(path('../public/apple-touch-icon.png'));

// The full team logo keeps its gradients and its transparent background.
await sharp(path('../src/assets/happy-dwarf.svg'), { density: 72 * 2 })
	.resize(512, 512)
	.png({ compressionLevel: 9 })
	.toFile(path('../public/logo.png'));

console.log('Wrote public/favicon.svg, favicon.ico, apple-touch-icon.png and logo.png');
