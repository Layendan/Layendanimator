import { execa } from 'execa';
import { copyFileSync } from 'fs';

let extension = '';
if (process.platform === 'win32') {
  extension = '.exe';
}

async function main() {
  const rustInfo = (await execa('rustc', ['-vV'])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)?.[1];
  console.log(`targetTriple: ${targetTriple}`);
  if (!targetTriple) {
    console.error('Failed to determine platform target triple');
  }
  copyFileSync(
    `FFmpeg/ffmpeg${extension}`,
    `src-tauri/bin/ffmpeg-${targetTriple}${extension}`
  );
}

main().catch(e => {
  throw e;
});
