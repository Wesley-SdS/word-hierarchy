import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = Router();
const FILE_PATH = path.join(__dirname, '../dicts', 'hierarchy.json');

// Tipo para a hierarquia de palavras
type WordHierarchy = {
    [key: string]: WordHierarchy | string[] | { palavras: string[] };
};

// Carregar a hierarquia de palavras do JSON
const loadWords = (): WordHierarchy => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao carregar as palavras:', error);
        return {}; // Retorne um objeto vazio em caso de erro
    }
};

// Salvar a hierarquia de palavras no JSON
const saveWords = (data: WordHierarchy) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao salvar as palavras:', error);
    }
};

// Função auxiliar para navegar até a categoria correta
const navigateToCategory = (words: WordHierarchy, categories: string[]): WordHierarchy | string[] | null => {
    let currentLevel: WordHierarchy | string[] | null = words;

    for (const category of categories) {
        if (!currentLevel || Array.isArray(currentLevel)) {
            return null; // Categoria não encontrada ou caminho incorreto
        }
        currentLevel = currentLevel[category] as WordHierarchy | string[];
    }
    return currentLevel;
};

// Rota para obter a hierarquia de palavras
router.get('/', (req: Request, res: Response) => {
    try {
        const words = loadWords();
        res.json(words);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load hierarchy.' });
    }
});

// Rota para adicionar uma nova palavra ou categoria
router.post('/add', (req: Request, res: Response) => {
    const { category, newWord } = req.body;

    if (!newWord || typeof newWord !== 'string') {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();

    // Lida com categorias aninhadas
    if (category === 'root') {
        words[newWord] = {}; // Adiciona nova palavra na raiz
    } else {
        const categories = category.split('.');
        let currentLevel = navigateToCategory(words, categories);

        if (!currentLevel) {
            return res.status(400).json({ error: 'Categoria não encontrada.' });
        }

        // Verifica se `currentLevel` é um objeto antes de indexá-lo
        if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
            currentLevel[newWord] = {}; // Adiciona a nova palavra como uma chave na categoria existente
        } else {
            return res.status(400).json({ error: 'Falha ao adicionar palavra. Estrutura incorreta.' });
        }
    }

    // Salvar a estrutura atualizada
    saveWords(words);

    return res.status(200).json({ message: 'Palavra adicionada com sucesso.' });
});




export default router;
