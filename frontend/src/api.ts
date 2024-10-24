import axios from 'axios';
import { Word } from './types'; // Ajuste o caminho conforme a estrutura do seu projeto

const API_URL = 'http://localhost:3001';

// Função para obter a hierarquia de palavras
export const getWords = async (): Promise<Word[]> => {
  const response = await axios.get(`${API_URL}/words`);
  return response.data;
};

// Função para adicionar uma nova palavra na hierarquia
export const addWord = async (newWord: Word[]): Promise<void> => {
  await axios.post(`${API_URL}/words`, newWord);
};
