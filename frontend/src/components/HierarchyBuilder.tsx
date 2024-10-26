'use client';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SearchBar from './SearchBar';
import SaveButton from './SaveButton';
import HierarchyTree from './HierarchyTree';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Definição da interface
interface WordNode {
    name: string;
    children: WordNode[];
}

// Função para converter o objeto JSON em um array de WordNode
const convertObjectToArray = (obj: any): WordNode[] => {
    const result: WordNode[] = [];
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (Array.isArray(value)) {
                    result.push({
                        name: key,
                        children: value.map((child) => ({ name: child, children: [] })),
                    });
                } else {
                    result.push({
                        name: key,
                        children: convertObjectToArray(value),
                    });
                }
            }
        }
    }
    return result;
};

// Estrutura básica do componente
const HierarchyBuilder: React.FC = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeToRemove, setNodeToRemove] = useState<WordNode | null>(null);

    // Função para buscar a hierarquia do backend
    const loadHierarchy = async () => {
        try {
            const response = await fetch('http://localhost:3001/words'); // Endpoint GET
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const hierarchyArray = convertObjectToArray(data); // Converter para array de WordNode
            setHierarchy(hierarchyArray); // Atualizar o estado com a hierarquia
        } catch (error) {
            console.error('Error loading hierarchy:', error); // Detalhe o erro aqui
            toast.error('Failed to load hierarchy from backend.');
        }
    };

    // useEffect para carregar a hierarquia na montagem do componente
    useEffect(() => {
        loadHierarchy();
    }, []);

    // Função para adicionar palavras/categorias
    const addWord = async () => {
        if (!newWord.trim()) {
            toast.error('Please enter a word.');
            return;
        }

        if (newWord.length > 30) {
            toast.error('Word must not exceed 30 characters.');
            return;
        }

        const exists = hierarchy.some(node => node.name.toLowerCase() === newWord.toLowerCase());
        if (exists) {
            toast.error('This word already exists in the hierarchy.');
            return;
        }

        const newNode: WordNode = { name: newWord, children: [] };

        try {
            // POST com a palavra e categoria, supondo que category seja "root" ou a categoria selecionada.
            const response = await fetch('http://localhost:3001/words/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: selectedParent ? selectedParent.name : 'root', // 'root' se não houver parent
                    newWord: newWord,
                }),
            });

            if (response.ok) {
                const updatedHierarchy = selectedParent
                    ? addChildToParent(hierarchy, selectedParent.name, newNode)
                    : [...hierarchy, newNode];

                setHierarchy(updatedHierarchy);
                toast.success('Word added successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to add word: ${errorData.error}`);
            }
        } catch (error) {
            toast.error('An error occurred while adding the word.');
            console.error('Error adding word:', error);
        }

        setNewWord('');
        setSelectedParent(null);
    };


    // Função para adicionar um filho à hierarquia
    const addChildToParent = (nodes: WordNode[], parentName: string, child: WordNode): WordNode[] => {
        return nodes.map((node) => {
            if (node.name === parentName) {
                return {
                    ...node,
                    children: [...node.children, child],
                };
            } else if (node.children.length > 0) {
                return {
                    ...node,
                    children: addChildToParent(node.children, parentName, child),
                };
            }
            return node;
        });
    };

    return (
        <div className="p-6 w-full max-w-5xl mx-auto border-2 rounded-lg">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Create Word Hierarchy</h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex mb-4">
                <Input
                    type="text"
                    placeholder="Enter word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow mr-2 bg-white text-gray-800 dark:text-gray-200 dark:border-gray-600"
                />
                <Button onClick={addWord} className="flex items-center bg-violet-600 text-white rounded px-4 py-2 hover:bg-violet-700 transition-colors">
                    <FaPlus className="mr-2" /> Add
                </Button>
            </div>
            {selectedParent && <p className="mt-4 text-lg text-gray-600">Selected Parent: <strong>{selectedParent.name}</strong></p>}
            <HierarchyTree nodes={hierarchy} onNodeClick={() => { }} selectedParent={selectedParent} />
            <SaveButton hierarchy={hierarchy} />

            <Dialog open={!!nodeToRemove} onOpenChange={() => setNodeToRemove(null)}>
                <DialogTrigger asChild>
                    <button className="hidden" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to remove this word?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Please confirm if you want to proceed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button className="bg-red-500 text-white rounded px-4 py-2 mr-2 hover:bg-red-600 transition-colors">
                            Confirm
                        </Button>
                        <Button onClick={() => setNodeToRemove(null)} className="bg-white text-black border-2 border-gray-100 rounded px-4 py-2 hover:bg-gray-100 transition-colors">
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HierarchyBuilder;
