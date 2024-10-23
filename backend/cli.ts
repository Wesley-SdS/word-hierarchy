import * as fs from 'fs';
import * as path from 'path';

// Função para carregar a hierarquia do arquivo JSON
const loadHierarchy = () => {
  const filePath = path.join(__dirname, 'dicts', 'hierarchy.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Função para normalizar as strings (remover acentos, minúsculas, etc.)
const normalizeString = (str: string) => {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Função para analisar a frase
const analyzePhrase = (phrase: string, depth: number, verbose: boolean) => {
  const hierarchy = loadHierarchy();
  const words = phrase.split(/\s+/).map(normalizeString);
  const matches: Record<string, number> = {};
  const startVerifyTime = Date.now();

  const searchHierarchy = (node: any, currentDepth: number) => {
    if (currentDepth === depth) {
      words.forEach(word => {
        console.log(`Verificando palavra: ${word}`); // Log para verificar a palavra
        if (node && typeof node === 'object') {
          // Verifica se a palavra está presente como chave no objeto
          if (word in node) {
            console.log(`Palavra encontrada como chave: ${word}`); // Log para chave encontrada
            matches[word] = (matches[word] || 0) + 1;
          }
          // Verifica se a palavra está presente em arrays de valores
          Object.values(node).forEach(arr => {
            if (Array.isArray(arr)) {
              const normalizedArray = arr.map(normalizeString);
              if (normalizedArray.includes(word)) {
                console.log(`Palavra encontrada em array: ${word}`); // Log para array encontrado
                matches[word] = (matches[word] || 0) + 1;
              }
            }
          });
        }
      });
    } else {
      Object.keys(node).forEach(key => {
        searchHierarchy(node[key], currentDepth + 1);
      });
    }
  };

  const start = Date.now();
  searchHierarchy(hierarchy, 1);
  const end = Date.now();
  const verifyEnd = Date.now();

  // Exibe o resultado da análise
  if (verbose) {
    console.log(`Tempo de carregamento dos parâmetros: ${end - start}ms`);
    console.log(`Tempo de verificação da frase: ${verifyEnd - startVerifyTime}ms`);
  }

  if (Object.keys(matches).length === 0) {
    console.log('0');
  } else {
    const results = Object.entries(matches)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} = ${value}`)
      .join('; ');
    console.log(results);
  }
};

// Função principal para processar os argumentos da linha de comando
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

main();
