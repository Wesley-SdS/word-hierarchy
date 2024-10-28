import * as fs from 'fs';
import * as path from 'path';


const loadHierarchy = () => {
  const startLoadTime = Date.now();
  const filePath = path.resolve(process.cwd(), 'dicts', 'hierarchy.json');

  const data = fs.readFileSync(filePath, 'utf-8');
  const hierarchy = JSON.parse(data);
  const endLoadTime = Date.now();

  return { hierarchy, loadTime: endLoadTime - startLoadTime };
};


const normalizeString = (() => {
  const cache: { [key: string]: string } = {};
  return (str: string): string => {
    if (cache[str]) return cache[str];
    const normalized = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
      .trim();
    cache[str] = normalized;
    return normalized;
  };
})();

const analyzePhrase = (phrase: string, depth: number, verbose: boolean) => {
  const { hierarchy, loadTime } = loadHierarchy();
  const words = phrase.split(/[\s,]+/).map(normalizeString);
  const matches: Record<string, number> = {};
  const verifiedWords = new Set<string>();

  const startVerifyTime = Date.now();

  const searchHierarchy = (rootNode: any, maxDepth: number) => {
    const normalizedCache: { [key: string]: string } = {};

    const getNormalizedKey = (key: string) => {
      if (normalizedCache[key]) return normalizedCache[key];
      const normalizedKey = normalizeString(key);
      normalizedCache[key] = normalizedKey;
      return normalizedKey;
    };

    const stack = [{ node: rootNode, depth: 1 }];
    const maxWordsToCombine = 2;

    while (stack.length > 0) {
      const { node, depth } = stack.pop()!;

      if (depth <= maxDepth && node && typeof node === 'object') {
        for (let i = 0; i < words.length; i++) {
          if (verifiedWords.has(words[i])) continue;

          for (let j = i + 1; j <= Math.min(words.length, i + maxWordsToCombine); j++) {
            const subPhrase = words.slice(i, j).join(' ');
            const normalizedSubPhrase = normalizeString(subPhrase);

            if (verifiedWords.has(normalizedSubPhrase)) continue;

            for (const [key, value] of Object.entries(node)) {
              const normalizedKey = getNormalizedKey(key);

              if (normalizedKey === normalizedSubPhrase) {
                matches[normalizedKey] = (matches[normalizedKey] || 0) + 1;
                verifiedWords.add(normalizedSubPhrase);

                if (verifiedWords.size === words.length) return;
              }

              if (value && typeof value === 'object' && Object.keys(value).length > 0) {
                stack.push({ node: value, depth: depth + 1 });
              }
            }
          }
        }
      }
    }
  };

  searchHierarchy(hierarchy, depth);
  const verifyEnd = Date.now();

  if (verbose) {
    console.log(`Tempo de carregamento dos parâmetros: ${loadTime}ms`);
    console.log(`Tempo de verificação da frase: ${verifyEnd - startVerifyTime}ms`);
  }

  if (Object.keys(matches).length === 0) {
    console.log('0');
  } else {
    console.log(
      Object.entries(matches)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} = ${value}`)
        .join('; ')
    );
  }
};

const main = () => {
  const args = process.argv.slice(2);
  const depthIndex = args.indexOf('--depth');
  const phraseIndex = args.indexOf('--phrase');
  const verboseIndex = args.indexOf('--verbose');

  if (depthIndex === -1 || phraseIndex === -1) {
    console.error('Erro: Parâmetros obrigatórios --depth e --phrase não fornecidos.');
    process.exit(1);
  }

  const depth = parseInt(args[depthIndex + 1], 10);
  const phrase = args[phraseIndex + 1];
  const verbose = verboseIndex !== -1;

  analyzePhrase(phrase, depth, verbose);
};

if (require.main === module) {
  main();
};
export { analyzePhrase };