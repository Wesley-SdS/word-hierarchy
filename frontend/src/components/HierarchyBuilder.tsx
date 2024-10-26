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

// Função para normalizar strings (converte para minúsculas, remove acentos e espaços extras)
const normalizeString = (str: string): string => {
    return str
        .toLowerCase() // Converte para minúsculas
        .normalize("NFD") // Normaliza acentos
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .trim(); // Remove espaços extras no início e fim
};

// Definição da interface
interface WordNode {
    name: string;
    children: WordNode[];
    parent?: WordNode;  // Adiciona referência ao pai para construir o caminho
}

// Função para converter o objeto JSON em um array de WordNode
const convertObjectToArray = (obj: any, parent: WordNode | null = null): WordNode[] => {
    const result: WordNode[] = [];
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const node: WordNode = {
                    name: key,
                    children: [],
                    parent: parent || undefined,  // Mantém a referência ao pai
                };
                if (Array.isArray(value)) {
                    node.children = value.map((child) => ({
                        name: child,
                        children: [],
                        parent: node,
                    }));
                } else {
                    node.children = convertObjectToArray(value, node);
                }
                result.push(node);
            }
        }
    }
    return result;
};

// Função para construir o caminho completo de uma categoria
const getCategoryPath = (node: WordNode | null): string => {
    if (!node) return '';
    let path = node.name;
    let currentNode = node.parent;
    while (currentNode) {
        path = `${currentNode.name}.${path}`;
        currentNode = currentNode.parent;
    }
    return path;
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
            console.log('Data from backend:', data); // Debugging line
            const hierarchyArray = convertObjectToArray(data); // Converter para array de WordNode
            setHierarchy(hierarchyArray); // Atualizar o estado com a hierarquia
            console.log('Hierarchy Loaded:', hierarchyArray); // Verifique a hierarquia carregada
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
        console.log('New Word:', newWord);
        console.log('Selected Parent:', selectedParent);  // Adiciona um log para verificar o selectedParent

        // Validação da nova palavra
        if (!newWord.trim()) {
            toast.error('Please enter a word.');
            return;
        }

        if (newWord.length > 30) {
            toast.error('Word must not exceed 30 characters.');
            return;
        }

        // Verifica se a palavra já existe na hierarquia
        const exists = hierarchy.some(node => normalizeString(node.name) === normalizeString(newWord));
        if (exists) {
            toast.error('This word already exists in the hierarchy.');
            return;
        }

        const newNode: WordNode = { name: newWord, children: [], parent: selectedParent };

        try {
            const categoryPath = getCategoryPath(selectedParent);  // Obtem o caminho completo da categoria
            const payload = {
                category: categoryPath || 'root',  // Envia o caminho completo ou 'root' se não houver pai
                newWord: normalizeString(newWord),  // Normaliza a nova palavra
            };
            console.log('Sending to backend:', payload);  // Log para verificar o payload enviado

            // POST com a palavra e categoria
            const response = await fetch('http://localhost:3001/words/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Verificando a resposta do backend
            if (response.ok) {
                const updatedHierarchy = selectedParent
                    ? addChildToParent(hierarchy, selectedParent.name, newNode)
                    : [...hierarchy, newNode];

                setHierarchy(updatedHierarchy);
                toast.success('Word added successfully!');
            } else {
                const errorData = await response.json();
                console.error('Error response from backend:', errorData);  // Logando a resposta de erro do backend
                toast.error(`Failed to add word: ${errorData.error}`);
            }
        } catch (error) {
            toast.error('An error occurred while adding the word.');
            console.error('Error adding word:', error);
        }

        setNewWord('');
        setSelectedParent(null);
    };

    // Função para adicionar um filho à hierarquia de forma recursiva
    const addChildToParent = (nodes: WordNode[], parentName: string, child: WordNode): WordNode[] => {
        return nodes.map((node) => {
            if (normalizeString(node.name) === normalizeString(parentName)) {
                return {
                    ...node,
                    children: [...node.children, child],
                };
            } else if (node.children.length > 0) {
                return {
                    ...node,
                    children: addChildToParent(node.children, parentName, child),
                };
            } else {
                return node;
            }
        });
    };

    // Função para lidar com o clique na palavra da hierarquia
    const handleNodeClick = (node: WordNode) => {
        setSelectedParent(node); // Define o parent selecionado para a palavra clicada
    };

    // Função recursiva para renderizar opções do select com subcategorias
    const renderOptions = (nodes: WordNode[]): JSX.Element[] => {
        return nodes.map((node, index) => (
            <React.Fragment key={`${node.name}-${index}`}>  {/* Ajuste na key */}
                <option value={node.name}>{node.name}</option>
                {node.children.length > 0 && renderOptions(node.children)}
            </React.Fragment>
        ));
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
                <select
                    onChange={(e) => {
                        const selectedNode = hierarchy.find(node => normalizeString(node.name) === normalizeString(e.target.value)) || null;
                        setSelectedParent(selectedNode);
                    }}
                    value={selectedParent ? selectedParent.name : ''}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow mr-2 bg-white text-gray-800 dark:text-gray-200 dark:border-gray-600"
                >
                    <option value="">Select Parent Category</option>
                    {renderOptions(hierarchy)}
                </select>
                <Button onClick={addWord} className="flex items-center bg-violet-600 text-white rounded px-4 py-2 hover:bg-violet-700 transition-colors">
                    <FaPlus className="mr-2" /> Add
                </Button>
            </div>
            {selectedParent && <p className="mt-4 text-lg text-gray-600">Selected Parent: <strong>{selectedParent.name}</strong></p>}
            <HierarchyTree nodes={hierarchy} onNodeClick={handleNodeClick} selectedParent={selectedParent} />
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
