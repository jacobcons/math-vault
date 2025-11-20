import jsdom from 'jsdom';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const { JSDOM } = jsdom;

const TOPIC_RESOURCES_PATH = path.join(import.meta.dirname, '..', 'data', 'topic-resources');

function isDefined<T>(value: T): value is Exclude<T, undefined | null> {
  return value !== undefined && value !== null;
}

async function parseCorbett() {
  const corbett = await readFromGptKnowledge('corbettmaths-worksheets.html');
  const { window } = new JSDOM(corbett);
  const { document } = window;

  return Array.from(document.querySelectorAll('.entry-content p'))
    .map((p) => {
      // map each <p> to the topic name and it's links, otherwise ignore it
      const links = Object.fromEntries(
        Array.from(p.querySelectorAll('a'))
          .map((a) => {
            const aText = a.textContent.toLowerCase();
            if (aText.includes('video')) return ['video', a.href];
            if (aText.includes('practice')) return ['practiceQuestions', a.href];
            if (aText.includes('textbook')) return ['textbookExercises', a.href];
            return undefined;
          })
          .filter(isDefined),
      );

      const topic = Array.from(p.childNodes)
        .find((n) => n.nodeType === window.Node.TEXT_NODE)
        ?.textContent?.trim();
      return topic && Object.keys(links).length ? { topic, ...links } : undefined;
    })
    .filter(isDefined);
}

async function parseDfm() {
  const dfm = JSON.parse(await readFromGptKnowledge('dfm-module-info.json'));

  return dfm.modules
    .flatMap((m) => m.units)
    .flatMap((u) => u.skills)
    .map((s) => {
      const subskills = s.subskills
        .map((ss) => ss.letter && `${ss.letter} ${ss.name}`)
        .filter(isDefined);
      return {
        skill: s.name,
        link: `https://www.drfrost.org/explorer.php?skid=${s.skid}`,
        subskills,
      };
    });
}

async function parseMathsGenie() {
  const mathsgenie = await readFromGptKnowledge('mathsgenie-worksheets.html');

  const { window } = new JSDOM(mathsgenie);
  const { document } = window;
  const prependDomain = (path: string) =>
    path ? `https://www.mathsgenie.co.uk/${path}` : undefined;

  return Array.from(document.querySelectorAll('tr'))
    .map((tr) => {
      const tds = tr.querySelectorAll('td');

      const topic = tds[1]?.querySelector('a')?.textContent;
      const videoHref = tds[1]?.querySelector('a')?.href;
      const video = videoHref ? prependDomain(videoHref) : undefined;
      const examQuestionsHref = tds[2]?.querySelector('a')?.href;
      const examQuestions = examQuestionsHref ? prependDomain(examQuestionsHref) : undefined;
      const examQuestionsBookletHref = tds[3]?.querySelector('a')?.href;
      const examQuestionsBooklet = examQuestionsBookletHref
        ? prependDomain(examQuestionsBookletHref)
        : undefined;
      const solutionsHref = tds[4]?.querySelector('a')?.href;
      const solutions = solutionsHref ? prependDomain(solutionsHref) : undefined;

      const topicData = {
        ...(topic ? { topic } : {}),
        ...(video ? { video } : {}),
        ...(examQuestions ? { examQuestions } : {}),
        ...(examQuestionsBooklet ? { examQuestionsBooklet } : {}),
        ...(solutions ? { solutions } : {}),
      };
      return Object.keys(topicData).length ? topicData : undefined;
    })
    .filter(isDefined);
}

async function readFromGptKnowledge(filename: string) {
  return readFile(path.join(TOPIC_RESOURCES_PATH, 'raw', filename), 'utf-8');
}

async function main() {
  console.time();
  await writeFile(
    path.join(TOPIC_RESOURCES_PATH, 'parsed', 'corbett.json'),
    JSON.stringify(await parseCorbett(), null, 2),
  );
  await writeFile(
    path.join(TOPIC_RESOURCES_PATH, 'parsed', 'maths-genie.json'),
    JSON.stringify(await parseMathsGenie(), null, 2),
  );
  await writeFile(
    path.join(TOPIC_RESOURCES_PATH, 'parsed', 'dfm.json'),
    JSON.stringify(await parseDfm(), null, 2),
  );
  console.timeEnd();
}

await main();
