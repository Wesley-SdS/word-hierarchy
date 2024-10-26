import * as fs from 'fs';
import * as path from 'path';

// Função para carregar a hierarquia do arquivo JSON
const loadHierarchy = () => {
  const filePath = path.join(__dirname, 'dicts', 'hierarchy.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Função para normalizar strings (remover acentos, minúsculas, etc.)
const normalizeString = (str: string) => {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Função para logs de verbose
const logVerbose = (message: string, verbose: boolean) => {
  if (verbose) {
    console.log(message);
  }
};

// Função para analisar a frase
export const analyzePhrase = (phrase: string, depth: number, verbose: boolean) => {
  const hierarchy = loadHierarchy();
  const words = phrase.split(/\s+/).map(normalizeString);
  const matches: Record<string, number> = {};
  const verifiedWords = new Set<string>(); // Para evitar contar uma palavra mais de uma vez
  const startVerifyTime = Date.now();

  // Função recursiva para percorrer a hierarquia
  const searchHierarchy = (node: any, currentDepth: number) => {
    if (currentDepth === depth) {
      words.forEach(word => {
        if (verifiedWords.has(word)) return; // Evita verificar a mesma palavra várias vezes

        logVerbose(`Verificando palavra: ${word} no nível ${currentDepth}`, verbose);
        if (node && typeof node === 'object') {
          Object.entries(node).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              const normalizedArray = value.map(normalizeString);
              logVerbose(`Verificando array na categoria ${key}: ${normalizedArray}`, verbose);
              if (normalizedArray.includes(word)) {
                logVerbose(`Palavra encontrada na categoria: ${key}`, verbose);
                matches[key] = (matches[key] || 0) + 1;
                verifiedWords.add(word); // Marca a palavra como verificada
              }
            } else if (typeof value === 'object') {
              logVerbose(`Descendo na subcategoria: ${key}`, verbose);
              searchHierarchy(value, currentDepth); // Continua a verificação nas subcategorias
            }
          });
        }
      });
    } else if (currentDepth < depth) {
      Object.keys(node).forEach(key => {
        logVerbose(`Descendo na subcategoria: ${key} no nível ${currentDepth + 1}`, verbose);
        const subNode = node[key];
        searchHierarchy(subNode, currentDepth + 1);
      });
    }
  };

  const start = Date.now();
  searchHierarchy(hierarchy, 1);
  const end = Date.now();
  const verifyEnd = Date.now();

  // Exibe as métricas se o verbose for habilitado
  if (verbose) {
    console.log(`Tempo de carregamento dos parâmetros: ${end - start}ms`);
    console.log(`Tempo de verificação da frase: ${verifyEnd - startVerifyTime}ms`);
  }

  // Exibe os resultados ou 0 se não houver correspondências
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

// Função principal para processar os argumentos da linha de comando
const main = () => {
  const args = process.argv.slice(2);
  const depthIndex = args.indexOf('--depth');
  const phraseIndex = args.indexOf('--phrase');
  const verboseIndex = args.indexOf('--verbose');

  // Verificação de parâmetros obrigatórios
  if (depthIndex === -1 || phraseIndex === -1) {
    console.error('Erro: Parâmetros obrigatórios --depth e --phrase não fornecidos.');
    process.exit(1);
  }

  const depth = parseInt(args[depthIndex + 1], 10);
  const phrase = args[phraseIndex + 1];
  const verbose = verboseIndex !== -1;

  analyzePhrase(phrase, depth, verbose);
};

// Executa a função main somente se o arquivo for executado diretamente via CLI
if (require.main === module) {
  main();
}
