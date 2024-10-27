import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
const router: Router = Router();
const FILE_PATH = path.join(__dirname, '../dicts', 'hierarchy.json');

type WordHierarchy = {
    [key: string]: WordHierarchy | string[] | { palavras: string[] };
};

const normalizeString = (str: string): string => {
    return str
        .toLowerCase() 
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .trim(); 
};

const loadWords = (): WordHierarchy => {
    try {

        delete require.cache[require.resolve(FILE_PATH)];
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        
        return {};
    }
};


const saveWords = (data: WordHierarchy) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        
    }
};


const navigateToCategory = (words: WordHierarchy, categories: string[]): WordHierarchy | string[] | null => {
    let currentLevel: WordHierarchy | string[] | null = words;
    

    for (const category of categories) {
        if (!currentLevel || Array.isArray(currentLevel)) {
            
            return null; 
        }

        const normalizedKeys = Object.keys(currentLevel).map((key) => normalizeString(key));
        const normalizedCategory = normalizeString(category);
        const keyIndex = normalizedKeys.indexOf(normalizedCategory);

        if (keyIndex === -1) {
            
            return null; 
        }

        const actualKey = Object.keys(currentLevel)[keyIndex];
        currentLevel = currentLevel[actualKey] as WordHierarchy | string[];
    }

    return currentLevel;
};

router.get('/', (req: Request, res: Response) => {
    try {
        const words = loadWords();
        res.json(words);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load hierarchy.' });
    }
});

router.post('/add', (req: Request, res: Response) => {
    const { category, newWord } = req.body;

    if (!newWord || typeof newWord !== 'string') {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();
    const normalizedCategory = normalizeString(category); 
    const normalizedWord = normalizeString(newWord); 
    const categories = normalizedCategory.split('.');
    let currentLevel = navigateToCategory(words, categories);

    if (!currentLevel) {
       
        if (!words[normalizedWord]) {
            words[normalizedWord] = {}; 
            
        } else {
            return res.status(400).json({ error: 'A palavra já existe na raiz.' });
        }
        saveWords(words);
        return res.status(200).json({ message: 'Palavra adicionada com sucesso na raiz.' });
    }


    if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
        if (!currentLevel[normalizedWord]) {
            currentLevel[normalizedWord] = {}; 
            
        } else {
            return res.status(400).json({ error: 'A palavra já existe na categoria.' });
        }
    } else {
        return res.status(400).json({ error: 'Falha ao adicionar palavra. Estrutura incorreta.' });
    }

    saveWords(words);
    return res.status(200).json({ message: 'Palavra adicionada com sucesso.' });
});

router.put('/edit', (req: Request, res: Response) => {
    const { oldWord, newWord, category } = req.body;
    if (!oldWord || !newWord || typeof newWord !== 'string') {
      return res.status(400).json({ error: 'Palavra inválida.' });
    }
  
    const words = loadWords();
    const normalizedCategory = normalizeString(category);
    const normalizedOldWord = normalizeString(oldWord);
    const normalizedNewWord = normalizeString(newWord);
    const categories = normalizedCategory ? normalizedCategory.split('.') : [];
    let currentLevel = navigateToCategory(words, categories);
  
    if (!currentLevel) {
      
      return res.status(400).json({ error: 'Categoria não encontrada.' });
    }
  
    
    if (typeof currentLevel === 'object' && !Array.isArray(currentLevel)) {
      
      if (currentLevel[normalizedNewWord]) {
        
        return res.status(400).json({ error: 'A palavra já existe com o novo nome.' });
      }
  
      if (currentLevel[normalizedOldWord]) {
        
        const oldWordEntry = currentLevel[normalizedOldWord];
        delete currentLevel[normalizedOldWord];
  
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
  

router.delete('/delete', (req: Request, res: Response) => {
    const { wordToDelete, category } = req.body;

    if (!wordToDelete) {
        return res.status(400).json({ error: 'Palavra inválida.' });
    }

    const words = loadWords();
    const normalizedWordToDelete = normalizeString(wordToDelete);
    const normalizedCategory = category ? normalizeString(category) : 'root';

    
    if (normalizedCategory === 'root') {
        if (words[normalizedWordToDelete]) {
            delete words[normalizedWordToDelete];
            saveWords(words);
            return res.status(200).json({ message: 'Palavra/categoria removida com sucesso.' });
        } else {
            return res.status(400).json({ error: 'A palavra/categoria não existe na raiz.' });
        }
    }

    
    const categories = normalizedCategory.split('.');
    let currentLevel = navigateToCategory(words, categories);

    if (!currentLevel) {
        return res.status(400).json({ error: 'Categoria não encontrada.' });
    }

    
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



