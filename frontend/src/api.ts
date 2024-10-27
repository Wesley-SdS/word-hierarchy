import axios from 'axios';
import { Word } from './types'; 

const API_URL = 'http://localhost:3001';


export const getWords = async (): Promise<Word[]> => {
  const response = await axios.get(`${API_URL}/words`);
  return response.data;
};


export const addWord = async (newWord: Word[]): Promise<void> => {
  await axios.post(`${API_URL}/words`, newWord);
};
