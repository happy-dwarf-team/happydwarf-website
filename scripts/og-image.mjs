// Renders public/og.png, the 1200×630 social preview image, from the full team logo
// (docs/spec.md, section 5.3). The image is committed; run this again when the logo or the
// wording changes: node scripts/og-image.mjs
// Text uses the system's monospace font (JetBrains Mono when installed).
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync(new URL('../src/assets/happy-dwarf.svg', import.meta.url), 'utf8')
	.replace(/^<svg[^>]*>/, '')
	.replace(/<\/svg>\s*$/, '')
	.replace(/<title>.*?<\/title>/, '');

// Colours are the --forge-* tokens and the site accent from DESIGN.md.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="#16171a"/>
	<rect y="622" width="1200" height="8" fill="#f5922a"/>
	<g transform="translate(80 155) scale(1.25)">${logo}</g>
	<g font-family="JetBrains Mono, Consolas, DejaVu Sans Mono, monospace">
		<text x="448" y="282" fill="#e8e6e3" font-size="88" font-weight="800" letter-spacing="4">HAPPY DWARF</text>
		<text x="452" y="354" fill="#a8a29e" font-size="34">Tools and mods for</text>
		<text x="452" y="400" fill="#a8a29e" font-size="34">Europa Universalis IV</text>
		<text x="452" y="482" fill="#f5922a" font-size="28">happydwarf.dev</text>
	</g>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(
	decodeURIComponent(new URL('../public/og.png', import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'),
);
console.log('Wrote public/og.png');
