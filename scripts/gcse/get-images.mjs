import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';

async function downloadImage(savePath, urlPath) {
  await wait(100);
  const res = await fetch(`https://drfrost.org/${urlPath}`);
  if (!res.ok) {
    console.log(savePath);
    console.log(urlPath);
    throw new Error(`Fetch failed: ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const dirPath = join(import.meta.dirname, '..', '..', 'public', 'assets');
  await mkdir(join(dirPath, dirname(savePath)), {
    recursive: true,
  });
  await writeFile(join(dirPath, savePath), buffer);
}

function extractImagePaths(s) {
  const ms = [...s.matchAll(/src="(.+?)"/g)];
  return ms.map((m) => m[1]);
}

// NEEDED TO DOWNLOAD IMAGES IN QUESTIONS BEYOND FIRST ONE HENCE THE SLICE
async function main() {
  const exams = JSON.parse(await readFile(join(import.meta.dirname, 'gcse.json'), 'utf-8'));
  let i = 0;
  for (const e of exams) {
    for (const q of e.questions) {
      const questionImageUrls = extractImagePaths(q.content);
      const answerImageUrls = extractImagePaths(q.response);

      for (const qImageUrl of questionImageUrls.slice(1)) {
        if (qImageUrl.startsWith('data:image')) continue;
        await downloadImage(qImageUrl, qImageUrl);
      }

      for (const aImageUrl of answerImageUrls.slice(1)) {
        if (aImageUrl.startsWith('data:image')) continue;
        await downloadImage(aImageUrl, aImageUrl);
      }

      // if (q.img) {
      //   const parts = q.img.split('public_html');
      //   const imgPath = parts[parts.length - 1];
      //   await downloadImage(q.img, imgPath);
      // }
    }
    i += 1;
    console.log(`Finished exam ${i}/${exams.length}`);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await main();
