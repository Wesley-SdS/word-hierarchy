"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const PORT = 3001;
const FILE_PATH = './dicts/hierarchy.json'; // Atualize para usar o arquivo correto
// Carregar a hierarquia de palavras do JSON
const loadWords = () => {
    const data = fs_1.default.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
};
// Salvar a hierarquia de palavras no JSON
const saveWords = (data) => {
    fs_1.default.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};
// Rota para obter a hierarquia de palavras
app.get('/words', (req, res) => {
    const words = loadWords();
    res.json(words);
});
// Rota para adicionar novas palavras
app.post('/words', (req, res) => {
    const { path, newWord } = req.body; // Assumindo que o corpo contém um caminho e uma nova palavra
    const words = loadWords();
    // Navega até o caminho fornecido
    const pathArray = path.split('/'); // Divide o caminho em partes
    let currentNode = words;
    // Itera sobre o caminho até o penúltimo nó
    for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (!currentNode[key]) {
            return res.status(400).json({ error: `Caminho ${path} não encontrado.` });
        }
        currentNode = currentNode[key]; // Move para o próximo nível da hierarquia
    }
    // O último nó é onde queremos adicionar a nova palavra
    const lastKey = pathArray[pathArray.length - 1];
    // Verifica se o último nó é um array e adiciona a nova palavra
    if (Array.isArray(currentNode[lastKey])) {
        currentNode[lastKey].push(newWord);
    }
    else {
        return res.status(400).json({ error: `O nó ${lastKey} não é um array.` });
    }
    // Salva as mudanças de volta no arquivo
    saveWords(words);
    res.status(201).send();
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
