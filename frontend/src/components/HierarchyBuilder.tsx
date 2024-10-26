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


const normalizeString = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};


interface WordNode {
    name: string;
    children: WordNode[];
    parent?: WordNode;
}


const convertObjectToArray = (obj: any, parent: WordNode | null = null): WordNode[] => {
    const result: WordNode[] = [];
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const node: WordNode = {
                    name: key,
                    children: [],
                    parent: parent || undefined,
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

// Função de filtro baseada na query de busca
const filterHierarchy = (nodes: WordNode[], query: string): WordNode[] => {
    if (!query) return nodes;

    return nodes.reduce<WordNode[]>((acc, node) => {
        if (normalizeString(node.name).includes(normalizeString(query))) {
            acc.push(node);
        }

        const filteredChildren = filterHierarchy(node.children, query);
        if (filteredChildren.length > 0) {
            acc.push({
                ...node,
                children: filteredChildren,
            });
        }

        return acc;
    }, []);
};


const HierarchyBuilder: React.FC = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [filteredHierarchy, setFilteredHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeToRemove, setNodeToRemove] = useState<WordNode | null>(null);




    // Função para buscar a hierarquia do backend
    const loadHierarchy = async () => {
        try {
            const response = await fetch('http://localhost:3001/words');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const hierarchyArray = convertObjectToArray(data);
            setHierarchy(hierarchyArray);
            setFilteredHierarchy(hierarchyArray);
        } catch (error) {
            toast.error('Failed to load hierarchy from backend.');
        }
    };



    // Atualiza a hierarquia filtrada com base na busca
    useEffect(() => {
        setFilteredHierarchy(filterHierarchy(hierarchy, searchQuery));
    }, [searchQuery, hierarchy]);

    // useEffect para carregar a hierarquia na montagem do componente
    useEffect(() => {
        loadHierarchy();
    }, []);

    // Função para verificar se uma palavra já existe em qualquer nível da hierarquia
    const wordExistsInHierarchy = (nodes: WordNode[], word: string): boolean => {
        return nodes.some(node =>
            normalizeString(node.name) === normalizeString(word) ||
            wordExistsInHierarchy(node.children, word)
        );
    };

    // Função para adicionar palavras/categorias
    const addWord = async () => {
        console.log('New Word:', newWord);
        console.log('Selected Parent:', selectedParent);

        // Validação da nova palavra
        if (!newWord.trim()) {
            toast.error('Please enter a word.');
            return;
        }

        if (newWord.length > 30) {
            toast.error('Word must not exceed 30 characters.');
            return;
        }

        // Verifica se a palavra já existe em qualquer nível da hierarquia
        const exists = wordExistsInHierarchy(hierarchy, newWord);
        if (exists) {
            toast.error('This word already exists in the hierarchy.');
            return;
        }

        const newNode: WordNode = { name: newWord, children: [], parent: selectedParent };

        try {
            const categoryPath = getCategoryPath(selectedParent);
            const payload = {
                category: categoryPath || 'root',
                newWord: normalizeString(newWord),
            };
            console.log('Sending to backend:', payload);


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
                console.error('Error response from backend:', errorData);
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
        setSelectedParent(node);
    };

    // Função recursiva para renderizar opções do select com subcategorias
    const renderOptions = (nodes: WordNode[]): JSX.Element[] => {
        return nodes.flatMap((node, index) => [
            <option key={`${getCategoryPath(node)}-${index}`} value={getCategoryPath(node)}>
                {node.name}
            </option>,
            ...(node.children.length > 0 ? renderOptions(node.children) : [])
        ]);
    };

    const handleRemoveNode = (nodeToRemove: WordNode) => {
        // Função para remover o nó da hierarquia local
        const removeNodeFromHierarchy = (nodes: WordNode[], nodeToRemove: WordNode): WordNode[] => {
            return nodes
                .filter(node => node !== nodeToRemove) // Filtra o nó a ser removido
                .map(node => ({
                    ...node,
                    children: removeNodeFromHierarchy(node.children, nodeToRemove), // Chamada recursiva para os filhos
                }));
        };

        // Atualizar a hierarquia após remoção
        setHierarchy(prevHierarchy => removeNodeFromHierarchy(prevHierarchy, nodeToRemove));

        // Chamar a remoção no backend
        const categoryPath = getCategoryPath(nodeToRemove.parent || null) || 'root';
        fetch('http://localhost:3001/words/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wordToDelete: nodeToRemove.name,
                category: categoryPath,
            }),
        })
            .then(response => {
                if (response.ok) {
                    toast.success('Word deleted successfully!');
                } else {
                    return response.json().then(data => {
                        toast.error(`Failed to delete word: ${data.error}`);
                    });
                }
            })
            .catch(error => {
                toast.error('An error occurred while deleting the word.');
            });
    };





    return (
        <div className="p-6 w-full max-w-5xl mx-auto border-2 rounded-lg bg-white dark:bg-gray-300 border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 ">Create Word Hierarchy</h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex mb-4">
                <Input
                    type="text"
                    placeholder="Adicione a Palavra:"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow mr-2 bg-white text-gray-800 dark:text-gray-800 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-800"
                />
                <select
                    onChange={(e) => {
                        const selectedPath = e.target.value;
                        const findNodeByPath = (nodes: WordNode[], path: string): WordNode | null => {
                            for (const node of nodes) {
                                if (getCategoryPath(node) === path) return node;
                                const foundInChildren = findNodeByPath(node.children, path);
                                if (foundInChildren) return foundInChildren;
                            }
                            return null;
                        };
                        const selectedNode = findNodeByPath(hierarchy, selectedPath);
                        setSelectedParent(selectedNode);
                    }}
                    value={selectedParent ? getCategoryPath(selectedParent) : ''}
                    className="border border-gray-300 rounded px-4 py-2 flex-grow mr-2 bg-white text-gray-800 dark:text-gray-800 dark:border-gray-600"
                >
                    <option value="">Selecione uma Categoria</option>
                    {renderOptions(hierarchy)}
                </select>
                <Button onClick={addWord} className="flex items-center bg-violet-600 text-white rounded px-4 py-2 hover:bg-violet-700 transition-colors">
                    <FaPlus className="mr-2" /> Salvar
                </Button>
            </div>
            {selectedParent && <p className="mt-4 text-lg text-gray-700">Categoria Selecionada: <strong>{selectedParent.name}</strong></p>}
            <HierarchyTree
                nodes={filteredHierarchy}
                onNodeClick={setSelectedParent}
                selectedParent={selectedParent}
                onRemove={handleRemoveNode}
            />





            <SaveButton hierarchy={hierarchy} />

            <Dialog open={!!nodeToRemove} onOpenChange={() => setNodeToRemove(null)}>
                <DialogTrigger asChild>
                    <button className="hidden" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tem certeza de que deseja remover esta palavra?</DialogTitle>
                        <DialogDescription>
                        Esta ação não pode ser desfeita. Por favor, confirme se você deseja prosseguir.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button className="bg-red-500 text-white rounded px-4 py-2 mr-2 hover:bg-red-600 transition-colors">
                            Confirmar
                        </Button>
                        <Button onClick={() => setNodeToRemove(null)} className="bg-white text-black border-2 border-gray-100 rounded px-4 py-2 hover:bg-gray-100 transition-colors">
                            Cancelar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HierarchyBuilder;
