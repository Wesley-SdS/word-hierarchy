// app/components/HierarchyBuilder.tsx
'use client';

import { useState } from 'react';

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

    const renderHierarchy = (nodes: WordNode[], parentNode: WordNode | null = null, level = 0) => {
        return (
            <ul>
                {nodes.map((node, index) => (
                    <li key={index} style={{ marginLeft: `${level * 20}px` }}>
                        {isEditingNode === node ? (
                            <>
                                <input
                                    type="text"
                                    value={editWord || ''}
                                    onChange={(e) => setEditWord(e.target.value)}
                                    onBlur={saveEdit} // Salva automaticamente quando o campo perde o foco
                                />
                                <button onClick={saveEdit}>Save</button>
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={() => setSelectedParent(node)}
                                    style={{ cursor: 'pointer', fontWeight: selectedParent?.name === node.name ? 'bold' : 'normal' }}
                                >
                                    {node.name}
                                </span>
                                <button onClick={() => editNode(node)} style={{ marginLeft: '10px', color: 'blue' }}>
                                    Edit
                                </button>
                                <button onClick={() => removeWord(node, parentNode)} style={{ marginLeft: '10px', color: 'red' }}>
                                    Remove
                                </button>
                            </>
                        )}
                        {renderHierarchy(node.children, node, level + 1)}
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
        <div>
            <h1>Create Word Hierarchy</h1>
            <input
                type="text"
                placeholder="Enter word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
            />
            <button onClick={addWord}>Add Word</button>

            {selectedParent && <p>Selected Parent: {selectedParent.name}</p>}

            <div>
                <h2>Hierarchy Preview:</h2>
                {renderHierarchy(hierarchy)}
            </div>

            <button onClick={saveHierarchy}>Save as JSON</button>
        </div>
    );
};

export default HierarchyBuilder;
