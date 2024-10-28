"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePhrase = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const loadHierarchy = () => {
    const startLoadTime = Date.now();
    const filePath = path.resolve(process.cwd(), 'dicts', 'hierarchy.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const hierarchy = JSON.parse(data);
    const endLoadTime = Date.now();
    return { hierarchy, loadTime: endLoadTime - startLoadTime };
};
const normalizeString = (() => {
    const cache = {};
    return (str) => {
        if (cache[str])
            return cache[str];
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
const analyzePhrase = (phrase, depth, verbose) => {
    const { hierarchy, loadTime } = loadHierarchy();
    const words = phrase.split(/[\s,]+/).map(normalizeString);
    const matches = {};
    const verifiedWords = new Set();
    const startVerifyTime = Date.now();
    const searchHierarchy = (rootNode, maxDepth) => {
        const normalizedCache = {};
        const getNormalizedKey = (key) => {
            if (normalizedCache[key])
                return normalizedCache[key];
            const normalizedKey = normalizeString(key);
            normalizedCache[key] = normalizedKey;
            return normalizedKey;
        };
        const stack = [{ node: rootNode, depth: 1 }];
        const maxWordsToCombine = 2;
        while (stack.length > 0) {
            const { node, depth } = stack.pop();
            if (depth <= maxDepth && node && typeof node === 'object') {
                for (let i = 0; i < words.length; i++) {
                    if (verifiedWords.has(words[i]))
                        continue;
                    for (let j = i + 1; j <= Math.min(words.length, i + maxWordsToCombine); j++) {
                        const subPhrase = words.slice(i, j).join(' ');
                        const normalizedSubPhrase = normalizeString(subPhrase);
                        if (verifiedWords.has(normalizedSubPhrase))
                            continue;
                        for (const [key, value] of Object.entries(node)) {
                            const normalizedKey = getNormalizedKey(key);
                            if (normalizedKey === normalizedSubPhrase) {
                                matches[normalizedKey] = (matches[normalizedKey] || 0) + 1;
                                verifiedWords.add(normalizedSubPhrase);
                                if (verifiedWords.size === words.length)
                                    return;
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
    }
    else {
        console.log(Object.entries(matches)
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} = ${value}`)
            .join('; '));
    }
};
exports.analyzePhrase = analyzePhrase;
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
}
;
