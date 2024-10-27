import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import wordsRouter from './routes/words';

const app = express();
const PORT = 3001;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(bodyParser.json());
app.use('/words', wordsRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
