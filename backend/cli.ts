import * as fs from 'fs';
import * as path from 'path';

const loadHierarchy = () => {
  const startLoadTime = Date.now(); // Início do tempo de carregamento
  const filePath = path.join(__dirname, 'dicts', 'hierarchy.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const hierarchy = JSON.parse(data);
  const endLoadTime = Date.now(); // Fim do tempo de carregamento

  return { hierarchy, loadTime: endLoadTime - startLoadTime }; // Retorna a hierarquia e o tempo de carregamento
};

const normalizeString = (str: string): string => {
  return str
    .normalize("NFD") // Normaliza acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/gi, '') // Remove pontuação, mas mantém espaços
    .toLowerCase().trim(); // Converte para minúsculas e remove espaços extras no início/fim
};

const logVerbose = (message: string, verbose: boolean) => {
  if (verbose) {
    console.log(message);
  }
};

const analyzePhrase = (phrase: string, depth: number, verbose: boolean) => {
  const { hierarchy, loadTime } = loadHierarchy(); // Carrega hierarquia e calcula tempo
  const words = phrase.split(/[\s,]+/).map(normalizeString);
  const matches: Record<string, number> = {};
  const verifiedWords = new Set<string>();

  const startVerifyTime = Date.now(); // Início do tempo de verificação da frase

  const searchHierarchy = (rootNode: any, maxDepth: number) => {
    const normalizedCache: { [key: string]: string } = {};

    const getNormalizedKey = (key: string) => {
      if (normalizedCache[key]) return normalizedCache[key];
      const normalizedKey = normalizeString(key);
      normalizedCache[key] = normalizedKey;
      return normalizedKey;
    };

    const stack = [{ node: rootNode, depth: 1 }];
    const maxWordsToCombine = 2; // Reduzir para até 2 palavras combinadas
    let foundAllWords = false;

    while (stack.length > 0 && !foundAllWords) {
      const { node, depth } = stack.pop()!;

      if (depth <= maxDepth) {
        for (let i = 0; i < words.length; i++) {
          if (verifiedWords.has(words[i])) continue;

          for (let j = i + 1; j <= Math.min(words.length, i + maxWordsToCombine); j++) {
            const subPhrase = words.slice(i, j).join(' ');
            const normalizedSubPhrase = normalizeString(subPhrase);

            if (verifiedWords.has(normalizedSubPhrase)) continue;

            if (node && typeof node === 'object') {
              for (const [key, value] of Object.entries(node)) {
                const normalizedKey = getNormalizedKey(key);

                if (normalizedKey === normalizedSubPhrase) {
                  matches[normalizedKey] = (matches[normalizedKey] || 0) + 1;
                  verifiedWords.add(normalizedSubPhrase);

                  // Se todas as palavras foram encontradas, interrompe a busca
                  if (verifiedWords.size === words.length) {
                    foundAllWords = true;
                    break;
                  }
                }

                // Se for uma subcategoria, continue buscando
                if (value && typeof value === 'object' && Object.keys(value).length > 0) {
                  stack.push({ node: value, depth: depth + 1 });
                }
              }
            }
          }

          if (foundAllWords) break;
        }
      }
    }
  };

  searchHierarchy(hierarchy, depth);

  const verifyEnd = Date.now(); // Fim do tempo de verificação da frase

  // Log dos tempos
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
