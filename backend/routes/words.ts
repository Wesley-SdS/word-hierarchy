import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router: Router = Router();
const FILE_PATH = path.join(__dirname, '../dicts', 'hierarchy.json');

// Tipo para a hierarquia de palavras
type WordHierarchy = {
    [key: string]: WordHierarchy | string[];
};

// Carregar a hierarquia de palavras do JSON
const loadWords = (): WordHierarchy => {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
};

// Salvar a hierarquia de palavras no JSON
const saveWords = (data: WordHierarchy) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Rota para obter a hierarquia de palavras
router.get('/', (req: Request, res: Response) => {
    const words = loadWords();
    res.json(words);
});

router.post('/', (req: Request, res: Response) => {
    const { category, newWord }: { category: string; newWord: string } = req.body;
    const words = loadWords();
    const categories = category.split('.'); // Divide a categoria por ponto

    let currentLevel: WordHierarchy | string[] = words;

    // Navega pela hierarquia para encontrar ou criar a categoria
    for (const cat of categories) {
        if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
            if (currentLevel[cat]) {
                currentLevel = currentLevel[cat] as WordHierarchy | string[];
            } else {
                // Se a categoria não existe, cria-a como um objeto
                currentLevel[cat] = [];
                currentLevel = currentLevel[cat] as WordHierarchy | string[]; // Cast para array ou WordHierarchy
            }
        } else {
            // Se a categoria é um array de palavras, isso significa que já estamos no nível de palavras
            return res.status(400).json({ error: `A categoria final '${cat}' não pode conter palavras.` });
        }
    }

    // Verifica se a categoria final é um array e adiciona a nova palavra
    if (Array.isArray(currentLevel)) {
        if (!currentLevel.includes(newWord)) {
            currentLevel.push(newWord);
        } else {
            return res.status(400).json({ error: 'Palavra já existe na categoria.' });
        }
    } else {
        // Se a categoria final não for um array, isso é um erro
        return res.status(400).json({ error: 'A categoria final não pode conter palavras.' });
    }

    saveWords(words);
    return res.status(201).json({ message: 'Palavra adicionada com sucesso.' });
});


export default router;
