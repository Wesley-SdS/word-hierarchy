
'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEllipsisV } from 'react-icons/fa';

interface WordNode {
    name: string;
    children: WordNode[];
}

const HierarchyBuilder = () => {
    const [hierarchy, setHierarchy] = useState<WordNode[]>([]);
    const [newWord, setNewWord] = useState('');
    const [selectedParent, setSelectedParent] = useState<WordNode | null>(null);
    const [editWord, setEditWord] = useState<string | null>(null);
    const [isEditingNode, setIsEditingNode] = useState<WordNode | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState<WordNode | null>(null);
    const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

    const addWord = () => {
        if (newWord.trim() === '') return;

        const newNode: WordNode = {
            name: newWord,
            children: [],
        };

        if (selectedParent) {
            const updatedHierarchy = addChildToParent(hierarchy, selectedParent.name, newNode);
            setHierarchy(updatedHierarchy);
        } else {
            setHierarchy([...hierarchy, newNode]);
        }

        setNewWord('');
        setSelectedParent(null);
    };

    const removeWord = (nodeToRemove: WordNode, parentNode: WordNode | null) => {
        if (!parentNode) {
            setHierarchy(hierarchy.filter(node => node !== nodeToRemove));
        } else {
            const updatedHierarchy = removeNodeFromParent(hierarchy, parentNode.name, nodeToRemove);
            setHierarchy(updatedHierarchy);
        }
    };

    const editNode = (nodeToEdit: WordNode) => {
        setEditWord(nodeToEdit.name);
        setIsEditingNode(nodeToEdit);
    };

    const saveEdit = () => {
        if (editWord === null || isEditingNode === null) return;

        const updatedHierarchy = hierarchy.map(node => {
            if (node === isEditingNode) {
                return { ...node, name: editWord };
            } else if (node.children.length > 0) {
                return { ...node, children: updateChildName(node.children, isEditingNode, editWord) };
            }
            return node;
        });

        setHierarchy(updatedHierarchy);
        setIsEditingNode(null);
        setEditWord(null);
    };

    const updateChildName = (children: WordNode[], nodeToEdit: WordNode, newName: string): WordNode[] => {
        return children.map(child => {
            if (child === nodeToEdit) {
                return { ...child, name: newName };
            } else if (child.children.length > 0) {
                return { ...child, children: updateChildName(child.children, nodeToEdit, newName) };
            }
            return child;
        });
    };

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
            } else {
                return node;
            }
        });
    };

    const removeNodeFromParent = (nodes: WordNode[], parentName: string, nodeToRemove: WordNode): WordNode[] => {
        return nodes.map((node) => {
            if (node.name === parentName) {
                return {
                    ...node,
                    children: node.children.filter(child => child !== nodeToRemove),
                };
            } else if (node.children.length > 0) {
                return {
                    ...node,
                    children: removeNodeFromParent(node.children, parentName, nodeToRemove),
                };
            } else {
                return node;
            }
        });
    };

    const renderHierarchy = (nodes: WordNode[], parentNode: WordNode | null = null) => {
        return (
            <ul className="list-disc pl-5 mb-4">
                {nodes.map((node, index) => (
                    <li key={index} className="mb-2 border-b pb-2">
                        {isEditingNode === node ? (
                            <>
                                <input
                                    type="text"
                                    value={editWord || ''}
                                    onChange={(e) => setEditWord(e.target.value)}
                                    onBlur={saveEdit} 
                                    className="border rounded px-2 py-1"
                                />
                                <button onClick={saveEdit} className="bg-blue-500 text-white rounded px-2 py-1 ml-2">
                                    Save
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span
                                    onClick={() => setSelectedParent(node)}
                                    className={`cursor-pointer ${selectedParent?.name === node.name ? 'font-bold' : 'normal'}`}
                                >
                                    {node.name}
                                </span>
                                <div
                                    className="relative"
                                    onMouseEnter={() => {
                                        clearTimeout(dropdownTimeout!); 
                                        setDropdownVisible(node);
                                    }}
                                    onMouseLeave={() => {
                                        const timeout = setTimeout(() => {
                                            setDropdownVisible(null);
                                        }, 200); // 200ms de delay
                                        setDropdownTimeout(timeout);
                                    }}
                                >
                                    <button className="focus:outline-none">
                                        <FaEllipsisV className="text-gray-500" />
                                    </button>
                                    {dropdownVisible === node && (
                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                                            <button
                                                onClick={() => editNode(node)}
                                                className="flex items-center px-4 py-2 text-yellow-700 hover:bg-yellow-100 w-full text-left"
                                            >
                                                <FaEdit className="mr-2" /> Edit
                                            </button>
                                            <button
                                                onClick={() => removeWord(node, parentNode)}
                                                className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 w-full text-left"
                                            >
                                                <FaTrash className="mr-2" /> Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {renderHierarchy(node.children, node)}
                    </li>
                ))}
            </ul>
        );
    };

    const saveHierarchy = () => {
        const dataStr = JSON.stringify(hierarchy, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hierarchy.json';
        link.click();
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Create Word Hierarchy</h1>
            <input
                type="text"
                placeholder="Enter word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="border rounded px-2 py-1 mb-4 w-full"
            />
            <button onClick={addWord} className="flex items-center bg-green-500 text-white rounded px-4 py-2 mb-4">
                <FaPlus className="mr-2" /> Add Word
            </button>

            {selectedParent && <p className="mt-4">Selected Parent: <strong>{selectedParent.name}</strong></p>}

            <div className="mt-4">
                <h2 className="text-xl font-semibold">Hierarchy Preview:</h2>
                {renderHierarchy(hierarchy)}
            </div>

            <button onClick={saveHierarchy} className="bg-blue-600 text-white rounded px-4 py-2 mt-4">
                Save as JSON
            </button>
        </div>
    );
};

export default HierarchyBuilder;
