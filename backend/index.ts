import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const PORT = 3001;
const FILE_PATH = './dicts/words.json';

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
app.get('/words', (req, res) => {
  const words = loadWords();
  res.json(words);
});

// Rota para adicionar novas palavras
app.post('/words', (req, res) => {
  const newWord: WordHierarchy = req.body;
  const words = loadWords();
  
  // Lógica para adicionar a nova palavra na hierarquia
  // Aqui você deve implementar a lógica para integrar `newWord` na estrutura existente.
  // Exemplo:
  // words['nova_categoria'] = newWord;

  saveWords(words);
  res.status(201).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
