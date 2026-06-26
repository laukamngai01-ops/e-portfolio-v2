import { execSync } from 'child_process';
import { statSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const input = 'E:/桌面/test E/01_Web_Projects/Active_Portfolios/E-Portfolio-V2/public/assets_V2/Photography & Videography/04.mp4';
const output = 'E:/桌面/test E/01_Web_Projects/Active_Portfolios/E-Portfolio-V2/public/assets/portfolio/photo_4_poster.jpg';

const cmd = '"' + ffmpegPath + '" -y -ss 1 -i "' + input + '" -vframes 1 -vf "scale=480:-2" -q:v 3 "' + output + '"';
console.log('Running:', cmd);

try {
  execSync(cmd, { stdio: 'pipe', timeout: 30000 });
  console.log('OK:', statSync(output).size, 'bytes');
} catch (e) {
  console.log('stderr:', e.stderr?.toString());
}
