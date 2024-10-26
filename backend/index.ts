import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import wordsRouter from './routes/words';

const app = express();
const PORT = 3001;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Rotas relacionadas à hierarquia de palavras
app.use('/words', wordsRouter);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
