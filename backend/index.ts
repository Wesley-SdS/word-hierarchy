// backend/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import wordsRouter from './routes/words';

const app = express();
app.use(bodyParser.json());

const PORT = 3001;

// Usar as rotas de palavras
app.use('/words', wordsRouter);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
