import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = Router();
const FILE_PATH = path.join(__dirname, '../dicts', 'hierarchy.json');

// Função para normalizar strings (converte para minúsculas, remove acentos e espaços extras)
const normalizeString = (str: string): string => {
    return str
        .toLowerCase() // Converte para minúsculas
        .normalize("NFD") // Normaliza acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .trim(); // Remove espaços extras no início e fim
};

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
    console.log(`Navigating categories: ${categories.join(' -> ')}`); // Log para depuração

    for (const category of categories) {
        console.log(`Current level keys:`, Object.keys(currentLevel!));  // Log das chaves do nível atual
        console.log(`Searching for normalized category: ${normalizeString(category)}`);

        if (!currentLevel || Array.isArray(currentLevel)) {
            console.log(`Category "${category}" not found.`);
            return null; // Categoria não encontrada ou caminho incorreto
        }

        // Normaliza as chaves do nível atual para garantir a correspondência correta
        const normalizedKeys = Object.keys(currentLevel).map((key) => normalizeString(key));
        const normalizedCategory = normalizeString(category);
        const keyIndex = normalizedKeys.indexOf(normalizedCategory);

        if (keyIndex === -1) {
            console.log(`Normalized category "${normalizedCategory}" not found.`);
            return null; // Categoria não encontrada
        }

        // Acessa o próximo nível com a chave correta (não normalizada)
        const actualKey = Object.keys(currentLevel)[keyIndex];
        currentLevel = currentLevel[actualKey] as WordHierarchy | string[];
    }

    console.log(`Final level:`, currentLevel);  // Log do nível final após a navegação
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

    console.log(`Received request to add word: "${newWord}" under category: "${category}"`);

    if (!newWord || typeof newWord !== 'string') {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();
    const normalizedCategory = normalizeString(category); // Normaliza a categoria
    const normalizedWord = normalizeString(newWord); // Normaliza a palavra

    // Navegar para a categoria correta usando a string normalizada
    const categories = normalizedCategory.split('.');
    let currentLevel = navigateToCategory(words, categories);

    // Se o nível atual for null, significa que a categoria não foi encontrada, então vamos adicionar na raiz
    if (!currentLevel) {
        console.log(`Category "${category}" not found after navigation, adding at root.`);
        if (!words[normalizedWord]) {
            words[normalizedWord] = {}; // Adiciona a nova palavra como chave na raiz
            console.log(`Added word: "${normalizedWord}" to root.`);
        } else {
            return res.status(400).json({ error: 'A palavra já existe na raiz.' });
        }
        saveWords(words);
        return res.status(200).json({ message: 'Palavra adicionada com sucesso na raiz.' });
    }

    // Verificar se o nível atual contém subcategorias
    if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
        if (!currentLevel[normalizedWord]) {
            currentLevel[normalizedWord] = {}; // Adiciona a palavra como chave
            console.log(`Added word: "${normalizedWord}" to category: "${category}"`);
        } else {
            return res.status(400).json({ error: 'A palavra já existe na categoria.' });
        }
    } else {
        return res.status(400).json({ error: 'Falha ao adicionar palavra. Estrutura incorreta.' });
    }

    saveWords(words);
    return res.status(200).json({ message: 'Palavra adicionada com sucesso.' });
});

// Rota para editar uma palavra ou categoria
router.put('/edit', (req: Request, res: Response) => {
    const { oldWord, newWord, category } = req.body;

    console.log(`Received request to edit word: "${oldWord}" to "${newWord}" under category: "${category}"`);

    if (!oldWord || !newWord || typeof newWord !== 'string') {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();
    const normalizedCategory = normalizeString(category);
    const normalizedOldWord = normalizeString(oldWord);
    const normalizedNewWord = normalizeString(newWord);

    // Navegar para a categoria correta
    const categories = normalizedCategory ? normalizedCategory.split('.') : [];
    let currentLevel = navigateToCategory(words, categories);

    if (!currentLevel) {
        return res.status(400).json({ error: 'Categoria não encontrada.' });
    }

    // Verifica se a palavra existe na categoria
    if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
        if (currentLevel[normalizedOldWord]) {
            // Remove a palavra antiga
            const oldWordEntry = currentLevel[normalizedOldWord];
            delete currentLevel[normalizedOldWord];

            // Adiciona a nova palavra
            currentLevel[normalizedNewWord] = oldWordEntry;
            saveWords(words);
            return res.status(200).json({ message: 'Palavra editada com sucesso.' });
        } else {
            return res.status(400).json({ error: 'A palavra não existe na categoria.' });
        }
    } else {
        return res.status(400).json({ error: 'Falha ao editar palavra. Estrutura incorreta.' });
    }
});


// Rota para deletar uma palavra ou categoria
router.delete('/delete', (req: Request, res: Response) => {
    const { wordToDelete, category } = req.body;

    console.log(`Received request to delete word: "${wordToDelete}" under category: "${category}"`);

    if (!wordToDelete) {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();
    const normalizedWordToDelete = normalizeString(wordToDelete);
    const normalizedCategory = category ? normalizeString(category) : 'root';

    // Verifica se a exclusão é no nível raiz
    if (normalizedCategory === 'root') {
        if (words[normalizedWordToDelete]) {
            delete words[normalizedWordToDelete];
            saveWords(words);
            return res.status(200).json({ message: 'Palavra/categoria removida com sucesso.' });
        } else {
            return res.status(400).json({ error: 'A palavra/categoria não existe na raiz.' });
        }
    }

    // Navegar para a categoria correta
    const categories = normalizedCategory.split('.');
    let currentLevel = navigateToCategory(words, categories);

    if (!currentLevel) {
        return res.status(400).json({ error: 'Categoria não encontrada.' });
    }

    // Verifica se a palavra existe na categoria
    if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
        if (currentLevel[normalizedWordToDelete]) {
            delete currentLevel[normalizedWordToDelete];
            saveWords(words);
            return res.status(200).json({ message: 'Palavra/categoria removida com sucesso.' });
        } else {
            return res.status(400).json({ error: 'A palavra/categoria não existe na categoria.' });
        }
    } else {
        return res.status(400).json({ error: 'Falha ao remover palavra. Estrutura incorreta.' });
    }
});






export default router;



